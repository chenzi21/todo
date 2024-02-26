import { Suspense } from "react";
import ToDoFrom from "../../components/addTodo/ToDoForm";

export default function Page() {
    console.log("test");
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Suspense fallback={<h2>Loading...</h2>}>
                <ToDoFrom />
            </Suspense>
        </main>
    );
}

