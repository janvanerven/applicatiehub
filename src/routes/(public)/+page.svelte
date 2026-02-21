<script lang="ts">
  import AppCard from '$components/AppCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Applicatie Hub</title>
  <meta name="description" content="Een overzicht van alle beschikbare applicaties." />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-16">
  <div class="mb-12 text-center">
    <h1 class="text-4xl font-bold tracking-tight text-forest-800 dark:text-forest-100">
      Applicatie Hub
    </h1>
    <p class="mt-3 text-lg text-stone-500 dark:text-stone-400">
      Ontdek alle beschikbare applicaties.
    </p>
  </div>

  {#if data.apps.length === 0}
    <p class="text-center text-stone-400 dark:text-stone-500">Nog geen applicaties toegevoegd.</p>
  {:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.apps as app (app.id)}
        <AppCard {app} />
      {/each}
    </div>
  {/if}
</section>
