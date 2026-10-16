import { JavaScriptAnalysisWorker } from "../../javascript/analysis/JavaScriptAnalysisWorker.js";
/** Construct the inert artifact analyzer; resources are acquired on the first source. */
export const createJavaScriptSourceAnalysis = (limits, sourceCount) => new JavaScriptAnalysisWorker(limits, undefined, sourceCount);
