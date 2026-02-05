# Bun Markdown + React

This sample turns Markdown into React elements with Bun,
then renders it to HTML on the server.

## What this shows

- Headings, lists, and blockquotes
- Inline code and fenced code blocks
- Tables (GFM)
- Task lists

> Markdown keeps docs friendly while staying structured.
> It is a great fit for product UI content.

```ts
const markdown = "# Hello";
const node = Bun.markdown.react(markdown);
```

| Feature | Status |
| --- | --- |
| GFM | OK |
| React output | OK |

- [x] Markdown to React
- [x] Server-side render
- [ ] Client-side enhancements

