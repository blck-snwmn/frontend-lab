import * as React from "react";
import { renderToString } from "react-dom/server";

const markdownFile = new URL("./content.md", import.meta.url);
const stylesFile = new URL("./styles.css", import.meta.url);

async function loadAssets() {
  const [markdown, styles] = await Promise.all([
    Bun.file(markdownFile).text(),
    Bun.file(stylesFile).text()
  ]);

  return { markdown, styles };
}

type AppProps = {
  markdown: string;
};

function App({ markdown }: AppProps) {
  const content = Bun.markdown.react(markdown);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Bun Markdown</p>
        <h1>Markdown to React</h1>
        <p>
          Bun.markdown.react turns Markdown into React elements, then the server renders HTML.
          Edit <code>src/content.md</code> to see changes.
        </p>
        <div className="tags">
          <span className="tag">Bun.markdown.react</span>
          <span className="tag">React 19 SSR</span>
          <span className="tag">Bun.serve</span>
        </div>
      </header>
      <section className="panel">
        <article className="markdown">{content}</article>
        <div className="footer">Rendered at {new Date().toLocaleString()}</div>
      </section>
    </main>
  );
}

function renderPage(body: string, styles: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>bun-markdown</title>
    <style>${styles}</style>
  </head>
  <body>
    <div id="root">${body}</div>
  </body>
</html>`;
}

const port = Number(Bun.env.PORT ?? 3000);

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname !== "/") {
      return new Response("Not Found", { status: 404 });
    }

    const { markdown, styles } = await loadAssets();
    const body = renderToString(<App markdown={markdown} />);
    return new Response(renderPage(body, styles), {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }
});

console.log(`Server running at http://localhost:${port}`);
