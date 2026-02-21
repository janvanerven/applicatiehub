<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status} — Applicatie Hub</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center p-8 text-center">
  <p class="text-8xl font-black text-forest-600 dark:text-forest-400">{page.status}</p>

  <h1 class="mt-4 text-2xl font-bold text-stone-800 dark:text-stone-200">
    {#if page.status === 404}
      Pagina niet gevonden
    {:else if page.status === 403}
      Toegang geweigerd
    {:else}
      Er is iets misgegaan
    {/if}
  </h1>

  {#if page.error?.message && page.status !== 404}
    <p class="mt-2 max-w-md text-stone-500 dark:text-stone-400">{page.error.message}</p>
  {/if}

  <a
    href="/"
    class="mt-8 rounded-lg bg-forest-600 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-700"
  >
    Terug naar de homepage
  </a>
</div>
