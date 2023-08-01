import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/demo', component: 'demo/demo' },
  ],
  npmClient: 'pnpm',
});
