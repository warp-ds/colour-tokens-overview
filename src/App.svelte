<script>
  import "@warp-ds/elements";
  import { onMount } from "svelte";
  import jsyaml from "js-yaml";

  // Declare reactive variables to hold the parsed data
  let colors = null;
  let tokens = null;

  // Read the data from YAML files online
  onMount(async () => {
    // Fetch and parse the colors YAML
    const colorsResponse = await fetch(
      "https://raw.githubusercontent.com/warp-ds/css/alpha/tokens/finn.no/colors.yml"
    );
    const colorsYaml = await colorsResponse.text();
    colors = jsyaml.load(colorsYaml);

    // Fetch and parse the tokens YAML
    const tokensResponse = await fetch(
      "https://raw.githubusercontent.com/warp-ds/css/alpha/tokens/finn.no/semantic.yml"
    );
    const tokensYaml = await tokensResponse.text();
    tokens = jsyaml.load(tokensYaml);
  });

  // Extract colour values
  function getColorForToken(token) {
    if (typeof token !== 'string') {
        console.warn('Received non-string token:', token);
        return null;
    }

    if (!token || !colors) return null;

    let parts = token.split("-");
    let colorName = parts[0];

    // Direct color value
    if (colors[colorName] && typeof colors[colorName] === "string") {
      return colors[colorName];
    }

    // Color shades
    if (parts.length === 1) {
      return colors[colorName] && colors[colorName]._
        ? colors[colorName]._
        : null;
    }

    let shade = parts[1];

    // Basic shades
    if (colors[colorName] && typeof colors[colorName][shade] === "string") {
      return colors[colorName][shade];
    }

    // Complex shades with variants
    if (parts.length === 3 && colors[colorName] && colors[colorName][shade]) {
      let variant = parts[2];
      return colors[colorName][shade][variant] || null;
    }

    return null;
  }

  // Recursively process all the tokens, no matter how deeply nested they are
  function computeColorsForTokens(tokenObj) {
    let computed = {};

    for (let key in tokenObj) {
      if (typeof tokenObj[key] === 'string') {
        computed[key] = getColorForToken(tokenObj[key]);
      } else if (typeof tokenObj[key] === 'object') {
        computed[key] = computeColorsForTokens(tokenObj[key]);  // Recursively compute colors for nested objects
      }
    }

    return computed;
  }


  let computedTokens = {};


  // Compute the actual color values for your semantic tokens
  $: if (tokens && colors) {
    computedTokens = computeColorsForTokens(tokens.s.color);

    // Console log
    console.log(tokens),
    console.log(colors),
    console.log(computedTokens)
  }


  // OLD

  const components = ["Alert", "Avatar", "Badge", "Box"];
</script>

<main>
  <h1 class="my-8 text-l">WARP components and tokens</h1>

  <div class="grid my-24 gap-24 grid-cols-1 md:grid-cols-4">
    <div class="flex-initial">
      <h2 class="text-m">Components</h2>
      {#each components as component}
        <div
          class="tokenitem flex items-center my-8 border s-border-default rounded-8"
        >
          <div class="colordot w-16 h-16 m-8 rounded-8" />
          {component}
        </div>
      {/each}
    </div>
    <div class="s-bg-positive-default">
      {#if tokens}
        <div>
          <h2>Tokens:</h2>
          <pre>{JSON.stringify(tokens, null, 2)}</pre>
        </div>
      {:else}
        <p>Loading...</p>
      {/if}
    </div>
    <div>
      {#if colors}
        <div>
          <h2>Colors:</h2>
          <pre>{JSON.stringify(colors, null, 2)}</pre>
        </div>
      {:else}
        <p>Loading...</p>
      {/if}
    </div>
    <div>
      {#if colors && tokens}
        <div>
          <h2>Computed Tokens:</h2>
          <pre>{JSON.stringify(computedTokens, null, 2)}</pre>
        </div>
      {:else}
        <p>Loading...</p>
      {/if}
    </div>
  </div>
</main>

<style>
  main {
    padding: 16px;
    margin: auto;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
  }

  .tokenitem {
    background-color: var(--w-s-color-background-default);
  }

  .tokenitem:hover {
    background-color: var(--w-s-color-background-hover);
    border-color: var(--w-s-color-border-hover);
  }

  .colordot {
    background-color: blue;
  }
</style>
