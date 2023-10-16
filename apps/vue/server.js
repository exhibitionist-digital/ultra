import { createSSRApp, h, ref, shallowRef } from 'https://esm.sh/vue';
import { renderToWebStream } from 'https://esm.sh/@vue/server-renderer';

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

const app = createSSRApp({
  setup() {
    const count = shallowRef(0);

    function up() {
      count.value += 1;
    }

    function down() {
      count.value -= 1;
    }

    return function render() {
      return h('div', [
        h('h1', 'count: ' + count.value),
        h('button', { onClick: up }, 'Up'),
        h('button', { onClick: down }, 'Down'),
      ]);
    };
  },
});

Deno.serve((request) => {
  const url = new URL(request.url, 'http://localhost');

  if (url.pathname === '/favicon.ico') {
    return new Response(null, { status: 404 });
  }

  return new Response(renderToWebStream(app));
});
