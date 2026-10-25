import { defineConfig } from 'vite';
import { SECTIONS } from './src/render/sections.js';
import { buildSchema } from './src/render/schema.js';

// Pre-renders data-driven sections into index.html so crawlers see full content without JS.
function prerender() {
  const renderers = { ...SECTIONS, schema: buildSchema };
  return {
    name: 'prerender-sections',
    transformIndexHtml(html) {
      return html.replace(/<!--@(\w+)-->/g, (marker, key) => {
        if (!renderers[key]) throw new Error(`Unknown prerender marker: ${marker}`);
        return renderers[key]();
      });
    },
  };
}

export default defineConfig({ plugins: [prerender()] });
