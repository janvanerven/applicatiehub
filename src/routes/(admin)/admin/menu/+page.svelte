<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const addErrors = $derived(form?.addErrors ?? ({} as Record<string, string>));
  const addValues = $derived(form?.addValues);
</script>

<svelte:head>
  <title>Menu — Beheer</title>
</svelte:head>

<div class="mx-auto max-w-3xl p-8 space-y-8">
  <h1 class="text-2xl font-bold text-forest-800 dark:text-forest-200">Menu</h1>

  <!-- Menu items list -->
  <section>
    <h2 class="mb-4 text-base font-semibold text-stone-700 dark:text-stone-200">Menu-items</h2>

    {#if form?.error}
      <p class="mb-3 text-sm text-red-600 dark:text-red-400">{form.error}</p>
    {/if}

    {#if data.items.length === 0}
      <p class="text-sm text-stone-400">Nog geen menu-items. Voeg er hieronder een toe.</p>
    {:else}
      <div class="overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-forest-900">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-stone-200 text-left text-xs font-medium uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
              <th class="px-4 py-3">Volgorde</th>
              <th class="px-4 py-3">Label</th>
              <th class="px-4 py-3">URL</th>
              <th class="px-4 py-3">Zichtbaar</th>
              <th class="px-4 py-3">Extern</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            {#each data.items as item, i (item.id)}
              <tr class="hover:bg-stone-50 dark:hover:bg-forest-800">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1">
                    <form method="post" action="?/moveUp">
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        disabled={i === 0}
                        class="rounded p-1 text-stone-400 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-stone-200"
                        title="Omhoog"
                      >
                        ▲
                      </button>
                    </form>
                    <form method="post" action="?/moveDown">
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        disabled={i === data.items.length - 1}
                        class="rounded p-1 text-stone-400 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-stone-200"
                        title="Omlaag"
                      >
                        ▼
                      </button>
                    </form>
                  </div>
                </td>
                <td class="px-4 py-3 font-medium text-stone-800 dark:text-stone-200">
                  {item.label}
                </td>
                <td class="px-4 py-3 font-mono text-xs text-stone-500 dark:text-stone-400">
                  {item.href}
                </td>
                <td class="px-4 py-3 text-center text-stone-400">
                  {item.visible ? '✓' : '—'}
                </td>
                <td class="px-4 py-3 text-center text-stone-400">
                  {item.isExternal ? '↗' : '—'}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-3">
                    <a
                      href="/admin/menu/{item.id}/edit"
                      class="text-sm text-forest-600 hover:text-forest-800 dark:text-forest-400 dark:hover:text-forest-200"
                    >
                      Bewerken
                    </a>
                    <form method="post" action="?/delete">
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        class="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onclick={(e) => {
                          if (!confirm(`"${item.label}" verwijderen?`)) e.preventDefault();
                        }}
                      >
                        Verwijderen
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>

  <!-- Add item form -->
  <section class="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-forest-900">
    <h2 class="mb-4 text-base font-semibold text-stone-700 dark:text-stone-200">
      Nieuw menu-item
    </h2>
    <form method="post" action="?/add" class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            for="label"
            class="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Label <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="label"
            name="label"
            value={addValues?.label ?? ''}
            class="w-full rounded-lg border px-3 py-2 text-sm dark:bg-forest-800 dark:text-stone-200
              {addErrors.label
              ? 'border-red-400 dark:border-red-600'
              : 'border-stone-300 dark:border-stone-600'}"
          />
          {#if addErrors.label}
            <p class="mt-1 text-xs text-red-600 dark:text-red-400">{addErrors.label}</p>
          {/if}
        </div>
        <div>
          <label
            for="href"
            class="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            URL <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="href"
            name="href"
            value={addValues?.href ?? ''}
            placeholder="/pagina of https://..."
            class="w-full rounded-lg border px-3 py-2 font-mono text-sm dark:bg-forest-800 dark:text-stone-200
              {addErrors.href
              ? 'border-red-400 dark:border-red-600'
              : 'border-stone-300 dark:border-stone-600'}"
          />
          {#if addErrors.href}
            <p class="mt-1 text-xs text-red-600 dark:text-red-400">{addErrors.href}</p>
          {/if}
        </div>
      </div>

      <div class="flex gap-6">
        <label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
          <input
            type="checkbox"
            name="visible"
            checked={addValues?.visible ?? true}
            class="rounded border-stone-300 accent-forest-600"
          />
          Zichtbaar
        </label>
        <label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
          <input
            type="checkbox"
            name="isExternal"
            checked={addValues?.isExternal ?? false}
            class="rounded border-stone-300 accent-forest-600"
          />
          Externe link
        </label>
      </div>

      {#if addErrors._form}
        <div
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {addErrors._form}
        </div>
      {/if}

      <button
        type="submit"
        class="rounded-lg bg-forest-600 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-700"
      >
        Toevoegen
      </button>
    </form>
  </section>

  <!-- Settings -->
  <section class="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-forest-900">
    <h2 class="mb-4 text-base font-semibold text-stone-700 dark:text-stone-200">Instellingen</h2>
    <form method="post" action="?/settings">
      <label class="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
        <input
          type="checkbox"
          name="showLoginLink"
          checked={data.settings.showLoginLink}
          class="rounded border-stone-300 accent-forest-600"
        />
        <span>
          Toon "Inloggen"-knop in de navigatie voor niet-ingelogde bezoekers
        </span>
      </label>
      <button
        type="submit"
        class="mt-4 rounded-lg bg-forest-600 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-700"
      >
        Opslaan
      </button>
    </form>
  </section>
</div>
