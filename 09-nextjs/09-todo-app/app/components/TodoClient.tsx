"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Todo } from "@/lib/store";

export default function TodoClient({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const newTodo: Todo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setText("");
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });

    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <div className="todo-client">
      <form onSubmit={handleAdd} className="add-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs doing?"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !text.trim()}>
          {loading ? "Adding…" : "Add"}
        </button>
      </form>

      <ul className="todo-list">
        {todos.length === 0 && (
          <li className="empty">Nothing here. Add something above ↑</li>
        )}
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span>{todo.text}</span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="delete-btn"
              aria-label="Delete"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}