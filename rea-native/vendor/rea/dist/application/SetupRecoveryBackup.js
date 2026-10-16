import { createHash } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import { copyFile } from "node:fs/promises";
import { err, ok } from "../domain/result.js";
import { readRegularFile, RegularFileCleanupFailure, } from "./RegularFileRead.js";
const isMissing = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
const errorDetail = (cause) => cause instanceof Error ? cause.message : String(cause);
/** Select a persistent snapshot only when its bytes match this transaction's original. */
export const selectCurrentRecoveryBackup = async (firstBackupPath, original) => {
    const expected = Buffer.isBuffer(original)
        ? original
        : Buffer.from(original, "utf8");
    let firstBackup;
    try {
        firstBackup = await readRegularFile(firstBackupPath, {
            symlinks: "reject",
        });
    }
    catch (cause) {
        if (cause instanceof RegularFileCleanupFailure)
            throw cause;
        if (!isMissing(cause))
            return err({
                kind: "unreadable",
                path: firstBackupPath,
                detail: `The recovery backup could not be checked: ${errorDetail(cause)}`,
            });
    }
    if (firstBackup === undefined)
        return ok({ backupPath: firstBackupPath, present: false });
    if (firstBackup.equals(expected))
        return ok({ backupPath: firstBackupPath, present: true });
    const digest = createHash("sha256").update(expected).digest("hex");
    const recoveryPath = `${firstBackupPath}.${digest}.recovery`;
    let recovery;
    try {
        recovery = await readRegularFile(recoveryPath, { symlinks: "reject" });
    }
    catch (cause) {
        if (cause instanceof RegularFileCleanupFailure)
            throw cause;
        if (!isMissing(cause))
            return err({
                kind: "unreadable",
                path: recoveryPath,
                detail: `The recovery backup could not be checked: ${errorDetail(cause)}`,
            });
    }
    if (recovery !== undefined && !recovery.equals(expected))
        return err({
            kind: "occupied",
            path: recoveryPath,
            detail: `The recovery path already contains different data: ${recoveryPath}`,
        });
    return ok({ backupPath: recoveryPath, present: recovery !== undefined });
};
/** Preserve a snapshot without replacing an earlier recovery file. */
export const preserveRecoveryBackup = async (source, destination) => {
    try {
        await copyFile(source, destination, fsConstants.COPYFILE_EXCL);
        return true;
    }
    catch (cause) {
        return cause instanceof Error && "code" in cause && cause.code === "EEXIST";
    }
};
