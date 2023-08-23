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

    // console.log("colors:");
    // console.log(typeof colors);
    // console.log(colors);
    // console.log("tokens:");
    // console.log(typeof tokens);
    // console.log(tokens);
  });

  let allTokens = [];
  let allColors = [];
  let tokenColorMapping = {};

  // Function to get the hex code for a primitive token
  function getColorForToken(token) {
    const parts = token.split("-");
    if (parts.length === 2) {
      const colorName = parts[0];
      const shade = parts[1];
      if (colors[colorName] && colors[colorName][shade]) {
        return colors[colorName][shade];
      }
    } else if (parts.length === 3) {
      const colorName = parts[0];
      const shade = parts[1];
      const variant = parts[2];
      if (
        colors[colorName] &&
        colors[colorName][shade] &&
        colors[colorName][shade][variant]
      ) {
        return colors[colorName][shade][variant];
      }
    }
    return null; // or return some default color if desired
  }

  // Function to flatten the semantic tokens
  function flattenTokens(prefix, tokenObj) {
    for (let key in tokenObj) {
      if (typeof tokenObj[key] === "string") {
        let fullTokenName = prefix ? `s-color-${prefix}-${key}` : key;

        // Remove trailing "-_"
        if (fullTokenName.endsWith("-_")) {
          fullTokenName = fullTokenName.substring(0, fullTokenName.length - 2);
        }

        const hexColor = getColorForToken(tokenObj[key]);

        allTokens = [
          ...allTokens,
          {
            name: fullTokenName,
            value: hexColor,
          },
        ];
    
        tokenColorMapping[fullTokenName] = tokenObj[key];
      } else if (typeof tokenObj[key] === "object") {
        flattenTokens(prefix ? `${prefix}-${key}` : key, tokenObj[key]);
      }
    }
  }

  // Utility to remove '-_' suffix if present
  function cleanColorName(name) {
    return name.endsWith("-_") ? name.slice(0, -2) : name;
  }

  // Function to populate allColors array
  function populateColors(colorObj) {
    for (let key in colorObj) {
      // Exclude unwanted colors
      if (["token", "transparent", "inherit", "none"].includes(key)) continue;

      if (typeof colorObj[key] === "string") {
        allColors = [
          ...allColors,
          {
            name: cleanColorName(key),
            value: colorObj[key],
          },
        ];
      } else if (typeof colorObj[key] === "object") {
        for (let shade in colorObj[key]) {
          if (typeof colorObj[key][shade] === "string") {
            allColors = [
              ...allColors,
              {
                name: cleanColorName(`${key}-${shade}`),
                value: colorObj[key][shade],
              },
            ];
          } else {
            // Handle nested shades if necessary
            for (let variant in colorObj[key][shade]) {
              allColors = [
                ...allColors,
                {
                  name: cleanColorName(`${key}-${shade}-${variant}`),
                  value: colorObj[key][shade][variant],
                },
              ];
            }
          }
        }
      }
    }
  }

  // When data is loaded, flatten and put into arrays
  $: if (tokens && colors) {
    flattenTokens("", tokens.s.color);
    populateColors(colors);
    filteredTokens = allTokens;
    filteredColors = allColors;
    // log
    // console.log("allTokens:");
    // console.log(allTokens);
    // console.log("allColors:");
    // console.log(allColors);
    // console.log("tokenColorMapping:");
    // console.log(tokenColorMapping);
  }

  // Handle selected state
  let selectedColorOrToken = null;

  let filteredTokens = allTokens;
  let filteredColors = allColors;

  // Clicking a color, filter
  function colorClicked(color) {
    selectedColorOrToken = color;

    console.log("selected color:", color);
    console.log(color);

    // Get all tokens that reference this color
    filteredTokens = allTokens.filter((token) => {
      return tokenColorMapping[token.name] === color.name;
      // token.name is for example bluegray-600
    });

    // Only show the clicked color in the colors list
    filteredColors = [color];
  }

  // Clicking a token, filter
  function tokenClicked(token) {
    selectedColorOrToken = token;

    console.log("selected token:", token);
    console.log(token);

    // Get the color associated with this token
    const associatedColorName = tokenColorMapping[token.name];
    filteredColors = allColors.filter((color) => {
      return color.name === associatedColorName;
    });

    // Only show the clicked token in the tokens list
    filteredTokens = [token];
  }

  // when resetting filters
  function resetFilter() {
    selectedColorOrToken = null;
    filteredTokens = allTokens;
    filteredColors = allColors;
  }
</script>

<main>
  <h1 class="my-8 text-l">Elastic List of Design Tokens</h1>

  <div style="height: 100px;" class="my-24">
    <w-button
      on:click={() => resetFilter()}
      class={selectedColorOrToken ? "" : "hidden"}
      variant="primary">Reset filter</w-button
    >
  </div>

  <div class="grid my-24 gap-24 grid-cols-1 md:grid-cols-2">
    <!-- First column with Semantic tokens -->
    <div>
      <h2 class="text-m">Semantic tokens</h2>

      <!-- Display a loading message if filteredTokens is empty -->
      {#if filteredTokens.length === 0}
        <p>No match</p>
      {:else}
        <!-- Iterate through filteredTokens and display each one -->
        {#each filteredTokens as token}
          <div
            on:click={() => tokenClicked(token)}
            class="tokenitem flex items-center my-8 border s-border-default rounded-8"
          >
            <div
              class="colordot w-16 h-32 mr-8"
              style="background-color: {token.value};"
            />
            {token.name}
          </div>
        {/each}
      {/if}
    </div>
    <!-- Second column with Primitive colours -->
    <div>
      <h2 class="text-m">Colour</h2>

      <!-- Display a loading message if filteredColors is empty -->
      {#if filteredColors.length === 0}
        <p>No match</p>
      {:else}
        <!-- Iterate through filteredColors and display each one -->
        {#each filteredColors as color}
          <div
            on:click={() => colorClicked(color)}
            class="tokenitem flex items-center my-8 border s-border-default rounded-8"
          >
            <div
              class="colordot w-16 h-32 mr-8"
              style="background-color: {color.value};"
            />
            {color.name}
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
    max-width: 1400px;
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
</style>
