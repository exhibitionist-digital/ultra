import { h, shallowRef, createSSRApp } from 'https://esm.sh/vue';

const importMap = {
  imports: {
    vue: 'https://esm.sh/vue',
    'vue/': 'https://esm.sh/vue/',
    'app.js': '/app.js',
  },
};

const ImportMapScript = () => {
  return h('script', {
    name: 'importmap',
    type: 'importmap',
    innerHTML: JSON.stringify(importMap),
  });
};

const HydrateScript = () => {
  return h('script', {
    name: 'script',
    type: 'module',
    src: `/app.js`,
  });
};

const app = {
  setup() {
    const count = shallowRef(0);

    function up() {
      count.value += 1;
    }

    function down() {
      count.value -= 1;
    }

    return function render() {
      return h('html', { lang: 'en' }, [
        h('head', [
          h('title', 'Ultra SSR Vue Example'),
          ImportMapScript(),
          HydrateScript(),
        ]),
        h('body', [
          h('h1', 'count: ' + count.value),
          h('button', { onClick: up }, 'Up'),
          h('button', { onClick: down }, 'Down'),
        ]),
      ]);
    };
  },
};

export default app;

if (typeof document !== 'undefined') {
  const ultraApp = createSSRApp(app);
  ultraApp.mount(document);
}
