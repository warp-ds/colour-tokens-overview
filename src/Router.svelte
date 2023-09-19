<!-- src/Router.svelte -->
<script>
  import Colours from "./pages/Colours.svelte";
  import Contrast from "./pages/Contrast.svelte";
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
    class:selected_page={currentRoute === '/contrast.html'}
    href="#/contrast.html">Contrast</a
  >

</nav>


{#if currentRoute === "/colours.html"}
  <Colours />
{:else if currentRoute === "/contrast.html"}
  <Contrast />
{:else}
  <NotFound />
{/if}

<style>
  .selected_page {
    background-color: var(--w-s-color-background-active);
    font-weight: bold;
  }
</style>
