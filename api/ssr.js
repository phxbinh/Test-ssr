// api/ssr.js
import { TodoApp } from "../src/app/pages/TodoApp.js";
import { fetchTodos } from "../src/shared/api.js";
import { queryClient } from "../src/framework/query.js";
const { renderToString } = window.App.Vdom;

export default async function handler(req, res) {
  // chỉ SSR route /
  if (req.url !== "/") {
    res.status(404).send("Not found");
    return;
  }

  // 🔥 LOAD DATA
  await queryClient.prefetch("todos:list", fetchTodos);

  // 🔥 RENDER HTML
  const html = renderToString(TodoApp);

  // 🔥 DEHYDRATE CACHE
  const store = {};
  for (const [k, v] of queryClient.__cache) {
    store[k] = v.data;
  }

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8"/>
  <title>Todo App</title>
</head>
<body>
  <div id="app">${html}</div>

  <script>
    window.__STORE__ = ${JSON.stringify(store)};
  </script>

  <script type="module" src="/src/app/main.client.js"></script>
</body>
</html>`);
}