export function twindContent() {
  return `
      import { setup } from "twind";
      import { sheet } from 'create-ultra-app/twind'

      /**
      * Your theme configuration for twind
      */
      const theme = {};

      setup({ sheet, theme });
   `;
}