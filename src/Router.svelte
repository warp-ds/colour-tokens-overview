<!-- src/Router.svelte -->
<script>
  import { Router, Route, Link, navigate } from "svelte-routing";
  import Colours from "./pages/Colours.svelte";
  import Contrast from "./pages/Contrast.svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // store currently active tab
  const activeRoute = writable("");

  // Redirect to colours
  onMount(() => {
    if (window.location.pathname === "/colour-tokens-overview/") {
      navigate("/colour-tokens-overview/colours.html");
    }
  });
</script>

<!-- Nav bar -->
<Router>
  <nav class="p-8 s-bg-subtle">
    <span
      class={$activeRoute === "/colour-tokens-overview/colours" ? "active" : ""}
    >
      <Link
      class="p-8 hover:s-bg-hover active:s-bg-selected"
        to="/colour-tokens-overview/colours.html">Colours in WARP</Link
      >
    </span>
    <span
      class={$activeRoute === "/colour-tokens-overview/contrast"
        ? "active"
        : ""}
    >
      <Link
        class="p-8 hover:s-bg-hover active:s-bg-selected"
        to="/colour-tokens-overview/contrast.html">Contrast</Link
      >
    </span>
  </nav>

  <!-- Set activeRoute -->

  <Route path="/colour-tokens-overview/colours.html">
    <svelte:component this={Colours} />
    {#if $activeRoute !== "/colour-tokens-overview/colours.html"}
      {($activeRoute = "/colour-tokens-overview/colours.html")}
    {/if}
  </Route>

  <Route path="/colour-tokens-overview/contrast.html">
    <svelte:component this={Contrast} />
    {#if $activeRoute !== "/colour-tokens-overview/contrast.html"}
      {($activeRoute = "/colour-tokens-overview/contrast.html")}
    {/if}
  </Route>
</Router>

<style>
  span.active {
    background-color: var(--w-s-color-background-selected);
  }
</style>
