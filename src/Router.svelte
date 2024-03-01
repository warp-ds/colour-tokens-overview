<!-- src/Router.svelte -->
<script>
  import Colours from "./pages/Colours.svelte";
  import Contrast from "./pages/textContrast.svelte";
  import Apca from "./pages/graphicsContrast.svelte";
  import NotFound from "./pages/NotFound.svelte"; // A new 404 page component
  import { onMount, onDestroy } from "svelte";

  // Store what is current route / page
  let currentRoute = "";

  // When user navigates to a different hash route
  function updateRoute() {
    const hash =
      window.location.hash.slice(1) || "/colours.html";
    currentRoute = hash;
  }

  //  Listen to changes in URL
  onMount(() => {
    window.addEventListener("hashchange", updateRoute, false);
    updateRoute(); // Initialize the route
  });

  // Clean up the event listener
  onDestroy(() => {
    window.removeEventListener("hashchange", updateRoute, false);
  });
</script>

<nav class="p-16">
  <a
    class="p-8 rounded-4"
    class:selected_page={currentRoute === '/colours.html'}
    href="#/colours.html">Colours in WARP</a
  >
  <a
  class="p-8 rounded-4"
    class:selected_page={currentRoute === '/textcontrast.html'}
    href="#/textcontrast.html">Text contrast</a
  >
  <a
  class="p-8 rounded-4"
    class:selected_page={currentRoute === '/graphicscontrast.html'}
    href="#/graphicscontrast.html">Non-text contrast</a
  >

</nav>


{#if currentRoute === "/colours.html"}
  <Colours />
{:else if currentRoute === "/textcontrast.html"}
  <Contrast />

  {:else if currentRoute === "/graphicscontrast.html"}
  <Apca />
{:else}
  <NotFound />
{/if}

<style>
  .selected_page {
    background-color: var(--w-s-color-background-active);
    font-weight: bold;
  }
</style>
