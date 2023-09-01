<script>
  import "@warp-ds/elements";
  import { onMount } from "svelte";
  import jsyaml from "js-yaml";
  import { slide, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  // Declare reactive variables to hold the parsed data
  let colors = null;
  let tokens = null;

  // Read the data from YAML files online
  onMount(async () => {
    // Fetch and parse the colors YAML
    const colorsResponse = await fetch(
      "https://raw.githubusercontent.com/warp-ds/css/next/tokens/finn.no/colors.yml"
    );
    const colorsYaml = await colorsResponse.text();
    colors = jsyaml.load(colorsYaml);

    // Fetch and parse the tokens YAML
    const tokensResponse = await fetch(
      "https://raw.githubusercontent.com/warp-ds/css/next/tokens/finn.no/semantic.yml"
    );
    const tokensYaml = await tokensResponse.text();
    tokens = jsyaml.load(tokensYaml);

    // console.log(colors);
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
        let fullTokenName = prefix
          ? `s-${prefix.replace("background", "bg")}-${key}`
          : `s-${key}`;

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
            count: 0, // default value
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
                count: 0, // default value
              },
            ];
          } else {
            // Handle nested shades if necessary
            // Only store the value associated with the '_' key
            if (colorObj[key][shade]["_"]) {
              allColors = [
                ...allColors,
                {
                  name: cleanColorName(`${key}-${shade}`),
                  value: colorObj[key][shade]["_"],
                  count: 0, // default value
                },
              ];
            }
          }
        }
      }
    }
    // when the colours are in place, count how many times they are used by semantic tokens
    allColors.forEach((color) => {
      color.count = countTokensForColor(color.name);
    });
  }

  // When data is loaded, flatten and put into arrays
  $: if (tokens && colors) {
    flattenTokens("", tokens.s.color);
    populateColors(colors);

    filteredTokens = allTokens;
    filteredColors = allColors;

    console.log("tokens:", tokens);
    console.log("colors:", colors);
  }

  // Count how many semantic tokens refer to a given colour
  function countTokensForColor(colorName) {
    let count = 0;
    for (let token in tokenColorMapping) {
      if (tokenColorMapping[token] === colorName) {
        count++;
      }
    }
    return count;
  }

  // Handle selected state
  let selectedColorOrToken = null;

  let filteredTokens = allTokens;
  let filteredColors = allColors;

  // Clicking a color, filter
  function colorClicked(color) {
    // If the selected color is clicked again, reset the filters
    if (selectedColorOrToken === color) {
      resetFilter();
      return;
    }

    selectedColorOrToken = color;

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
  <h1 class="my-32 text-l">Colours in WARP</h1>
  <p>
    Click a colour to see which semantic classes refer to that colour. The
    number next to the colour indicates how many semantic classes refer to that
    colour. Currently this site only includes the FINN light theme.
  </p>
  <p>
    Classes should only be used intentionally. For example, a "-hover" class
    should only be used for hover states. If you can't find a relevant class,
    ask your designer if the colour should be changed, or reach out to the Warp
    team on Slack:
    <a href="https://sch-chat.slack.com/archives/C04P0GYTHPV"
      >#nmp-warp-design-system</a
    >.
  </p>

  <div style="height: 60px;" class="my-16">
    <w-button
      on:click={() => resetFilter()}
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
</style>
