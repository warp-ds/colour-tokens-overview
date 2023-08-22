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

  let allTokens = [];
  let allColors = [];
  let tokenColorMapping = {};

  // Function to flatten the semantic tokens
  function flattenTokens(prefix, tokenObj) {
    for (let key in tokenObj) {
      if (typeof tokenObj[key] === "string") {
        let fullTokenName = prefix ? `${prefix}-${key}` : key;

        // Remove trailing "-_"
        if (fullTokenName.endsWith("-_")) {
          fullTokenName = fullTokenName.substring(0, fullTokenName.length - 2);
        }

        allTokens.push(fullTokenName);
        tokenColorMapping[fullTokenName] = tokenObj[key];
      } else if (typeof tokenObj[key] === "object") {
        flattenTokens(prefix ? `${prefix}-${key}` : key, tokenObj[key]);
      }
    }
  }

  // Function to
  function populateColors(colorObj) {
    for (let key in colorObj) {
      if (typeof colorObj[key] === "string") {
        allColors.push({ name: key, value: colorObj[key] });
      } else if (typeof colorObj[key] === "object") {
        for (let shade in colorObj[key]) {
          if (typeof colorObj[key][shade] === "string") {
            allColors.push({
              name: `${key}-${shade}`,
              value: colorObj[key][shade],
            });
          } else {
            // Handle nested shades if necessary
            for (let variant in colorObj[key][shade]) {
              allColors.push({
                name: `${key}-${shade}-${variant}`,
                value: colorObj[key][shade][variant],
              });
            }
          }
        }
      }
    }
  }

  // When data is loaded, flatten and put into
  $: if (tokens && colors) {
    flattenTokens("", tokens.s.color);
    populateColors(colors);
    // log
    console.log(tokenColorMapping);
  }

  // OLD can soon be deleted
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
      <h2 class="text-m">Components</h2>
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
      <h2 class="text-m">Components</h2>
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
      <h2 class="text-m">Components</h2>
      {#if tokenColorMapping}
        <div>
          <h2>Mapping:</h2>
          <pre>{JSON.stringify(tokenColorMapping, null, 2)}</pre>
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
