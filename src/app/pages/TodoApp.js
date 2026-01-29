// src/app/pages/TodoApp.js
const { h } = window.App.VDOM;
const { useState } = window.App.Hooks;
const { useQuery } = window.App.Hooks;

import { queryClient } from "../../framework/query.js";
import { fetchTodos, createTodo, removeTodo } from "../../shared/api.js";

export function TodoApp() {
  const TODOS_KEY = "todos:list";
  const { data: todos = [], status } = useQuery(TODOS_KEY, fetchTodos);

  const [input, setInput] = useState("");

  if (status === "loading") {
    return h("p", null, "Đang tải todos...");
  }

  async function add() {
    if (!input.trim()) return;

    const optimistic = { id: "temp-" + Date.now(), text: input };
    queryClient.setQueryData(TODOS_KEY, prev => [...prev, optimistic]);
    setInput("");

    try {
      await createTodo(input);
      queryClient.invalidateQueries(TODOS_KEY);
    } catch {
      queryClient.invalidateQueries(TODOS_KEY);
    }
  }

  async function del(id) {
    queryClient.setQueryData(TODOS_KEY, prev => prev.filter(t => t.id !== id));
    try {
      await removeTodo(id);
    } catch {
      queryClient.invalidateQueries(TODOS_KEY);
    }
  }

  return h("div", { className: "todo-app" }, [
    h("h1", null, "Todo App"),

    h("input", {
      value: input,
      oninput: e => setInput(e.target.value)
    }),

    h("button", { onclick: add }, "Add"),

    h("ul", null,
      todos.map(t =>
        h("li", { key: t.id }, [
          h("span", null, t.text),
          h("button", { onclick: () => del(t.id) }, "×")
        ])
      )
    )
  ]);
}