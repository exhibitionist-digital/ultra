import { createSSRApp, h, ref, shallowRef } from 'https://esm.sh/vue';
import { createRenderHandler } from 'ultra/lib/vue/renderer.ts';
import { renderToWebStream } from 'https://esm.sh/@vue/server-renderer';
import app from './app.js';

// TODO: This is a basic vue ssr example, need to add renderer to inject hydration codes

const root = Deno.cwd();

// create symlink to ultra for development
try {
  await Deno.symlink('../../', './ultra', { type: 'dir' });
} catch (error) {
  // ignore
}

const importMap = {
  imports: {
    vue: 'https://esm.sh/vue',
    'vue/': 'https://esm.sh/vue/',
    '/~/': import.meta.resolve('./'),
    'ultra/': import.meta.resolve('./ultra/'),
  },
};

const ultraApp = createSSRApp(app);

const renderer = createRenderHandler({
  root,
  client: './client.js',
  render(request) {
    return renderToWebStream(ultraApp);
  },
});

Deno.serve((request) => {
  const url = new URL(request.url, 'http://localhost');

  if (url.pathname === '/favicon.ico') {
    return new Response(null, { status: 404 });
  }

  if (renderer.supportsRequest(request)) {
    return renderer.handleRequest(request);
  }

  // return new Response();
});
