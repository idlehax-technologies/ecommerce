export const INDIAN_STATES = [
    {
        code: "19",
        name: "West Bengal",
    },
] as const;

export type IndianState =
    typeof INDIAN_STATES[number]["name"];

export function getStateCode(
    state: IndianState
): string {
    const match = INDIAN_STATES.find(
        (s) => s.name === state
    );

    if (!match) {
        throw new Error(
            `Unknown state: ${state}`
        );
    }

    return match.code;
}