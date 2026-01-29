// src/shared/api.js
export async function fetchTodos() {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error("Fetch todos failed");
  return res.json();
}

export async function createTodo(text) {
  await fetch("/api/todos", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function removeTodo(id) {
  await fetch("/api/todos", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}