<script lang="ts">
  import AppCard from '$components/AppCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Applicatie Hub</title>
  <meta name="description" content="Een overzicht van alle beschikbare applicaties." />
</svelte:head>

<!-- ─── Hero ─── -->
<section
  class="relative overflow-hidden"
  style="background: linear-gradient(to bottom, #A9DFBA 0%, #27AE60 40%, #1E8449 75%, #145A32 100%);"
>
  <!-- Content row -->
  <div class="relative z-10 mx-auto max-w-7xl px-6 pb-56 pt-16 lg:flex lg:items-center lg:gap-8 lg:pb-60 lg:pt-20">

    <!-- Left: text -->
    <div class="lg:flex-1">
      <!-- Tag pill -->
      <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
        <span aria-hidden="true">🌿</span>
        <span>Jouw digitale werkruimte</span>
      </div>

      <h1 class="text-5xl font-bold tracking-tight text-white drop-shadow sm:text-6xl lg:text-7xl">
        Applicatie Hub
      </h1>

      <p class="mt-4 max-w-md text-lg text-white/85">
        Alles wat je nodig hebt, op één plek.
      </p>

      {#if data.apps.length > 0}
        <p class="mt-3 text-sm font-medium text-white/60">
          {data.apps.length}
          {data.apps.length === 1 ? 'applicatie' : 'applicaties'} beschikbaar
        </p>
      {/if}
    </div>

    <!-- Right: mascot scene (lg and up) -->
    <div class="relative hidden lg:block lg:w-80 lg:flex-none">
      <!-- Bear mascot -->
      <span
        class="block select-none text-center leading-none"
        style="font-size: 180px; filter: drop-shadow(0 16px 32px rgba(0,0,0,0.25));"
        aria-hidden="true"
      >🐻</span>

      <!-- Decorative accent animals & plants -->
      <span class="absolute -top-6 left-4 select-none text-5xl" aria-hidden="true">🐦</span>
      <span class="absolute right-2 top-10 select-none text-3xl" aria-hidden="true">🦋</span>
      <span class="absolute bottom-12 left-0 select-none text-4xl" aria-hidden="true">🌸</span>
      <span class="absolute bottom-8 right-6 select-none text-3xl" aria-hidden="true">🌺</span>
      <span class="absolute -top-2 right-16 select-none text-2xl" aria-hidden="true">🍃</span>
    </div>
  </div>

  <!-- ─── Fixed-height tree silhouette — two depth layers ─── -->
  <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-48" aria-hidden="true">
    <svg
      class="h-full w-full"
      viewBox="0 0 1440 192"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <!-- Layer 1: distant trees — medium green, airy -->
      <g fill="#1E8449" fill-opacity="0.55">
        <polygon points="0,192 55,110 110,192"/>
        <polygon points="130,192 195,95 260,192"/>
        <polygon points="290,192 355,105 420,192"/>
        <polygon points="450,192 515,98 580,192"/>
        <polygon points="610,192 675,100 740,192"/>
        <polygon points="770,192 835,95 900,192"/>
        <polygon points="930,192 995,102 1060,192"/>
        <polygon points="1090,192 1155,96 1220,192"/>
        <polygon points="1250,192 1315,108 1380,192"/>
        <polygon points="1390,192 1415,115 1440,192"/>
      </g>

      <!-- Layer 2: foreground trees — dark, full depth -->
      <g fill="#0B2E22">
        <polygon points="0,192 65,45 130,192"/>
        <polygon points="15,155 65,18 115,155"/>
        <polygon points="185,192 270,38 355,192"/>
        <polygon points="200,155 270,12 340,155"/>
        <polygon points="410,192 500,40 590,192"/>
        <polygon points="425,155 500,14 575,155"/>
        <polygon points="640,192 730,35 820,192"/>
        <polygon points="655,155 730,8 805,155"/>
        <polygon points="870,192 960,42 1050,192"/>
        <polygon points="885,155 960,15 1035,155"/>
        <polygon points="1100,192 1190,38 1280,192"/>
        <polygon points="1115,155 1190,12 1265,155"/>
        <polygon points="1320,192 1400,48 1440,192"/>
        <rect x="0" y="189" width="1440" height="3"/>
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
