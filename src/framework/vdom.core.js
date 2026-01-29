// vdom-core.js
const TEXT = Symbol('Text');
const Fragment = Symbol('Fragment');

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

export function h(type, props = {}, ...children) {
  return {
    type,
    props,
    children: children.flat().map(c =>
      typeof c === 'string' || typeof c === 'number'
        ? { type: TEXT, text: String(c) }
        : c
    )
  };
}

export function renderToString(vnode) {
  if (!vnode) return '';

  if (vnode.type === TEXT) {
    return escapeHTML(vnode.text);
  }

  if (vnode.type === Fragment) {
    return vnode.children.map(renderToString).join('');
  }

  if (typeof vnode.type === 'function') {
    return renderToString(vnode.type(vnode.props || {}));
  }

  let html = `<${vnode.type}`;

  const props = vnode.props || {};
  for (const k in props) {
    if (k === 'children' || k.startsWith('on')) continue;
    if (k === 'className') html += ` class="${escapeHTML(props[k])}"`;
    else html += ` ${k}="${escapeHTML(props[k])}"`;
  }

  html += '>';
  html += vnode.children.map(renderToString).join('');
  html += `</${vnode.type}>`;

  return html;
}

export const VDOM_CORE = { h, renderToString, Fragment };