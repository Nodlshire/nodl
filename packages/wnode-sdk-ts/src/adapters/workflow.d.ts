import { ExecuteWorkflowParams, ExecuteWorkflowResult, WnodeClientConfig } from '../types';
export declare class WorkflowEngineAdapter {
    private config;
    constructor(config: WnodeClientConfig);
    /**
     * Loads and executes a JSON workflow deterministically.
     */
    executeWorkflow(params: ExecuteWorkflowParams): Promise<ExecuteWorkflowResult>;
}
