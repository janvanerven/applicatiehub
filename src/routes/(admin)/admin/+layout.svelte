<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { onMount } from 'svelte';

  // data.user is guaranteed non-null by the (admin)/+layout.server.ts auth guard
  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let dark = $state(false);

  onMount(() => {
    dark = document.documentElement.classList.contains('dark');
  });

  function toggleDark() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
</script>

<div class="flex min-h-screen">
  <!-- Sidebar -->
  <aside class="relative w-56 shrink-0 border-r border-forest-200 bg-white dark:border-forest-800 dark:bg-forest-900">
    <div class="p-4">
      <a href="/" class="flex items-center gap-2 text-base font-bold text-forest-700 dark:text-forest-300">
        <span aria-hidden="true">🌲</span>
        Applicatie Hub
      </a>
    </div>

    <nav class="mt-2 px-2">
      <ul class="space-y-1 text-sm">
        <li>
          <a
            href="/admin"
            class="block rounded-md px-3 py-2 font-medium text-stone-700 hover:bg-forest-50 dark:text-stone-200 dark:hover:bg-forest-800"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="/admin/apps"
            class="block rounded-md px-3 py-2 text-stone-600 hover:bg-forest-50 dark:text-stone-300 dark:hover:bg-forest-800"
          >
            Applicaties
          </a>
        </li>
        <li>
          <a
            href="/admin/pages"
            class="block rounded-md px-3 py-2 text-stone-600 hover:bg-forest-50 dark:text-stone-300 dark:hover:bg-forest-800"
          >
            Pagina's
          </a>
        </li>
        <li>
          <a
            href="/admin/menu"
            class="block rounded-md px-3 py-2 text-stone-600 hover:bg-forest-50 dark:text-stone-300 dark:hover:bg-forest-800"
          >
            Menu
          </a>
        </li>
        <li>
          <a
            href="/admin/media"
            class="block rounded-md px-3 py-2 text-stone-600 hover:bg-forest-50 dark:text-stone-300 dark:hover:bg-forest-800"
          >
            Media
          </a>
        </li>
      </ul>
    </nav>

    <div class="absolute bottom-0 w-56 border-t border-forest-200 p-4 dark:border-forest-800">
      <p class="mb-1 text-xs text-stone-400">{data.user.name}</p>
      <div class="flex items-center justify-between">
        <form method="post" action="/auth/logout">
          <button
            type="submit"
            class="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          >
            Uitloggen
          </button>
        </form>
        <button
          onclick={toggleDark}
          aria-label={dark ? 'Schakel naar licht modus' : 'Schakel naar donker modus'}
          class="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:text-stone-500 dark:hover:bg-forest-800 dark:hover:text-stone-300"
        >
          {#if dark}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          {:else}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </aside>

  <!-- Main content -->
  <div class="flex-1 bg-stone-50 dark:bg-forest-950">
    {@render children()}
  </div>
</div>
