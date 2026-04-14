// This is a Server Component — no "use client" directive
// Data is fetched on the server before HTML is sent to the browser.
import TodoClient from "./components/TodoClient";
import type { Todo } from "@/lib/store";

async function getTodos(): Promise<Todo[]> {
  // Absolute URL required when fetching your own API from a Server Component
  const res = await fetch("http://localhost:3000/api/todos", {
    cache: "no-store", // Always fresh — no caching
  });

  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export default async function Page() {
  const todos = await getTodos(); // Runs on the server

  return (
    <main>
      <h1>todos</h1>
      <p className="subtitle">Server-rendered list · client-side mutations</p>
      <TodoClient initialTodos={todos} />
    </main>
  );
}