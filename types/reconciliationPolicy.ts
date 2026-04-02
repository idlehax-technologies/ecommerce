import type { ReconciliationMismatchType } from "./reconciliation";
import type { ResolutionActionType } from "./reconciliationResolution";

export type ResolutionPolicy = {
    mismatchType: ReconciliationMismatchType;

    allowedActions: ResolutionActionType[];

    recommendedAction?: ResolutionActionType;

    requiresConfirmation: boolean;
};