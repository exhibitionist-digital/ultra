// required until Deno v2
import 'data:text/javascript,delete globalThis.window;';

import { createRenderHandler } from 'ultra/lib/vue/renderer.ts';
import { renderToWebStream } from 'https://esm.sh/@vue/server-renderer';
import app, { router } from './src/app.js';

const root = Deno.cwd();

// create symlink to ultra for development
try {
  await Deno.symlink('../../', './ultra', { type: 'dir' });
} catch (error) {
  // ignore
}

const importmap = {
  imports: {
    vue: 'https://esm.sh/vue@3.3.4?dev',
    'vue/': 'https://esm.sh/vue@3.3.4?dev/',
    'vue-router': 'https://esm.sh/vue-router@4.2.5?dev',
  },
};

const renderer = createRenderHandler({
  root,
  render(request) {
    app.provide(/* key */ 'importmap', /* value */ JSON.stringify(importmap));
    router.push(new URL(request.url).pathname);
    return router.isReady().then(() => renderToWebStream(app));
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
