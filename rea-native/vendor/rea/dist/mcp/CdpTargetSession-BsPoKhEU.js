import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_browserObservationError, t as BrowserObservationError } from "./browserObservationError-CyLugqX4.js";
import { a as cdpTargetWebSocket, f as withCdpDiscoveryDeadline, l as init_CdpEndpoint, n as init_CdpConnection, o as discoverCdpBrowserSocket, s as discoverCdpEndpoint, t as CdpConnection } from "./CdpConnection-BpDfz4MK.js";

//#region dist/browser/CdpTargetSession.js
var openCdpEndpoint, openCdpTargetSession, attachCdpTargetSession, closeCdpTargetSession, attachedSessionId;
function init_CdpTargetSession() {
	return (init_CdpTargetSession = __esmMin((() => {
		init_browserObservationError();
		init_CdpConnection();
		init_CdpEndpoint();
		openCdpEndpoint = async (endpoint, operation, signal, timeoutMs) => {
			if (endpoint.transport === "http_discovery") return {
				discovery: await discoverCdpEndpoint(endpoint.url, operation, signal),
				connection: undefined
			};
			return await withCdpDiscoveryDeadline(operation, signal, async (deadlineSignal) => {
				const connection = await CdpConnection.connect(endpoint.url, operation, deadlineSignal);
				try {
					return {
						discovery: await discoverCdpBrowserSocket(connection, endpoint.url, operation, deadlineSignal),
						connection
					};
				} catch (cause) {
					await connection.close();
					throw cause;
				}
			}, timeoutMs);
		};
		openCdpTargetSession = async (discovery, target, operation, signal, limits) => {
			const webSocket = cdpTargetWebSocket(discovery, target, operation);
			const connection = await CdpConnection.connect(webSocket.url, operation, signal, limits);
			if (webSocket.scope === "page") return {
				connection,
				sessionId: undefined
			};
			return await attachCdpTargetSession(connection, target, operation, signal);
		};
		attachCdpTargetSession = async (connection, target, operation, signal) => {
			try {
				const attached = await connection.send("Target.attachToTarget", {
					targetId: target.id,
					flatten: true
				}, undefined, signal);
				return {
					connection,
					sessionId: attachedSessionId(attached, operation)
				};
			} catch (cause) {
				await connection.close();
				throw cause;
			}
		};
		closeCdpTargetSession = async (targetSession, enabledDomains, signal) => {
			const { connection, sessionId } = targetSession;
			const cleanup = new AbortController();
			const domainSignal = signal === undefined ? cleanup.signal : AbortSignal.any([cleanup.signal, signal]);
			const timeout = setTimeout(() => cleanup.abort(), 1e3);
			timeout.unref();
			try {
				if (signal?.aborted !== true) {
					for (const domain of enabledDomains) {
						if (domainSignal.aborted) break;
						try {
							await connection.send(`${domain}.disable`, {}, sessionId, domainSignal);
						} catch {}
					}
				}
				if (!cleanup.signal.aborted && sessionId !== undefined) try {
					await connection.send("Target.detachFromTarget", { sessionId }, undefined, cleanup.signal);
				} catch {}
			} finally {
				clearTimeout(timeout);
				cleanup.abort();
				await connection.close();
			}
		};
		attachedSessionId = (value, operation) => {
			if (typeof value !== "object" || value === null || !("sessionId" in value) || typeof value.sessionId !== "string" || value.sessionId.length === 0) throw new BrowserObservationError(operation, "protocol_error");
			return value.sessionId;
		};
	})))();
}

//#endregion
export { openCdpTargetSession as a, openCdpEndpoint as i, closeCdpTargetSession as n, init_CdpTargetSession as r, attachCdpTargetSession as t };