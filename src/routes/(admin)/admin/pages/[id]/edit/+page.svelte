<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const v = $derived(form?.values ?? data.page);
  const e = $derived(form?.errors ?? ({} as Record<string, string>));
</script>

<svelte:head>
  <title>{data.page.title} bewerken — Beheer</title>
</svelte:head>

<div class="mx-auto max-w-3xl p-8">
  <div class="mb-6 flex items-center gap-3">
    <a href="/admin/pages" class="text-sm text-stone-400 hover:text-stone-600">← Pagina's</a>
    <span class="text-stone-300">/</span>
    <h1 class="text-xl font-bold text-forest-800 dark:text-forest-200">{data.page.title} bewerken</h1>
  </div>

  <form
    method="post"
    action="?/update"
    class="space-y-5 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-forest-900"
  >
    <!-- Title -->
    <div>
      <label for="title" class="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
        Titel <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={v.title}
        class="w-full rounded-lg border px-3 py-2 text-sm dark:bg-forest-800 dark:text-stone-200
          {e.title
          ? 'border-red-400 dark:border-red-600'
          : 'border-stone-300 dark:border-stone-600'}"
      />
      {#if e.title}<p class="mt-1 text-xs text-red-600 dark:text-red-400">{e.title}</p>{/if}
    </div>

    <!-- Slug -->
    <div>
      <label for="slug" class="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
        Slug <span class="text-red-500">*</span>
      </label>
      <p class="mb-1 text-xs text-stone-400">
        Let op: het wijzigen van de slug verbreekt bestaande links naar deze pagina.
      </p>
      <div class="flex items-center gap-2">
        <span class="text-sm text-stone-400">/p/</span>
        <input
          type="text"
          id="slug"
          name="slug"
          value={v.slug}
          class="flex-1 rounded-lg border px-3 py-2 font-mono text-sm dark:bg-forest-800 dark:text-stone-200
            {e.slug
            ? 'border-red-400 dark:border-red-600'
            : 'border-stone-300 dark:border-stone-600'}"
        />
      </div>
      {#if e.slug}<p class="mt-1 text-xs text-red-600 dark:text-red-400">{e.slug}</p>{/if}
    </div>

    <!-- Content -->
    <div>
      <label
        for="content"
        class="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
      >
        Inhoud (Markdown)
      </label>
      <textarea
        id="content"
        name="content"
        rows="16"
        class="w-full rounded-lg border border-stone-300 px-3 py-2 font-mono text-sm dark:border-stone-600 dark:bg-forest-800 dark:text-stone-200"
      >{v.content}</textarea>
    </div>

    <!-- Status + Menu -->
    <div class="flex flex-wrap gap-6">
      <fieldset>
        <legend class="mb-1 text-sm font-medium text-stone-700 dark:text-stone-300">Status</legend>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={v.status !== 'published'}
              class="accent-forest-600"
            />
            Concept
          </label>
          <label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
            <input
              type="radio"
              name="status"
              value="published"
              checked={v.status === 'published'}
              class="accent-forest-600"
            />
            Gepubliceerd
          </label>
        </div>
      </fieldset>

      <label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
        <input
          type="checkbox"
          name="showInMenu"
          checked={v.showInMenu}
          class="rounded border-stone-300 accent-forest-600"
        />
        Tonen in menu
      </label>
    </div>

    <!-- Meta description -->
    <div>
      <label
        for="metaDescription"
        class="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
      >
        Meta-beschrijving
        <span class="font-normal text-stone-400">(optioneel, max 300 tekens)</span>
      </label>
      <textarea
        id="metaDescription"
        name="metaDescription"
        rows="2"
        class="w-full rounded-lg border px-3 py-2 text-sm dark:bg-forest-800 dark:text-stone-200
          {e.metaDescription
          ? 'border-red-400 dark:border-red-600'
          : 'border-stone-300 dark:border-stone-600'}"
      >{v.metaDescription ?? ''}</textarea>
      {#if e.metaDescription}
        <p class="mt-1 text-xs text-red-600 dark:text-red-400">{e.metaDescription}</p>
      {/if}
    </div>

    <!-- Server error banner -->
    {#if e._form}
      <div
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
      >
        {e._form}
      </div>
    {/if}

    <!-- Actions -->
    <div class="flex items-center gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
      <button
        type="submit"
        class="rounded-lg bg-forest-600 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-700"
      >
        Opslaan
      </button>
      <a
        href="/p/{data.page.slug}"
        target="_blank"
        class="text-sm text-stone-500 hover:text-stone-700"
      >
        Bekijken ↗
      </a>
      <a href="/admin/pages" class="text-sm text-stone-500 hover:text-stone-700">Annuleren</a>
    </div>
  </form>

  <!-- Danger zone -->
  <div
    class="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950"
  >
    <h2 class="mb-3 text-sm font-semibold text-red-700 dark:text-red-400">Gevarenzone</h2>
    <form method="post" action="?/delete">
      <button
        type="submit"
        class="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900"
        onclick={(e) => {
          if (!confirm('Deze pagina permanent verwijderen?')) e.preventDefault();
        }}
      >
        Pagina verwijderen
      </button>
    </form>
  </div>
</div>
