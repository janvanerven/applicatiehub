<script lang="ts">
  import type { App } from '$lib/modules/apps';

  let { app }: { app: App } = $props();
</script>

<a
  href={app.linkUrl}
  target={app.isExternal ? '_blank' : undefined}
  rel={app.isExternal ? 'noopener noreferrer' : undefined}
  class="group flex flex-col gap-3 rounded-xl border border-forest-200 bg-white p-5 shadow-sm transition-all hover:border-forest-400 hover:shadow-md dark:border-forest-700 dark:bg-forest-900 dark:hover:border-forest-500"
>
  {#if app.iconPath}
    <img src={app.iconPath} alt="" class="h-12 w-12 rounded-lg object-cover" aria-hidden="true" />
  {:else}
    <div
      class="flex h-12 w-12 items-center justify-center rounded-lg bg-forest-100 dark:bg-forest-800"
    >
      <span class="text-2xl" aria-hidden="true">🗂️</span>
    </div>
  {/if}

  <div class="flex-1">
    <h2
      class="font-semibold text-stone-800 transition-colors group-hover:text-forest-700 dark:text-stone-100 dark:group-hover:text-forest-300"
    >
      {app.name}
    </h2>
    <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">{app.description}</p>
  </div>

  {#if app.isExternal}
    <span class="text-xs text-stone-400 dark:text-stone-500">Externe link ↗</span>
  {/if}
</a>
