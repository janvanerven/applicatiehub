<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
  <title>Applicaties — Beheer</title>
</svelte:head>

<div class="p-8">
  {#if form?.error}
    <div
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
    >
      {form.error}
    </div>
  {/if}

  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold text-forest-800 dark:text-forest-100">Applicaties</h1>
    <a
      href="/admin/apps/new"
      class="rounded-lg bg-forest-600 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700"
    >
      + Nieuwe applicatie
    </a>
  </div>

  {#if data.apps.length === 0}
    <p class="text-stone-500 dark:text-stone-400">Nog geen applicaties aangemaakt.</p>
  {:else}
    <div class="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700">
      <table class="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
        <thead class="bg-stone-50 dark:bg-forest-900">
          <tr>
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400"
            >Volgorde</th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400"
            >Naam</th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400"
            >URL</th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400"
            >Zichtbaar</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100 bg-white dark:divide-stone-800 dark:bg-forest-950">
          {#each data.apps as app (app.id)}
            <tr class="hover:bg-stone-50 dark:hover:bg-forest-900">
              <td class="px-4 py-3 text-sm text-stone-500 dark:text-stone-400">{app.sortOrder}</td>
              <td class="px-4 py-3">
                <p class="font-medium text-stone-800 dark:text-stone-100">{app.name}</p>
                <p class="text-xs text-stone-400 dark:text-stone-500">{app.description}</p>
              </td>
              <td class="px-4 py-3 text-sm text-stone-500 dark:text-stone-400">
                <span class="font-mono">{app.linkUrl}</span>
                {#if app.isExternal}
                  <span
                    class="ml-1 rounded bg-bark-100 px-1 py-0.5 text-xs text-bark-600 dark:bg-bark-800 dark:text-bark-200"
                  >extern</span>
                {/if}
              </td>
              <td class="px-4 py-3">
                {#if app.visible}
                  <span class="text-sm text-forest-600 dark:text-forest-400">✓ Ja</span>
                {:else}
                  <span class="text-sm text-stone-400">— Nee</span>
                {/if}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-3">
                  <a
                    href="/admin/apps/{app.id}/edit"
                    class="text-sm text-forest-600 hover:text-forest-800 dark:text-forest-400 dark:hover:text-forest-200"
                  >
                    Bewerken
                  </a>
                  <form method="post" action="?/delete">
                    <input type="hidden" name="id" value={app.id} />
                    <button
                      type="submit"
                      onclick={(e) => {
                        if (!confirm(`Applicatie "${app.name}" verwijderen?`)) e.preventDefault();
                      }}
                      class="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
</div>
