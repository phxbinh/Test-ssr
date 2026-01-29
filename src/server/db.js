
// src/server/db.js
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export const getTodos = async () => {
  return await sql`SELECT * FROM todos ORDER BY id DESC`;
};

export const addTodo = async (body) => {
  await sql`INSERT INTO todos (text) VALUES (${body.text})`;
};

export const deleteTodo = async (body) => {
  await sql`DELETE FROM todos WHERE id = ${body.id}`;
};





