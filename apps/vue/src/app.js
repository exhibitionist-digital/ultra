import { h, shallowRef, createSSRApp, inject } from 'vue';
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  RouterView,
} from 'vue-router';

const routes = [
  {
    path: '/',
    component: h('h1', 'HOME'),
  },
];

export const router = createRouter({
  history:
    typeof document === 'undefined'
      ? createMemoryHistory()
      : createWebHistory(),
  routes,
});

const ImportMapScript = (importmap) => {
  return h('script', {
    name: 'importmap',
    type: 'importmap',
    innerHTML: importmap,
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
    const importmap = inject('importmap');
    const count = shallowRef(0);

    function up() {
      count.value++;
    }

    function down() {
      count.value--;
    }

    return function render() {
      return h('html', { lang: 'en' }, [
        h('head', [
          h('title', 'Ultra SSR Vue Example'),
          ImportMapScript(importmap),
          HydrateScript(),
        ]),
        h('body', [
          h('h2', 'count: ' + count.value),
          h('button', { onClick: up }, 'Up'),
          h('button', { onClick: down }, 'Down'),
          h(RouterView),
        ]),
      ]);
    };
  },
};

const ultraApp = createSSRApp(app);
ultraApp.use(router);

export default ultraApp;

if (typeof document !== 'undefined') {
  ultraApp.provide('importmap', document.scripts.namedItem('importmap'));
  router.isReady().then(() => ultraApp.mount(document));
}
