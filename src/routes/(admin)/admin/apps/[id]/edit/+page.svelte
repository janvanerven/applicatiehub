<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // On validation failure, show submitted values; otherwise show saved app values.
  const v = $derived(form?.values ?? data.app);
  const e = $derived(form?.errors ?? ({} as Record<string, string>));
</script>

<svelte:head>
  <title>{data.app.name} bewerken — Beheer</title>
</svelte:head>

<div class="mx-auto max-w-2xl p-8">
  <div class="mb-6 flex items-center gap-3">
    <a
      href="/admin/apps"
      class="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
    >
      ← Terug
    </a>
    <h1 class="text-2xl font-bold text-forest-800 dark:text-forest-100">
      {data.app.name} bewerken
    </h1>
  </div>

  <form
    method="post"
    action="?/update"
    class="space-y-5 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-forest-900"
  >
    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-stone-700 dark:text-stone-300">
        Naam <span class="text-red-500">*</span>
      </label>
      <input
        id="name"
        name="name"
        type="text"
        required
        maxlength="100"
        value={v.name}
        class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500 dark:border-stone-600 dark:bg-forest-800 dark:text-stone-100"
      />
      {#if e.name}<p class="mt-1 text-xs text-red-600 dark:text-red-400">{e.name}</p>{/if}
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-stone-700 dark:text-stone-300">
        Omschrijving <span class="text-red-500">*</span>
      </label>
      <textarea
        id="description"
        name="description"
        required
        maxlength="500"
        rows="3"
        class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500 dark:border-stone-600 dark:bg-forest-800 dark:text-stone-100"
      >{v.description}</textarea>
      {#if e.description}<p class="mt-1 text-xs text-red-600 dark:text-red-400">{e.description}</p>{/if}
    </div>

    <!-- Link URL -->
    <div>
      <label for="linkUrl" class="block text-sm font-medium text-stone-700 dark:text-stone-300">
        URL <span class="text-red-500">*</span>
      </label>
      <input
        id="linkUrl"
        name="linkUrl"
        type="text"
        required
        value={v.linkUrl}
        placeholder="https://example.com of /intern/pad"
        class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500 dark:border-stone-600 dark:bg-forest-800 dark:text-stone-100"
      />
      {#if e.linkUrl}<p class="mt-1 text-xs text-red-600 dark:text-red-400">{e.linkUrl}</p>{/if}
    </div>

    <!-- Icon path -->
    <div>
      <label for="iconPath" class="block text-sm font-medium text-stone-700 dark:text-stone-300">
        Pictogram URL <span class="text-xs font-normal text-stone-400">(optioneel)</span>
      </label>
      <input
        id="iconPath"
        name="iconPath"
        type="text"
        value={v.iconPath ?? ''}
        placeholder="/uploads/icon.png"
        class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500 dark:border-stone-600 dark:bg-forest-800 dark:text-stone-100"
      />
    </div>

    <!-- Sort order -->
    <div>
      <label for="sortOrder" class="block text-sm font-medium text-stone-700 dark:text-stone-300">
        Volgorde
      </label>
      <input
        id="sortOrder"
        name="sortOrder"
        type="number"
        min="0"
        value={v.sortOrder}
        class="mt-1 w-24 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500 dark:border-stone-600 dark:bg-forest-800 dark:text-stone-100"
      />
      {#if e.sortOrder}<p class="mt-1 text-xs text-red-600 dark:text-red-400">{e.sortOrder}</p>{/if}
    </div>

    <!-- Flags -->
    <div class="flex gap-6">
      <label class="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
        <input
          type="checkbox"
          name="isExternal"
          checked={v.isExternal}
          class="rounded border-stone-300 accent-forest-600"
        />
        Externe link
      </label>
      <label class="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
        <input
          type="checkbox"
          name="visible"
          checked={v.visible}
          class="rounded border-stone-300 accent-forest-600"
        />
        Zichtbaar op de homepage
      </label>
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
    <div class="flex items-center gap-3 border-t border-stone-100 pt-5 dark:border-stone-800">
      <button
        type="submit"
        class="rounded-lg bg-forest-600 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-700"
      >
        Opslaan
      </button>
      <a
        href="/admin/apps"
        class="rounded-lg border border-stone-300 px-5 py-2 text-sm text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-forest-800"
      >
        Annuleren
      </a>
    </div>
  </form>

  <!-- Danger zone -->
  <div
    class="mt-6 rounded-xl border border-red-200 bg-white p-6 dark:border-red-900 dark:bg-forest-900"
  >
    <h2 class="text-sm font-semibold text-red-700 dark:text-red-400">Verwijderen</h2>
    <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
      Dit kan niet ongedaan worden gemaakt.
    </p>
    <form method="post" action="?/delete" class="mt-4">
      <button
        type="submit"
        onclick={(e) => {
          if (!confirm(`Applicatie "${data.app.name}" definitief verwijderen?`)) e.preventDefault();
        }}
        class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Verwijderen
      </button>
    </form>
  </div>
</div>
