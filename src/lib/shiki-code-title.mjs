// Shiki transformer: a fenced code block with a title in its meta, like
//   ```cpp title="DialogGISubsystem.cpp"
// gets a small file-name bar above it. The <pre> is wrapped in
// <div class="code-block"><div class="code-title">…</div><pre>…</pre></div>.
export default function codeTitle() {
	return {
		name: 'code-title',
		root(root) {
			const meta = this.options.meta?.__raw ?? '';
			const match = /title="([^"]+)"/.exec(meta);
			if (!match) return;
			const pre = root.children.find((node) => node.type === 'element' && node.tagName === 'pre');
			if (!pre) return;
			root.children = [
				{
					type: 'element',
					tagName: 'div',
					properties: { class: 'code-block' },
					children: [
						{ type: 'element', tagName: 'div', properties: { class: 'code-title' }, children: [{ type: 'text', value: match[1] }] },
						pre,
					],
				},
			];
		},
	};
}
