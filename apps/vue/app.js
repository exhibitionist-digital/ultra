import { h, shallowRef } from 'https://esm.sh/vue';

const importMap = {
  imports: {
    vue: 'https://esm.sh/vue',
    'vue/': 'https://esm.sh/vue/',
  },
};

const ImportMapScript = () => {
  return h('script', {
    name: 'importmap',
    type: 'importmap',
    innerHTML: JSON.stringify(importMap),
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
      return h('html', [
        h('head', [h('title', 'Ultra SSR Vue Example'), ImportMapScript()]),
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
