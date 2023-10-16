import { createSSRApp } from 'https://esm.sh/vue';
import app from './app.js';

const ultraApp = createSSRApp(app);
ultraApp.mount(document);
