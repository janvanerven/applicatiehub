<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let copied = $state<string | null>(null);

  function copySnippet(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      copied = text;
      setTimeout(() => {
        copied = null;
      }, 2000);
    });
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<svelte:head>
  <title>Media — Beheer</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-8">
  <h1 class="mb-6 text-2xl font-bold text-forest-800 dark:text-forest-200">Media</h1>

  <!-- Upload form -->
  <section
    class="mb-8 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-forest-900"
  >
    <h2 class="mb-4 text-base font-semibold text-stone-700 dark:text-stone-200">
      Bestand uploaden
    </h2>
    <form method="post" action="?/upload" enctype="multipart/form-data" class="flex items-end gap-3">
      <div class="flex-1">
        <label for="file" class="mb-1 block text-sm text-stone-600 dark:text-stone-400">
          Afbeelding (JPEG, PNG, WebP, GIF, SVG — max 10 MB)
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          class="block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-forest-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-forest-700 hover:file:bg-forest-100 dark:border-stone-600 dark:bg-forest-800 dark:text-stone-200"
        />
      </div>
      <button
        type="submit"
        class="rounded-lg bg-forest-600 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-700"
      >
        Uploaden
      </button>
    </form>

    {#if form?.error}
      <p class="mt-3 text-sm text-red-600 dark:text-red-400">{form.error}</p>
    {/if}

    {#if form?.uploaded}
      <div
        class="mt-4 rounded-lg border border-forest-200 bg-forest-50 p-4 dark:border-forest-700 dark:bg-forest-800"
      >
        <p class="mb-2 text-sm font-medium text-forest-700 dark:text-forest-300">Geüpload</p>
        <img
          src={form.uploaded.publicUrl}
          alt="Upload preview"
          class="mb-3 max-h-32 rounded object-contain"
        />
        <div class="flex items-center gap-2">
          <code
            class="flex-1 truncate rounded bg-white px-3 py-1.5 text-xs text-stone-700 dark:bg-forest-900 dark:text-stone-300"
          >
            {form.uploaded.markdownSnippet}
          </code>
          <button
            onclick={() => copySnippet(form!.uploaded!.markdownSnippet)}
            class="rounded px-3 py-1.5 text-xs font-medium text-forest-700 hover:bg-forest-100 dark:text-forest-300 dark:hover:bg-forest-700"
          >
            {copied === form.uploaded.markdownSnippet ? 'Gekopieerd!' : 'Kopieer'}
          </button>
        </div>
      </div>
    {/if}
  </section>

  <!-- Upload list -->
  <section>
    <h2 class="mb-4 text-base font-semibold text-stone-700 dark:text-stone-200">
      Geüploade bestanden ({data.uploads.length})
    </h2>

    {#if data.uploads.length === 0}
      <p class="text-sm text-stone-400">Nog geen bestanden geüpload.</p>
    {:else}
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.uploads as upload (upload.filename)}
          <div
            class="rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-forest-900"
          >
            <img
              src={upload.publicUrl}
              alt={upload.filename}
              class="mb-2 h-24 w-full rounded bg-stone-100 object-contain dark:bg-forest-800"
            />
            <p class="mb-1 truncate text-xs text-stone-500 dark:text-stone-400">
              {upload.filename}
            </p>
            <p class="mb-2 text-xs text-stone-400">{formatBytes(upload.sizeBytes)}</p>
            <div class="mb-2 flex items-center gap-2">
              <code
                class="flex-1 truncate rounded bg-stone-50 px-2 py-1 text-xs text-stone-600 dark:bg-forest-800 dark:text-stone-400"
              >
                {upload.markdownSnippet}
              </code>
              <button
                onclick={() => copySnippet(upload.markdownSnippet)}
                class="shrink-0 rounded px-2 py-1 text-xs font-medium text-forest-700 hover:bg-forest-50 dark:text-forest-300 dark:hover:bg-forest-700"
              >
                {copied === upload.markdownSnippet ? '✓' : 'Kopieer'}
              </button>
            </div>
            <form method="post" action="?/delete">
              <input type="hidden" name="filename" value={upload.filename} />
              <button
                type="submit"
                class="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                onclick={(e) => {
                  if (!confirm('Bestand permanent verwijderen?')) e.preventDefault();
                }}
              >
                Verwijderen
              </button>
            </form>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
