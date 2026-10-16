import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { S as init_CurrentEntrypointPath, i as sqliteDatabaseCapability, n as init_serverIdentity, r as init_SqliteDatabaseCapability, t as createServerIdentity, x as CURRENT_ENTRYPOINT_PATH } from "./serverIdentity-Cio4iFV3.js";
import { n as projectAnalysisError, t as init_analysisErrorProjection } from "./analysisErrorProjection-BN0EPM-3.js";
import { H as providerCapabilitySet, R as init_toolOutputSchemaPrimitives } from "./nativeValueTrace-DR9UE62L.js";
import { o as init_jsonValue, s as jsonObjectSchema } from "./digests-BFoWUT_-.js";
import { n as init_logger, r as silentLogger } from "./logger-BQY5ulYv.js";
import { n as init_BinarySessionStatus, r as providerCapabilitySets } from "./BinarySessionStatus-B4P9gf-S.js";

//#region dist/application/DirectAnalysisStatus.js
var runSessionStatus;
function init_DirectAnalysisStatus() {
	return (init_DirectAnalysisStatus = __esmMin((() => {
		init_analysisErrorProjection();
		init_jsonValue();
		init_serverIdentity();
		init_logger();
		init_toolOutputSchemaPrimitives();
		init_BinarySessionStatus();
		init_SqliteDatabaseCapability();
		init_CurrentEntrypointPath();
		runSessionStatus = async (dependencies, logger = silentLogger) => {
			const config = dependencies.readConfiguration();
			if (!config.ok) return { error: projectAnalysisError(config.error) };
			const session = await dependencies.createBinarySession(config.value, logger);
			try {
				const status = jsonObjectSchema.parse(session.status());
				return {
					...status,
					capabilities: [...providerCapabilitySet.array().parse(status.capabilities), ...providerCapabilitySets([sqliteDatabaseCapability(process.versions.node)])],
					server_identity: createServerIdentity({
						startedAt: new Date().toISOString(),
						commandPath: CURRENT_ENTRYPOINT_PATH
					})
				};
			} finally {
				await session.close();
			}
		};
	})))();
}

//#endregion
init_DirectAnalysisStatus();
export { runSessionStatus };