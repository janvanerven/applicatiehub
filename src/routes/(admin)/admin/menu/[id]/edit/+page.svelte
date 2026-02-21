<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const v = $derived(form?.values ?? data.item);
  const e = $derived(form?.errors ?? ({} as Record<string, string>));
</script>

<svelte:head>
  <title>{data.item.label} bewerken — Beheer</title>
</svelte:head>

<div class="mx-auto max-w-2xl p-8">
  <div class="mb-6 flex items-center gap-3">
    <a href="/admin/menu" class="text-sm text-stone-400 hover:text-stone-600">← Menu</a>
    <span class="text-stone-300">/</span>
    <h1 class="text-xl font-bold text-forest-800 dark:text-forest-200">
      {data.item.label} bewerken
    </h1>
  </div>

  <form
    method="post"
    action="?/update"
    class="space-y-4 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-forest-900"
  >
    <div>
      <label for="label" class="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
        Label <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="label"
        name="label"
        value={v.label}
        class="w-full rounded-lg border px-3 py-2 text-sm dark:bg-forest-800 dark:text-stone-200
          {e.label
          ? 'border-red-400 dark:border-red-600'
          : 'border-stone-300 dark:border-stone-600'}"
      />
      {#if e.label}<p class="mt-1 text-xs text-red-600 dark:text-red-400">{e.label}</p>{/if}
    </div>

    <div>
      <label for="href" class="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
        URL <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="href"
        name="href"
        value={v.href}
        placeholder="/pagina of https://..."
        class="w-full rounded-lg border px-3 py-2 text-sm font-mono dark:bg-forest-800 dark:text-stone-200
          {e.href
          ? 'border-red-400 dark:border-red-600'
          : 'border-stone-300 dark:border-stone-600'}"
      />
      {#if e.href}<p class="mt-1 text-xs text-red-600 dark:text-red-400">{e.href}</p>{/if}
    </div>

    <div class="flex gap-6">
      <label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
        <input
          type="checkbox"
          name="visible"
          checked={v.visible}
          class="rounded border-stone-300 accent-forest-600"
        />
        Zichtbaar
      </label>
      <label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
        <input
          type="checkbox"
          name="isExternal"
          checked={v.isExternal}
          class="rounded border-stone-300 accent-forest-600"
        />
        Externe link (opent in nieuw tabblad)
      </label>
    </div>

    {#if e._form}
      <div
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
      >
        {e._form}
      </div>
    {/if}

    <div class="flex items-center gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
      <button
        type="submit"
        class="rounded-lg bg-forest-600 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-700"
      >
        Opslaan
      </button>
      <a href="/admin/menu" class="text-sm text-stone-500 hover:text-stone-700">Annuleren</a>
    </div>
  </form>

  <div
    class="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950"
  >
    <h2 class="mb-3 text-sm font-semibold text-red-700 dark:text-red-400">Gevarenzone</h2>
    <form method="post" action="?/delete">
      <button
        type="submit"
        class="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900"
        onclick={(e) => {
          if (!confirm('Dit menu-item permanent verwijderen?')) e.preventDefault();
        }}
      >
        Menu-item verwijderen
      </button>
    </form>
  </div>
</div>
