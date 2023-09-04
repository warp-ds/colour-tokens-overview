<!-- src/Router.svelte -->
<script>
  import { Router, Route, Link, navigate } from "svelte-routing";
  import Colours from "./pages/Colours.svelte";
  import Contrast from "./pages/Contrast.svelte";
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";

  // Use has
  let currentHash = window.location.hash.slice(1); // Remove the '#' at the start

  // Update currentHash when hash changes
  function hashChangeHandler() {
    currentHash = window.location.hash.slice(1);
    if (currentHash === "/colour-tokens-overview/") {
      window.location.hash = "/colour-tokens-overview/colours.html";
    }
  }

  //  Attach the event listener
  onMount(() => {
    window.addEventListener("hashchange", hashChangeHandler, false);
    if (window.location.hash === "") {
      window.location.hash = "#/colour-tokens-overview/colours.html";
    }
  });

  // Clean up the event listener
  onDestroy(() => {
    window.removeEventListener("hashchange", hashChangeHandler, false);
  });
</script>

<!-- Nav bar -->
<Router>
  <nav class="p-8 s-bg-subtle">
    <a
      class="p-8 hover:s-bg-hover active:s-bg-selected"
      href="#/colour-tokens-overview/colours.html">Colours in WARP</a>
    <a
      class="p-8 hover:s-bg-hover active:s-bg-selected"
      href="#/colour-tokens-overview/contrast.html">Contrast</a>
  </nav>
  <Route path={currentHash}>
    {#if currentHash === "/colour-tokens-overview/colours.html"}
      <Colours />
    {:else if currentHash === "/colour-tokens-overview/contrast.html"}
      <Contrast />
    {/if}
  </Route>
</Router>

<style>
</style>
