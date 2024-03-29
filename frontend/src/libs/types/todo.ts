import CDate from "../CDate";

export type TodoInputs = {
    todo: string;
    date: CDate;
    urgency: string;
};

export type Todo = {
    id: string;
    // userId: string;
    // created_at: CDate;
    is_done: "No" | "Yes";
    date: string
    // is_deleted: boolean;
} & Omit<TodoInputs, "date">;
