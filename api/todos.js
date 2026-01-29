// api/todos.js
import { getTodos, addTodo, deleteTodo } from "../src/server/db.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const todos = await getTodos();
      return res.status(200).json(todos);
    }

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    if (req.method === "POST") {
      await addTodo(body);
      return res.status(201).json({ ok: true });
    }

    if (req.method === "DELETE") {
      await deleteTodo(body);
      return res.status(200).json({ ok: true });
    }

    res.status(405).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}



