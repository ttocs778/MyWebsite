import { visit } from 'unist-util-visit';

// Obsidian shows a single newline as a line break; plain Markdown joins the
// lines. Only applied to synced notes so project MDX keeps normal behavior.
export default function remarkNotesBreaks() {
	return (tree, file) => {
		const filePath = (file.path || file.history?.[0] || '').replace(/\\/g, '/');
		if (!filePath.includes('/src/content/notes/')) return;

		visit(tree, 'text', (node, index, parent) => {
			if (!parent || index === undefined || !node.value.includes('\n')) return;
			const parts = node.value.split('\n');
			const replacement = [];
			parts.forEach((value, i) => {
				if (i > 0) replacement.push({ type: 'break' });
				if (value) replacement.push({ type: 'text', value });
			});
			parent.children.splice(index, 1, ...replacement);
			return index + replacement.length;
		});
	};
}
