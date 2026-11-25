export function remarkMermaid() {
  return (tree) => {
    const visit = (node, index, parent) => {
      if (node.type === 'code' && node.lang === 'mermaid' && parent && typeof index === 'number') {
        const escaped = node.value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        parent.children[index] = {
          type: 'html',
          value: `<div class="mermaid-wrapper relative not-prose my-6 cursor-zoom-in overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-100 dark:hover:border-zinc-500" role="button" tabindex="0" aria-label="Nhấp để phóng to biểu đồ"><pre class="mermaid flex justify-center text-sm">${escaped}</pre></div>`,
        };
        return;
      }
      if (Array.isArray(node.children)) {
        for (let i = 0; i < node.children.length; i++) {
          visit(node.children[i], i, node);
        }
      }
    };
    visit(tree, null, null);
  };
}
