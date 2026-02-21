<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Dashboard — Beheer</title>
</svelte:head>

<div class="p-8">
  <h1 class="text-2xl font-bold text-forest-800 dark:text-forest-100">Dashboard</h1>
  <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">Overzicht van de Applicatie Hub.</p>

  <!-- Stats -->
  <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
    <div class="rounded-xl border border-forest-200 bg-white p-4 dark:border-forest-700 dark:bg-forest-900">
      <p class="text-xs font-medium uppercase tracking-wide text-stone-400">Applicaties</p>
      <p class="mt-1 text-3xl font-bold text-forest-700 dark:text-forest-300">{data.stats.apps}</p>
    </div>
    <div class="rounded-xl border border-forest-200 bg-white p-4 dark:border-forest-700 dark:bg-forest-900">
      <p class="text-xs font-medium uppercase tracking-wide text-stone-400">Pagina's</p>
      <p class="mt-1 text-3xl font-bold text-forest-700 dark:text-forest-300">
        {data.stats.pagesPublished + data.stats.pagesDraft}
      </p>
      <p class="mt-0.5 text-xs text-stone-400">
        {data.stats.pagesPublished} gepubliceerd · {data.stats.pagesDraft} concept
      </p>
    </div>
    <div class="rounded-xl border border-forest-200 bg-white p-4 dark:border-forest-700 dark:bg-forest-900">
      <p class="text-xs font-medium uppercase tracking-wide text-stone-400">Menu-items</p>
      <p class="mt-1 text-3xl font-bold text-forest-700 dark:text-forest-300">{data.stats.menuItems}</p>
    </div>
    <div class="rounded-xl border border-forest-200 bg-white p-4 dark:border-forest-700 dark:bg-forest-900">
      <p class="text-xs font-medium uppercase tracking-wide text-stone-400">Mediabestanden</p>
      <p class="mt-1 text-3xl font-bold text-forest-700 dark:text-forest-300">{data.stats.media}</p>
    </div>
  </div>

  <!-- Navigation cards -->
  <h2 class="mt-8 text-sm font-semibold text-stone-500 dark:text-stone-400">Beheer</h2>
  <div class="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each [
      { label: 'Applicaties', href: '/admin/apps', icon: '🗂️' },
      { label: "Pagina's", href: '/admin/pages', icon: '📄' },
      { label: 'Menu', href: '/admin/menu', icon: '📋' },
      { label: 'Media', href: '/admin/media', icon: '🖼️' }
    ] as item}
      <a
        href={item.href}
        class="flex items-center gap-3 rounded-lg border border-forest-200 bg-white p-4 hover:border-forest-400 hover:shadow-sm dark:border-forest-700 dark:bg-forest-900 dark:hover:border-forest-500"
      >
        <span class="text-2xl" aria-hidden="true">{item.icon}</span>
        <span class="font-medium text-stone-700 dark:text-stone-200">{item.label}</span>
      </a>
    {/each}
  </div>
</div>
