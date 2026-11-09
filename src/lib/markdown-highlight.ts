export interface MarkdownToken {
  text: string;
  kind: "text" | "heading" | "strong" | "emphasis" | "link" | "code" | "quote" | "list";
  level?: number;
}

/** Annotate source characters for presentation without parsing or changing them. */
export function highlightMarkdown(markdown: string): MarkdownToken[] {
  const tokens: MarkdownToken[] = [];
  const lines = markdown.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const line of lines) {
    const heading = /^(#{1,6})[ \t]/.exec(line);
    if (heading) {
      tokens.push({ text: line, kind: "heading", level: heading[1].length });
      continue;
    }
    if (/^>\s/.test(line)) {
      tokens.push({ text: line, kind: "quote" });
      continue;
    }
    let offset = 0;
    const marker = /^(\s*[-*+] )/.exec(line);
    if (marker) {
      tokens.push({ text: marker[0], kind: "list" });
      offset = marker[0].length;
    }
    const inline = /(?<!\\)(?:\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^)\n]+\)|`[^`\n]+`)/g;
    inline.lastIndex = offset;
    for (const match of line.matchAll(inline)) {
      const start = match.index;
      if (start > offset) tokens.push({ text: line.slice(offset, start), kind: "text" });
      const text = match[0];
      tokens.push({ text, kind: text.startsWith("**") ? "strong" : text.startsWith("*") ? "emphasis" : text.startsWith("[") ? "link" : "code" });
      offset = start + text.length;
    }
    if (offset < line.length) tokens.push({ text: line.slice(offset), kind: "text" });
  }
  return tokens;
}
