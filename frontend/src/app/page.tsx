import Todos from "@/app/components/todosTable";
import { createSession, getSession } from "@/libs/sessionsDBActions";
import { Suspense } from "react";

export default async function Home() {
	const todos = await fetch("http://server:8080/getTodos", { cache: "no-store" }).then((data) => data.json());

	const sessionId = await createSession("chener");

	const userId = await getSession(sessionId ?? "");

	console.log(userId, sessionId)

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24" style={{ minHeight: "100%" }}>
			<Suspense fallback={<h2>Loading...</h2>}>
				<Todos data={todos ?? []} />
			</Suspense>
		</main>
	);
}
