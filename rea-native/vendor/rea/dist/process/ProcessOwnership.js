import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { errorMessage, systemProcessOwnershipHost as systemHost, } from "./ProcessOwnershipObservation.js";
import { launcherIdentityFailure } from "./ProcessOwnershipIdentity.js";
import { descendantsOf, liveProcesses } from "./ProcessOwnershipProcessTree.js";
import { readProcessRunTokens } from "./ProcessRunTokenObservations.js";
import { compareUnicodeCodePoints } from "../domain/unicodeCodePointOrder.js";
const execFileAsync = promisify(execFile);
/**
 * Terminate one Windows process tree through the platform utility.
 *
 * This is a bounded P0 cleanup mechanism, not Job Object ownership proof. The
 * caller-visible Windows capability report remains unavailable until a native
 * authority verifies Job Object creation, membership, and cleanup semantics.
 */
export const cleanupWindowsProcessTree = async (rootPid, host = systemWindowsProcessTreeHost) => {
    if (!Number.isSafeInteger(rootPid) || rootPid <= 0)
        return { cleaned: false, reason: "Windows process-tree PID is invalid" };
    try {
        const result = await host.terminateTree(rootPid);
        return { cleaned: true, signaled: result === "terminated" };
    }
    catch (cause) {
        return {
            cleaned: false,
            reason: `Windows process-tree termination failed for PID ${String(rootPid)}: ${errorMessage(cause)}`,
        };
    }
};
const systemWindowsProcessTreeHost = {
    async terminateTree(rootPid) {
        try {
            await execFileAsync("taskkill.exe", ["/pid", String(rootPid), "/t", "/f"], { windowsHide: true, timeout: 5_000 });
            return "terminated";
        }
        catch (cause) {
            if (cause instanceof Error &&
                "code" in cause &&
                (cause.code === 128 || cause.code === "ESRCH"))
                return "missing";
            throw cause;
        }
    },
};
/** Read the capture run token currently exposed by one live process. */
export const readProcessRunId = async (pid, host = systemHost, signal) => (await host.environment(pid, signal)).REA_PROCESS_RUN_ID;
/** Keep unrelated-process uncertainty attached to every outcome of this cleanup attempt. */
const withUnverifiedObservations = (result, unverified) => unverified.length === 0 || (result.unverified?.length ?? 0) > 0
    ? result
    : { ...result, unverified };
/** Token-validate every rooted POSIX process group before signaling any. */
export const cleanupOwnedProcessGroup = async (ownership, host = systemHost) => {
    const processTable = await readLiveProcessTable(host);
    if (!processTable.available)
        return {
            cleaned: false,
            reason: `process table could not be inspected: ${processTable.reason}`,
        };
    const plan = await createOwnedCleanupPlan(ownership, processTable.processes, host);
    if ("cleaned" in plan)
        return plan;
    let signaled = false;
    for (const processGroupId of plan.signalOrder) {
        const revalidation = await revalidateOwnedProcessGroup(processGroupId, ownership, host, plan.tokenOwnedIdentities);
        if ("cleaned" in revalidation) {
            if (!revalidation.cleaned)
                return withUnverifiedObservations(revalidation, plan.unverified);
            return {
                ...revalidation,
                ...(revalidation.unverified?.length || plan.unverified.length === 0
                    ? {}
                    : { unverified: plan.unverified }),
            };
        }
        if (revalidation.empty)
            continue;
        try {
            host.signalGroup(processGroupId, "SIGKILL");
            signaled = true;
        }
        catch (cause) {
            const code = cause instanceof Error && "code" in cause ? cause.code : undefined;
            if (code !== "ESRCH")
                return withUnverifiedObservations({
                    cleaned: false,
                    reason: `owned process group signal failed: ${errorMessage(cause)}`,
                }, plan.unverified);
        }
    }
    if (plan.unresolved.length > 0)
        return cleanupValidationFailure(plan.unresolved, plan.unverified);
    return {
        cleaned: true,
        signaled,
        ...(plan.unverified.length === 0 ? {} : { unverified: plan.unverified }),
    };
};
/** Verify that no live process still carries an owned capture run token. */
export const verifyNoTokenOwnedProcesses = async (runId, host = systemHost, captureBaseline, relation) => {
    const processTable = await readLiveProcessTable(host);
    if (!processTable.available)
        return {
            cleaned: false,
            reason: `process table could not be inspected: ${processTable.reason}`,
        };
    const scan = await scanTokenOwnedProcesses(processTable.processes, runId, host, captureBaseline, relation);
    if (scan.failures.length > 0)
        return cleanupValidationFailure(scan.failures, scan.unverified);
    if (scan.owned.length > 0)
        return {
            cleaned: false,
            reason: "token-owned process remained after cleanup",
            ...(scan.unverified.length === 0 ? {} : { unverified: scan.unverified }),
        };
    return {
        cleaned: true,
        signaled: false,
        ...(scan.unverified.length === 0 ? {} : { unverified: scan.unverified }),
    };
};
const readLiveProcessTable = async (host) => {
    try {
        return {
            available: true,
            processes: liveProcesses(await host.listProcesses()),
        };
    }
    catch (cause) {
        return { available: false, reason: errorMessage(cause) };
    }
};
// A process-table read can race exit and retain the old state with an altered
// command. Only a fresh table proving that PID is no longer live can settle
// that mismatch; surviving group members still require normal token checks.
const settleLauncherExit = async (ownership, processes, host) => {
    const launcher = processes.find(({ pid }) => pid === ownership.leaderPid);
    if (launcher === undefined)
        return processes;
    const reason = launcherIdentityFailure(launcher, ownership);
    if (reason === null)
        return processes;
    const refreshed = await readLiveProcessTable(host);
    if (refreshed.available &&
        !refreshed.processes.some(({ pid }) => pid === launcher.pid)) {
        // Refreshing must not discard a surviving detached descendant's lineage,
        // including a child that changed groups while the launcher exited.
        const descendants = descendantsOf([launcher.pid], processes);
        const descendantPids = new Set(descendants.map(({ pid }) => pid));
        const descendantGroupIds = new Set(descendants.map(({ processGroupId }) => processGroupId));
        const refreshedDescendantPids = new Set(descendantsOf(descendants.map(({ pid }) => pid), refreshed.processes).map(({ pid }) => pid));
        if (refreshed.processes.some((process) => process.processGroupId !== ownership.processGroupId &&
            (refreshedDescendantPids.has(process.pid) ||
                descendantPids.has(process.pid) ||
                descendantGroupIds.has(process.processGroupId))))
            return { cleaned: false, reason };
        return refreshed.processes;
    }
    return { cleaned: false, reason };
};
const createOwnedCleanupPlan = async (ownership, initialProcesses, host) => {
    const processes = await settleLauncherExit(ownership, initialProcesses, host);
    if ("cleaned" in processes)
        return processes;
    const sampledProcessGroupIds = new Set((ownership.sampledProcessGroupIds ?? []).filter((processGroupId) => Number.isSafeInteger(processGroupId) && processGroupId > 0));
    const tokenOwned = ownership.sweepTokenOwnedProcesses === true
        ? await scanTokenOwnedProcesses(processes, ownership.runId, host, ownership.captureBaseline, {
            leaderPid: ownership.leaderPid,
            processGroupId: ownership.processGroupId,
            ...(sampledProcessGroupIds.size === 0
                ? {}
                : { sampledProcessGroupIds: [...sampledProcessGroupIds] }),
        })
        : { owned: [], failures: [], unverified: [], identities: new Map() };
    const tokenOwnedGroupIds = new Set(tokenOwned.owned.map(({ processGroupId }) => processGroupId));
    const launcher = processes.find(({ pid }) => pid === ownership.leaderPid);
    const rootMembers = processes.filter(({ processGroupId }) => processGroupId === ownership.processGroupId);
    if (launcher === undefined &&
        rootMembers.length === 0 &&
        tokenOwned.owned.length === 0 &&
        !processes.some(({ processGroupId }) => sampledProcessGroupIds.has(processGroupId)))
        return tokenOwned.failures.length > 0
            ? {
                signalOrder: [],
                tokenOwnedIdentities: tokenOwned.identities,
                unresolved: tokenOwned.failures,
                unverified: tokenOwned.unverified,
            }
            : {
                cleaned: true,
                signaled: false,
                ...(tokenOwned.unverified.length === 0
                    ? {}
                    : { unverified: tokenOwned.unverified }),
            };
    let descendants = [];
    if (launcher !== undefined) {
        descendants = descendantsOf([launcher.pid], processes);
    }
    const descendantPids = new Set(descendants.map(({ pid }) => pid));
    const processGroupIds = new Set([ownership.processGroupId]);
    for (const descendant of descendants)
        processGroupIds.add(descendant.processGroupId);
    for (const process of tokenOwned.owned)
        processGroupIds.add(process.processGroupId);
    for (const processGroupId of sampledProcessGroupIds)
        processGroupIds.add(processGroupId);
    const signalableGroups = new Set();
    const unresolved = [...tokenOwned.failures];
    const unverifiableSampledGroups = new Set();
    for (const processGroupId of processGroupIds) {
        if (processGroupId === ownership.processGroupId)
            continue;
        const groupLeader = processes.find(({ pid, processGroupId: observedGroupId }) => pid === processGroupId && observedGroupId === processGroupId);
        if ((groupLeader === undefined || !descendantPids.has(groupLeader.pid)) &&
            !tokenOwnedGroupIds.has(processGroupId) &&
            !sampledProcessGroupIds.has(processGroupId))
            return {
                cleaned: false,
                reason: "descendant process-group leader identity could not be verified",
            };
        if ((groupLeader === undefined || !descendantPids.has(groupLeader.pid)) &&
            !tokenOwnedGroupIds.has(processGroupId))
            unverifiableSampledGroups.add(processGroupId);
    }
    const liveMembers = processes.filter(({ processGroupId }) => processGroupIds.has(processGroupId));
    for (const processGroupId of processGroupIds) {
        const members = liveMembers.filter(({ processGroupId: observedGroupId }) => observedGroupId === processGroupId);
        if (members.length === 0)
            continue;
        const failures = await processOwnershipFailures(members, ownership.runId, host, tokenOwned.identities);
        if (failures.length === 0 && unverifiableSampledGroups.has(processGroupId))
            unresolved.push(...members.map(({ pid }) => ({
                pid,
                reason: "process-identity-unavailable",
                diagnostic: "sampled process-group leader identity could not be verified",
            })));
        const scanFailures = tokenOwned.failures.filter(({ pid }) => members.some((member) => member.pid === pid));
        for (const failure of failures)
            mergeProcessOwnershipFailure(unresolved, failure);
        if (failures.length === 0 &&
            scanFailures.length === 0 &&
            !unverifiableSampledGroups.has(processGroupId))
            signalableGroups.add(processGroupId);
    }
    if (ownership.sweepTokenOwnedProcesses !== true && unresolved.length > 0)
        return cleanupValidationFailure(unresolved, tokenOwned.unverified);
    return {
        signalOrder: [...signalableGroups]
            .filter((groupId) => processGroupIds.has(groupId))
            .sort((left, right) => left === ownership.processGroupId
            ? -1
            : right === ownership.processGroupId
                ? 1
                : left - right),
        tokenOwnedIdentities: tokenOwned.identities,
        unresolved,
        unverified: tokenOwned.unverified,
    };
};
/** Keep one current, most useful ownership diagnosis for each live PID. */
const mergeProcessOwnershipFailure = (failures, next) => {
    const index = failures.findIndex(({ pid }) => pid === next.pid);
    if (index < 0) {
        failures.push(next);
        return;
    }
    const previous = failures[index];
    if (previous !== undefined &&
        ownershipFailurePriority(next.reason) >=
            ownershipFailurePriority(previous.reason))
        failures[index] = next;
};
const ownershipFailurePriority = (reason) => reason === "run-token-mismatch"
    ? 3
    : reason === "process-identity-unavailable"
        ? 2
        : reason === "environment-unreadable"
            ? 1
            : 0;
const revalidateOwnedProcessGroup = async (processGroupId, ownership, host, expectedIdentities) => {
    let members;
    try {
        const processes = await settleLauncherExit(ownership, liveProcesses(await host.listProcesses()), host);
        if ("cleaned" in processes)
            return processes;
        members = processes.filter(({ processGroupId: observedGroupId }) => observedGroupId === processGroupId);
    }
    catch (cause) {
        return {
            cleaned: false,
            reason: `process ownership could not be revalidated: ${errorMessage(cause)}`,
        };
    }
    const failures = await processOwnershipFailures(members, ownership.runId, host, expectedIdentities);
    if (failures.length > 0)
        return cleanupValidationFailure(failures);
    if (processGroupId !== ownership.processGroupId &&
        members.length > 0 &&
        !members.some(({ pid }) => pid === processGroupId) &&
        ownership.sweepTokenOwnedProcesses !== true)
        return {
            cleaned: false,
            reason: "descendant process-group leader identity could not be revalidated",
        };
    return { empty: members.length === 0 };
};
const cleanupValidationFailure = (failures, unverified = []) => {
    const unverifiedEntry = unverified.length === 0 ? {} : { unverified };
    const unreadable = failures.filter(({ reason }) => reason === "environment-unreadable");
    if (failures.some(({ reason }) => reason === "run-token-mismatch"))
        return {
            cleaned: false,
            reason: `process ownership token mismatch for PID(s): ${[
                ...new Set(failures
                    .filter(({ reason }) => reason === "run-token-mismatch")
                    .map(({ pid }) => pid)),
            ]
                .sort((left, right) => left - right)
                .join(", ")}`,
            failures,
            ...unverifiedEntry,
        };
    if (failures.some(({ reason }) => reason === "process-identity-unavailable"))
        return {
            cleaned: false,
            reason: "process identity could not be revalidated",
            failures,
            ...unverifiedEntry,
        };
    if (unreadable.length > 0) {
        const counts = new Map();
        for (const { diagnostic } of unreadable) {
            const category = sanitizedTokenReadFailure(diagnostic);
            counts.set(category, (counts.get(category) ?? 0) + 1);
        }
        const breakdown = [...counts]
            .sort(([left], [right]) => compareUnicodeCodePoints(left, right))
            .map(([category, count]) => `${category}=${String(count)}`)
            .join(", ");
        const candidates = unreadable
            .map(({ pid, diagnostic }) => `${String(pid)}=${sanitizedTokenReadFailure(diagnostic)}`)
            .sort((left, right) => compareUnicodeCodePoints(left, right));
        return {
            cleaned: false,
            reason: `process ownership token could not be read for ${String(unreadable.length)} live process(es): ${breakdown}; live candidates ${candidates.join(", ")}`,
            failures,
            ...unverifiedEntry,
        };
    }
    return {
        cleaned: false,
        reason: "process ownership could not be revalidated",
        failures,
        ...unverifiedEntry,
    };
};
const sanitizedTokenReadFailure = (diagnostic) => {
    if (diagnostic === "environment_unavailable")
        return diagnostic;
    if (diagnostic === "platform_binary_environment_withheld")
        return diagnostic;
    if (diagnostic === "restricted_process_environment_withheld")
        return diagnostic;
    const environmentErrno = /^(EACCES|EPERM|ENOENT|ESRCH):/u.exec(diagnostic ?? "");
    if (environmentErrno?.[1] !== undefined)
        return `environment_errno_${environmentErrno[1]}`;
    if (diagnostic === "apple_vector_unavailable")
        return diagnostic;
    if (diagnostic === "ambiguous_environment_boundary")
        return diagnostic;
    if (diagnostic === "malformed_procargs")
        return diagnostic;
    if (diagnostic === "process_identity_changed_during_token_read")
        return diagnostic;
    if (diagnostic === "process_not_in_snapshot")
        return diagnostic;
    const processTableFailure = /^process_table_failed_(\d+)$/u.exec(diagnostic ?? "");
    if (processTableFailure?.[1] !== undefined)
        return `process_table_errno_${processTableFailure[1]}`;
    const sysctlFailure = /^sysctl_failed_(\d+)$/u.exec(diagnostic ?? "");
    if (sysctlFailure?.[1] !== undefined)
        return `sysctl_errno_${sysctlFailure[1]}`;
    if (diagnostic === "reader_failure")
        return diagnostic;
    if (diagnostic === "duplicate_run_token")
        return diagnostic;
    if (diagnostic === "invalid_run_token_encoding")
        return diagnostic;
    return "other_unavailable";
};
const processOwnershipFailures = async (members, runId, host, expectedIdentities = new Map()) => {
    const failures = [];
    if (expectedIdentities.size > 0 && host.processIdentities !== undefined) {
        const expectedMembers = members.filter(({ pid }) => expectedIdentities.has(pid));
        const observed = await host.processIdentities(expectedMembers);
        const identityFailures = [];
        for (const member of expectedMembers) {
            const expected = expectedIdentities.get(member.pid);
            const current = observed.get(member.pid);
            if (expected === null ||
                current?.state !== "readable" ||
                current.identity !== expected) {
                identityFailures.push({
                    pid: member.pid,
                    reason: "process-identity-unavailable",
                    diagnostic: "process identity changed or became unavailable before signal",
                });
            }
        }
        failures.push(...(await recheckOwnershipFailures(identityFailures, host)));
    }
    failures.push(...(await processRunTokenFailures(members, runId, host)));
    if (failures.length === 0 &&
        expectedIdentities.size > 0 &&
        host.processIdentities !== undefined) {
        const expectedMembers = members.filter(({ pid }) => expectedIdentities.has(pid));
        const observed = await host.processIdentities(expectedMembers);
        const identityFailures = [];
        for (const member of expectedMembers) {
            const expected = expectedIdentities.get(member.pid);
            const current = observed.get(member.pid);
            if (expected !== null &&
                current?.state === "readable" &&
                current.identity === expected)
                continue;
            identityFailures.push({
                pid: member.pid,
                reason: "process-identity-unavailable",
                diagnostic: "process identity changed or became unavailable during token validation",
            });
        }
        failures.push(...(await recheckOwnershipFailures(identityFailures, host)));
    }
    return failures;
};
const processRunTokenFailures = async (members, runId, host) => {
    const failures = [];
    for await (const { process: member, observation } of readProcessRunTokens(host, members)) {
        if (observation.state === "readable") {
            if (observation.runId !== runId)
                failures.push({ pid: member.pid, reason: "run-token-mismatch" });
            continue;
        }
        failures.push({
            pid: member.pid,
            reason: "environment-unreadable",
            diagnostic: observation.reason,
        });
    }
    return recheckOwnershipFailures(failures, host);
};
/**
 * Take a fresh liveness snapshot after each ownership-read phase. Only an
 * absent PID resolves an unreadable observation; a readable token mismatch
 * remains a failure. Never reuse this snapshot across identity/token reads.
 */
const recheckOwnershipFailures = async (failures, host) => {
    if (!failures.some(({ reason }) => reason !== "run-token-mismatch"))
        return failures;
    try {
        let processes = await host.listProcesses();
        const isDarwin = (host.platform ?? process.platform) === "darwin";
        for (let attempt = 0; isDarwin &&
            attempt < TOKEN_READ_RETRY_ATTEMPTS &&
            processes.some(({ pid, state }) => failures.some((failure) => failure.pid === pid && failure.reason !== "run-token-mismatch") && state.slice(1).includes("E")); attempt += 1) {
            await new Promise((resolve) => setTimeout(resolve, TOKEN_READ_RETRY_DELAY_MS));
            processes = await host.listProcesses();
        }
        const live = new Set(liveProcesses(processes).map(({ pid }) => pid));
        return failures.filter(({ pid, reason }) => reason === "run-token-mismatch" || live.has(pid));
    }
    catch (cause) {
        return failures.map((failure) => failure.reason === "run-token-mismatch"
            ? failure
            : {
                ...failure,
                diagnostic: `${failure.diagnostic}; process liveness recheck failed: ${errorMessage(cause)}`,
            });
    }
};
const TOKEN_READ_RETRY_ATTEMPTS = 3;
const TOKEN_READ_RETRY_DELAY_MS = 40;
/** Darwin reports this when the kernel withholds a platform binary's environment. */
const PLATFORM_BINARY_ENVIRONMENT_WITHHELD = "platform_binary_environment_withheld";
/** Darwin reports this when the kernel withholds a restricted process environment. */
const RESTRICTED_PROCESS_ENVIRONMENT_WITHHELD = "restricted_process_environment_withheld";
const currentProcessUid = () => typeof process.getuid === "function" ? process.getuid() : undefined;
/**
 * Whether the operating system provably withheld this candidate's run token:
 * current macOS omits the environment of Apple platform binaries and
 * CS_RESTRICT processes from KERN_PROCARGS2, and fails with EINVAL for
 * processes owned by another account. These classes cannot be token-verified
 * by this caller. An unrelated candidate is recorded as unverified instead
 * of failing an otherwise clean capture; every related or otherwise
 * unreadable candidate stays fail-closed.
 */
const environmentWithheldFromInspection = (entry, diagnostic) => {
    const uid = currentProcessUid();
    if (uid !== undefined && entry.uid !== undefined && entry.uid !== uid)
        return true;
    return (diagnostic === PLATFORM_BINARY_ENVIRONMENT_WITHHELD ||
        diagnostic === RESTRICTED_PROCESS_ENVIRONMENT_WITHHELD);
};
const scanTokenOwnedProcesses = async (processes, runId, host, captureBaseline, relation) => {
    let candidates = processes;
    let candidateIdentities = new Map();
    if (host.processIdentities !== undefined) {
        const current = await host.processIdentities(processes);
        candidateIdentities = current;
        if (captureBaseline !== undefined) {
            const baseline = new Map(captureBaseline.map(({ pid, identity }) => [pid, identity]));
            candidates = processes.filter((process) => {
                const before = baseline.get(process.pid);
                const now = current.get(process.pid);
                return !(before !== undefined &&
                    before !== null &&
                    now?.state === "readable" &&
                    now.identity === before);
            });
        }
    }
    const failures = [];
    if (captureBaseline !== undefined && host.processIdentities !== undefined) {
        const stableCandidates = [];
        const identityFailures = [];
        for (const process of candidates) {
            if (candidateIdentities.get(process.pid)?.state === "readable") {
                stableCandidates.push(process);
                continue;
            }
            identityFailures.push({
                pid: process.pid,
                reason: "process-identity-unavailable",
                diagnostic: "process identity was unavailable during token scan",
            });
        }
        failures.push(...(await recheckOwnershipFailures(identityFailures, host)));
        candidates = stableCandidates;
    }
    const owned = [];
    const ownedIdentities = new Map();
    const recordOwned = (process) => {
        owned.push(process);
        const identity = candidateIdentities.get(process.pid);
        ownedIdentities.set(process.pid, identity?.state === "readable" ? identity.identity : null);
    };
    const unreadable = [];
    for await (const { process, observation } of readProcessRunTokens(host, candidates)) {
        if (observation.state === "readable") {
            if (observation.runId === runId)
                recordOwned(process);
        }
        else
            unreadable.push({ process, diagnostic: observation.reason });
    }
    const remaining = await settleUnreadableTokenCandidates(unreadable, runId, host, recordOwned);
    const relatedPids = new Set();
    const relatedGroupIds = new Set();
    if (relation !== undefined) {
        relatedPids.add(relation.leaderPid);
        for (const descendant of descendantsOf([relation.leaderPid], processes))
            relatedPids.add(descendant.pid);
        relatedGroupIds.add(relation.processGroupId);
        for (const processGroupId of relation.sampledProcessGroupIds ?? [])
            if (Number.isSafeInteger(processGroupId) && processGroupId > 0)
                relatedGroupIds.add(processGroupId);
        for (const process of owned)
            relatedGroupIds.add(process.processGroupId);
    }
    const unverified = [];
    const strict = [];
    const withheld = [];
    for (const candidate of remaining) {
        const isRelated = relation === undefined ||
            relatedPids.has(candidate.process.pid) ||
            relatedGroupIds.has(candidate.process.processGroupId);
        if (!isRelated &&
            environmentWithheldFromInspection(candidate.process, candidate.diagnostic)) {
            withheld.push(candidate);
            continue;
        }
        strict.push(candidate);
    }
    let finalLive;
    try {
        finalLive = new Set(liveProcesses(await host.listProcesses()).map(({ pid }) => pid));
    }
    catch (cause) {
        void cause;
        finalLive = undefined;
    }
    for (const candidate of strict) {
        if (finalLive !== undefined && !finalLive.has(candidate.process.pid))
            continue;
        failures.push({
            pid: candidate.process.pid,
            reason: "environment-unreadable",
            diagnostic: candidate.diagnostic,
        });
    }
    for (const candidate of withheld) {
        if (finalLive !== undefined && !finalLive.has(candidate.process.pid))
            continue;
        unverified.push({
            pid: candidate.process.pid,
            diagnostic: candidate.diagnostic,
        });
    }
    if (candidates.length > 0 && host.processIdentities !== undefined) {
        const afterRead = await host.processIdentities(candidates);
        const stillOwned = [];
        const identityFailures = [];
        const ownedPids = new Set(owned.map(({ pid }) => pid));
        for (const process of candidates) {
            const before = candidateIdentities.get(process.pid);
            const current = afterRead.get(process.pid);
            if (before?.state === "readable" &&
                current?.state === "readable" &&
                current.identity === before.identity) {
                if (ownedPids.has(process.pid))
                    stillOwned.push(process);
                continue;
            }
            identityFailures.push({
                pid: process.pid,
                reason: "process-identity-unavailable",
                diagnostic: "process identity changed or became unavailable during token validation",
            });
        }
        failures.push(...(await recheckOwnershipFailures(identityFailures, host)));
        return {
            owned: stillOwned,
            failures,
            unverified,
            identities: ownedIdentities,
        };
    }
    return { owned, failures, unverified, identities: ownedIdentities };
};
/**
 * Re-read run tokens for unresolved sweep candidates so transient exec and
 * exit states settle before classification. Each attempt revalidates
 * liveness, refreshes the diagnostic, and is bounded by a fixed attempt
 * budget; a still-unreadable candidate keeps its latest diagnostic.
 */
const settleUnreadableTokenCandidates = async (pending, runId, host, recordOwned) => {
    let remaining = pending;
    for (let attempt = 0; attempt < TOKEN_READ_RETRY_ATTEMPTS && remaining.length > 0; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, TOKEN_READ_RETRY_DELAY_MS));
        let live;
        try {
            live = new Set(liveProcesses(await host.listProcesses()).map(({ pid }) => pid));
        }
        catch (cause) {
            void cause;
            live = undefined;
        }
        const stillUnreadable = [];
        const candidates = remaining
            .map(({ process }) => process)
            .filter(({ pid }) => live === undefined || live.has(pid));
        for await (const { process, observation } of readProcessRunTokens(host, candidates)) {
            if (observation.state === "readable") {
                if (observation.runId === runId)
                    recordOwned(process);
                continue;
            }
            stillUnreadable.push({
                process,
                diagnostic: observation.reason,
            });
        }
        remaining = stillUnreadable;
    }
    return remaining;
};
