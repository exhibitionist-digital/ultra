import { createSSRApp } from 'https://esm.sh/vue';
import { createRenderHandler } from 'ultra/lib/vue/renderer.ts';
import { renderToWebStream } from 'https://esm.sh/@vue/server-renderer';
import app from './src/app.js';

const root = Deno.cwd();

// create symlink to ultra for development
try {
  await Deno.symlink('../../', './ultra', { type: 'dir' });
} catch (error) {
  // ignore
}

const ultraApp = createSSRApp(app);

const renderer = createRenderHandler({
  root,
  render(request) {
    return renderToWebStream(ultraApp);
  },
});

Deno.serve(async (request) => {
  const url = new URL(request.url, 'http://localhost');

  // quick js file sserver
  const static_path = './src';
  const filePath = static_path + url.pathname;
  let file;
  try {
    file = await Deno.readFile(filePath);
  } catch {}
  if (file) {
    return new Response(file, {
      headers: { 'content-type': 'text/javascript' },
    });
  }

  if (url.pathname === '/favicon.ico') {
    return new Response(null, { status: 404 });
  }

  if (renderer.supportsRequest(request)) {
    return renderer.handleRequest(request);
  }

  return new Response('Not Found', { status: 404 });
});
