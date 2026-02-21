<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Pagina's — Beheer</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-8">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold text-forest-800 dark:text-forest-200">Pagina's</h1>
    <a
      href="/admin/pages/new"
      class="rounded-lg bg-forest-600 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700"
    >
      + Nieuwe pagina
    </a>
  </div>

  {#if data.pages.length === 0}
    <p class="text-sm text-stone-400">Nog geen pagina's aangemaakt.</p>
  {:else}
    <div class="overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-forest-900">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-stone-200 text-left text-xs font-medium uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
            <th class="px-4 py-3">Titel</th>
            <th class="px-4 py-3">Slug</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Menu</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
          {#each data.pages as page (page.id)}
            <tr class="hover:bg-stone-50 dark:hover:bg-forest-800">
              <td class="px-4 py-3 font-medium text-stone-800 dark:text-stone-200">
                {page.title}
              </td>
              <td class="px-4 py-3 font-mono text-xs text-stone-500 dark:text-stone-400">
                /{page.slug}
              </td>
              <td class="px-4 py-3">
                {#if page.status === 'published'}
                  <span
                    class="rounded-full bg-forest-100 px-2 py-0.5 text-xs font-medium text-forest-700 dark:bg-forest-800 dark:text-forest-300"
                  >
                    Gepubliceerd
                  </span>
                {:else}
                  <span
                    class="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                  >
                    Concept
                  </span>
                {/if}
              </td>
              <td class="px-4 py-3 text-stone-400">
                {page.showInMenu ? '✓' : '—'}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3 justify-end">
                  <a
                    href="/admin/pages/{page.id}/edit"
                    class="text-sm text-forest-600 hover:text-forest-800 dark:text-forest-400 dark:hover:text-forest-200"
                  >
                    Bewerken
                  </a>
                  <form method="post" action="?/delete">
                    <input type="hidden" name="id" value={page.id} />
                    <button
                      type="submit"
                      class="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onclick={(e) => {
                        if (!confirm(`"${page.title}" permanent verwijderen?`)) e.preventDefault();
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
</div>
