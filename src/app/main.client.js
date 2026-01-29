import '../framework/Debugger.js';
import '../framework/vdom.js';
import '../framework/hooks.js';
import '../framework/router.js';
//import '../framework/init_API.js';

import { TodoApp } from "./pages/TodoApp.js";
import { fetchTodos } from "../shared/api.js";
import { queryClient } from "../framework/query.js";

const { Router } = window.App;

// 🔥 HYDRATE CACHE
if (window.__STORE__) {
  queryClient.hydrate(window.__STORE__);
}

// CSR ROUTER
Router.addRoute({
  path: "/",
  component: TodoApp
});

Router.init(document.getElementById("app"), { hash: false });
