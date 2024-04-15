<script>
  import { onMount } from "svelte";

  // tracking
  onMount(() => {
    const script = document.createElement("script");
    script.src = "//zgo.at/count.js";
    script.async = true;
    script.dataset.goatcounter = "https://warp.goatcounter.com/count";
    script.dataset.goatcounterSettings = JSON.stringify({ path: "/colours" });

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  });

  import "@warp-ds/elements";
  import { get } from "svelte/store";
  import jsyaml from "js-yaml";
  import { slide, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  // Get data from dataStore
  import {
    dataFetched,
    dataProcessed,
    fetchTokens,
    allTokens,
    allColors,
    tokenColorMapping,
  } from "../lib/dataStore.js";

  let filteredTokens = [];
  let filteredColors = [];

  // If data hasn't been processed, make sure it is fetched and processed
  $: if (!get(dataProcessed)) {
    // console.log("data not processed yet");

    // if data hasn't been fetched, fetch it
    if (!get(dataFetched)) {
      // console.log("data not fetched. Fetching data");
      fetchTokens();
    } else {
      console.log("waiting for data to be processed. This is an issue");
    }
  } else {
    // console.log("setting filtered data");

    filteredTokens = $allTokens;
    filteredColors = $allColors;

    // console.log("Token-Color Mapping:", $tokenColorMapping);
    // console.log("All Tokens:", $allTokens);
  }

  // Handle selected state
  let selectedColorOrToken = null;

  // Clicking a color, filter
  function colorClicked(color) {
    // If the selected color is clicked again, reset the filters
    if (selectedColorOrToken === color) {
      resetFilter();
      return;
    }

    selectedColorOrToken = color;

    // Get all tokens that reference this color
    filteredTokens = $allTokens.filter((token) => {
      return $tokenColorMapping[token.name] === color.name;
      // token.name is for example bluegray-600
    });

    // Only show the clicked color in the colors list
    filteredColors = [color];
  }

  // Clicking a token, filter
  function tokenClicked(token) {
    selectedColorOrToken = token;

    // Get the color associated with this token
    const associatedColorName = $tokenColorMapping[token.name];
    filteredColors = $allColors.filter((color) => {
      return color.name === associatedColorName;
    });

    // Only show the clicked token in the tokens list
    filteredTokens = [token];
  }

  // when resetting filters
  function resetFilter() {
    selectedColorOrToken = null;
    filteredTokens = $allTokens;
    filteredColors = $allColors;
  }
</script>

<main>
  <h1 class="my-32 text-l">Colours in WARP</h1>

  <w-alert class="my-24" variant="warning" show="">
    <p class="font-bold">Use colour classes with purpose</p>
    <p>
      For example, a "-hover" class should only be used for hover states. If you
      can't find a relevant class, ask your designer if the colour should be
      changed, or reach out to the Warp team on Slack:
      <a href="https://sch-chat.slack.com/archives/C04P0GYTHPV"
        >#nmp-warp-design-system</a
      >.
    </p>
  </w-alert>

  <p>
    Click a colour to see which semantic classes refer to that colour. The
    number next to the colour indicates how many semantic classes refer to that
    colour. Currently this page only includes the FINN light theme.
  </p>

  <div style="height: 60px;" class="my-16">
    <w-button
      role="button"
      tabindex="0"
      on:click={() => resetFilter()}
      on:keydown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault(); // Prevents the default action (scrolling when space is pressed)
          resetFilter();
        }
      }}
      class={selectedColorOrToken ? "" : "hidden"}
      variant="primary">Reset</w-button
    >
  </div>
  <div class="grid my-24 gap-24 grid-cols-1 md:grid-cols-2">
    <!-- Column with Primitive colours -->
    <div>
      <h2 class="text-m">Colour</h2>

      <!-- Display a loading message if filteredColors is empty -->
      {#if filteredColors.length === 0}
        <p>No match</p>
      {:else}
        <!-- Iterate through filteredColors and display each one -->
        {#each filteredColors as color (color.name)}
          <div
            role="button"
            tabindex="0"
            aria-label={`Select color ${color.name}`}
            on:click={() => colorClicked(color)}
            on:keydown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault(); // Prevents the default action (scrolling when space is pressed)
                colorClicked(color);
              }
            }}
            class="tokenitem flex items-center my-8 border s-border-default rounded-8"
            transition:slide={{
              delay: 250,
              duration: 300,
              easing: quintOut,
              axis: "y",
            }}
          >
            <div
              class="colordot w-16 h-32 mr-8"
              style="background-color: {color.value};"
            />
            <div>{color.name}</div>
            <div class="grow text-right mx-8">{color.count}</div>
          </div>
        {/each}
      {/if}
    </div>
    <!-- Column Semantic tokens -->
    <div>
      <h2 class="text-m">Semantic classes</h2>

      <!-- Display a loading message if filteredTokens is empty -->
      {#if filteredTokens.length === 0}
        <p>No match</p>
      {:else}
        <!-- Iterate through filteredTokens and display each one -->
        {#each filteredTokens as token (token.name)}
          <div
            class="flex items-center my-8"
            transition:slide={{
              delay: 250,
              duration: 300,
              easing: quintOut,
              axis: "y",
            }}
          >
            <div
              class="colordot w-16 h-16 rounded-8 border mr-8"
              style="background-color: {token.value};"
            />
            {token.name}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</main>

<style>
  body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  main {
    padding: 16px;
    margin: auto;
    max-width: 700px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .tokenitem {
    background-color: var(--w-s-color-background-default);
    overflow: hidden;
  }

  .tokenitem:hover {
    background-color: var(--w-s-color-background-hover);
    border-color: var(--w-s-color-border-hover);
    cursor: pointer;
  }

  .colordot {
    background-color: white;
    border-color: var(--w-s-color-border-default);
  }

  .hidden {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
  }

  a {
    text-decoration: underline;
    text-decoration-style: dotted;
  }
</style>
