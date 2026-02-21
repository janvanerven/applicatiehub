<script lang="ts">
  import AppCard from '$components/AppCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Applicatie Hub</title>
  <meta name="description" content="Een overzicht van alle beschikbare applicaties." />
</svelte:head>

<!-- ─── Nordic Forest Hero ─── -->
<section
  class="relative overflow-hidden bg-gradient-to-b from-forest-900 via-forest-800 to-forest-700 dark:from-slate-950 dark:via-forest-950 dark:to-forest-900"
>
  <!-- Atmospheric glow orbs -->
  <div class="pointer-events-none absolute inset-0" aria-hidden="true">
    <div class="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-mist-400/10 blur-3xl"></div>
    <div class="absolute right-1/4 top-16 h-56 w-56 rounded-full bg-forest-300/10 blur-2xl"></div>
    <div
      class="absolute left-1/2 bottom-28 h-40 w-40 -translate-x-1/2 rounded-full bg-mist-300/15 blur-2xl"
    ></div>
  </div>

  <!-- Hero content -->
  <div class="relative mx-auto max-w-4xl px-4 pb-44 pt-20 text-center">
    <!-- Badge pill -->
    <div
      class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm"
    >
      <span class="text-base" aria-hidden="true">🌲</span>
      <span>Jouw digitale werkruimte</span>
    </div>

    <h1 class="text-6xl font-black tracking-tight text-white drop-shadow-lg sm:text-8xl">
      Applicatie Hub
    </h1>

    <p class="mx-auto mt-5 max-w-xl text-lg font-semibold text-forest-100/80">
      Alles wat je nodig hebt, op één plek.
    </p>

    {#if data.apps.length > 0}
      <p class="mt-2 text-sm text-forest-200/50">
        {data.apps.length}
        {data.apps.length === 1 ? 'applicatie' : 'applicaties'} beschikbaar
      </p>
    {/if}
  </div>

  <!-- ─── Pine forest silhouette (3 depth layers) ─── -->
  <div class="pointer-events-none absolute bottom-0 left-0 right-0" aria-hidden="true">
    <svg
      viewBox="0 0 1440 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      class="w-full"
    >
      <!-- Layer 1: distant misty trees -->
      <g style="fill: currentColor" class="text-forest-950/25 dark:text-mist-300/10">
        <polygon points="40,200 80,148 120,200" />
        <polygon points="110,200 160,132 210,200" />
        <polygon points="250,200 290,145 330,200" />
        <polygon points="380,200 425,135 470,200" />
        <polygon points="510,200 560,140 610,200" />
        <polygon points="650,200 700,132 750,200" />
        <polygon points="790,200 840,142 890,200" />
        <polygon points="930,200 980,135 1030,200" />
        <polygon points="1070,200 1120,140 1170,200" />
        <polygon points="1210,200 1265,132 1320,200" />
        <polygon points="1360,200 1400,145 1440,200" />
      </g>

      <!-- Layer 2: mid-distance double-tier trees -->
      <g style="fill: currentColor" class="text-forest-950/55 dark:text-forest-500/35">
        <polygon points="20,200 75,90 130,200" />
        <polygon points="42,155 75,58 108,155" />
        <polygon points="230,200 295,80 360,200" />
        <polygon points="253,155 295,48 337,155" />
        <polygon points="460,200 525,85 590,200" />
        <polygon points="483,155 525,52 567,155" />
        <polygon points="680,200 745,78 810,200" />
        <polygon points="703,155 745,46 787,155" />
        <polygon points="910,200 975,82 1040,200" />
        <polygon points="933,155 975,50 1017,155" />
        <polygon points="1130,200 1200,78 1270,200" />
        <polygon points="1154,155 1200,45 1246,155" />
        <polygon points="1340,200 1400,88 1440,200" />
        <polygon points="1363,156 1400,56 1437,156" />
      </g>

      <!-- Layer 3: foreground large triple-tier trees -->
      <g style="fill: currentColor" class="text-forest-950 dark:text-forest-800">
        <polygon points="0,200 55,45 110,200" />
        <polygon points="18,158 55,18 92,158" />
        <polygon points="30,112 55,2 80,112" />
        <polygon points="170,200 250,38 330,200" />
        <polygon points="192,158 250,10 308,158" />
        <polygon points="210,110 250,0 290,110" />
        <polygon points="410,200 500,42 590,200" />
        <polygon points="432,158 500,14 568,158" />
        <polygon points="450,112 500,2 550,112" />
        <polygon points="650,200 740,35 830,200" />
        <polygon points="672,158 740,8 808,158" />
        <polygon points="692,110 740,0 788,110" />
        <polygon points="890,200 980,42 1070,200" />
        <polygon points="912,158 980,14 1048,158" />
        <polygon points="930,112 980,2 1030,112" />
        <polygon points="1120,200 1210,38 1300,200" />
        <polygon points="1142,158 1210,10 1278,158" />
        <polygon points="1160,110 1210,0 1260,110" />
        <polygon points="1340,200 1420,48 1500,200" />
        <polygon points="1362,158 1420,20 1478,158" />
        <rect x="0" y="197" width="1440" height="3" />
      </g>
    </svg>
  </div>
</section>

<!-- ─── Apps section ─── -->
<section class="bg-stone-50 dark:bg-forest-950">
  <div class="mx-auto max-w-7xl px-4 py-16">
    {#if data.apps.length === 0}
      <div
        class="rounded-3xl border-2 border-dashed border-forest-200 p-20 text-center dark:border-forest-800"
      >
        <p class="text-5xl" aria-hidden="true">🌱</p>
        <p class="mt-4 font-semibold text-stone-400 dark:text-stone-500">
          Nog geen applicaties toegevoegd.
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.apps as app (app.id)}
          <AppCard {app} />
        {/each}
      </div>
    {/if}
  </div>
</section>
