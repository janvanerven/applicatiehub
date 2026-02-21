<svelte:head>
  <title>Inloggen — Applicatie Hub</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
  <div
    class="w-full max-w-sm rounded-xl border border-forest-200 bg-white p-8 shadow-sm dark:border-forest-700 dark:bg-forest-900"
  >
    <div class="text-center">
      <span class="text-5xl" aria-hidden="true">🌲</span>
      <h1 class="mt-4 text-2xl font-bold text-forest-800 dark:text-forest-100">Inloggen</h1>
      <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Log in om het beheerpaneel te openen.
      </p>
    </div>

    <form method="post" class="mt-8">
      <button
        type="submit"
        class="w-full rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 dark:ring-offset-forest-900"
      >
        Inloggen via Authentik
      </button>
    </form>
  </div>
</div>
