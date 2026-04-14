// Simple in-memory store (replace with a DB in production)
export type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
};

// Module-level variable persists across requests in the same process
const todos: Todo[] = [
  { id: "1", text: "Read the Next.js docs", done: false, createdAt: new Date().toISOString() },
  { id: "2", text: "Build something cool", done: false, createdAt: new Date().toISOString() },
];

export const db = {
  getAll: (): Todo[] => [...todos],

  add: (text: string): Todo => {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      done: false,
      createdAt: new Date().toISOString(),
    };
    todos.push(todo);
    return todo;
  },

  delete: (id: string): boolean => {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    todos.splice(idx, 1);
    return true;
  },
};