const HTML_ENTITIES = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
});

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);
}

export function fillSelect(select, values) {
  const selectedValue = select.value;
  select.replaceChildren(select.options[0], ...values.map((value) => new Option(value)));
  select.value = values.includes(selectedValue) ? selectedValue : '';
}
