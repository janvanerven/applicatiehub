<script lang="ts">
  import type { App } from '$lib/modules/apps';

  let { app }: { app: App } = $props();
</script>

<a
  href={app.linkUrl}
  target={app.isExternal ? '_blank' : undefined}
  rel={app.isExternal ? 'noopener noreferrer' : undefined}
  class="group flex flex-col gap-4 rounded-2xl border-2 border-forest-100 bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-forest-300 hover:shadow-xl dark:border-forest-800 dark:bg-forest-900 dark:hover:border-forest-600"
>
  {#if app.iconPath}
    <img src={app.iconPath} alt="" class="h-14 w-14 rounded-xl object-cover shadow-sm" aria-hidden="true" />
  {:else}
    <div
      class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-forest-400 to-forest-600 shadow-sm dark:from-forest-600 dark:to-forest-800"
    >
      <span class="text-3xl" aria-hidden="true">🗂️</span>
    </div>
  {/if}

  <div class="flex-1">
    <h2
      class="text-lg font-bold text-stone-800 transition-colors group-hover:text-forest-700 dark:text-stone-100 dark:group-hover:text-forest-300"
    >
      {app.name}
    </h2>
    <p class="mt-1 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
      {app.description}
    </p>
  </div>

  <div class="flex items-center justify-between">
    <span
      class="text-sm font-bold text-forest-600 transition-colors group-hover:text-forest-700 dark:text-forest-400 dark:group-hover:text-forest-300"
    >
      Openen →
    </span>
    {#if app.isExternal}
      <span
        class="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-400 dark:bg-forest-800 dark:text-stone-500"
      >
        extern
      </span>
    {/if}
  </div>
</a>
