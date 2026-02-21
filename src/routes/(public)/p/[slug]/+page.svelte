<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.page.title} — Applicatie Hub</title>
  {#if data.page.metaDescription}
    <meta name="description" content={data.page.metaDescription} />
  {/if}
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12">
  <h1 class="mb-8 text-3xl font-bold text-forest-800 dark:text-forest-200">{data.page.title}</h1>

  <!-- Admin-authored Markdown rendered server-side — trusted content only -->
  <div
    class="prose prose-stone max-w-none
      prose-headings:text-forest-800 prose-a:text-forest-600 prose-a:hover:text-forest-800
      dark:prose-invert dark:prose-headings:text-forest-200 dark:prose-a:text-forest-400"
  >
    {@html data.html}
  </div>
</div>
