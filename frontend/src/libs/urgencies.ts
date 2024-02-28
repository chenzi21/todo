export const urgencyList = [
    { label: "very-low", value: "very-low" },
    { label: "low", value: "low" },
    { label: "medium", value: "medium" },
    { label: "high", value: "high" },
    { label: "very-high", value: "very-high" },
] as const;

export type UrgencyKeys = (typeof urgencyList)[number]["value"];