import { Marked } from 'marked';
import hljs from 'highlight.js';

// Use a local Marked instance instead of mutating the global singleton.
// Content rendered here is admin-authored — do not pass untrusted user input.
const markedInstance = new Marked({
  renderer: {
    code({ text, lang }) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    }
  }
});

/**
 * Render admin-authored Markdown to HTML with syntax-highlighted code blocks.
 * Only safe for trusted content — do not call with untrusted user input.
 */
export function renderMarkdown(content: string): string {
  return markedInstance.parse(content, { async: false });
}
