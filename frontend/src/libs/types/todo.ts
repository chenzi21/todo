import CDate from "../CDate";

export type TodoInputs = {
    todo: string;
    date: CDate;
    urgency: string;
};

export type Todo = {
    id: number;
    // userId: string;
    // created_at: CDate;
    is_done: "No" | "Yes";
    // is_deleted: boolean;
} & TodoInputs;
