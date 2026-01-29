const { h } = window.App.Vdom;

/**
 * renderToString(Component)
 * - chỉ render 1 lần
 * - KHÔNG hooks lifecycle
 * - KHÔNG event
 */
export function renderToString(Component, props = {}) {
  const vnode = Component(props);
  return vnodeToHtml(vnode);
}

function vnodeToHtml(vnode) {
  if (vnode == null || vnode === false) return "";

  // text node
  if (typeof vnode === "string" || typeof vnode === "number") {
    return escapeHtml(String(vnode));
  }

  // functional component
  if (typeof vnode.type === "function") {
    return vnodeToHtml(vnode.type(vnode.props || {}));
  }

  const { type, props = {}, children = [] } = vnode;

  let html = `<${type}`;

  // props → attributes
  for (const [key, value] of Object.entries(props)) {
    if (
      key === "children" ||
      key.startsWith("on") ||
      value == null ||
      value === false
    ) continue;

    if (key === "className") {
      html += ` class="${escapeHtml(value)}"`;
    } else if (key === "style" && typeof value === "object") {
      const style = Object.entries(value)
        .map(([k, v]) => `${k}:${v}`)
        .join(";");
      html += ` style="${escapeHtml(style)}"`;
    } else {
      html += ` ${key}="${escapeHtml(value)}"`;
    }
  }

  html += ">";

  // children
  for (const child of [].concat(children)) {
    html += vnodeToHtml(child);
  }

  html += `</${type}>`;

  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}