<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { onMount } from 'svelte';

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

<div class="flex min-h-screen flex-col">
  <header class="border-b border-forest-200 bg-white shadow-sm dark:border-forest-800 dark:bg-forest-900">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <a href="/" class="flex items-center gap-2 text-xl font-bold text-forest-700 dark:text-forest-300">
        <span aria-hidden="true">🌲</span>
        Applicatie Hub
      </a>

      <div class="flex items-center gap-1">
        <!-- Dynamic menu items -->
        {#each data.menuItems as item (item.id)}
          <a
            href={item.href}
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noopener noreferrer' : undefined}
            class="rounded-md px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-forest-800 dark:hover:text-stone-100"
          >
            {item.label}
          </a>
        {/each}

        <!-- Dark mode toggle -->
        <button
          onclick={toggleDark}
          aria-label={dark ? 'Schakel naar licht modus' : 'Schakel naar donker modus'}
          class="ml-1 rounded-md p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-forest-800 dark:hover:text-stone-200"
        >
          {#if dark}
            <!-- Sun icon -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
            <!-- Moon icon -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          {/if}
        </button>

        <!-- Auth actions -->
        {#if data.user}
          {#if data.menuItems.length > 0}
            <span class="ml-1 text-stone-300 dark:text-stone-600">|</span>
          {/if}
          <span class="px-2 text-sm text-stone-600 dark:text-stone-300">{data.user.name}</span>
          <a
            href="/admin"
            class="rounded-md bg-forest-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-forest-700"
          >
            Beheer
          </a>
          <form method="post" action="/auth/logout" class="ml-1">
            <button
              type="submit"
              class="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
            >
              Uitloggen
            </button>
          </form>
        {:else if data.menuSettings.showLoginLink}
          <a
            href="/auth/login"
            class="ml-1 rounded-md border border-forest-300 px-3 py-1.5 text-sm font-medium text-forest-700 hover:bg-forest-50 dark:border-forest-600 dark:text-forest-300 dark:hover:bg-forest-800"
          >
            Inloggen
          </a>
        {/if}
      </div>
    </nav>
  </header>

  <main class="flex-1">
    {@render children()}
  </main>

  <footer class="border-t border-forest-200 bg-white py-6 dark:border-forest-800 dark:bg-forest-900">
    <p class="text-center text-sm text-stone-400 dark:text-stone-500">
      Applicatie Hub &copy; {new Date().getFullYear()}
    </p>
  </footer>
</div>
