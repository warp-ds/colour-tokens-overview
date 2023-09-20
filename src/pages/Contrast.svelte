<script>
  import "@warp-ds/elements";
  import { get } from "svelte/store";
  import { checkColors } from "../lib/color-checker.js";

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
  let backgroundTokens = [];
  let foregroundTokens = [];

  // let foreground = "#FF5733"; // example color
  // let background = "#1D1B1B"; // example color

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

    // When data is processed, run this
  } else {
    // console.log("setting filtered data");
    console.log("allTokens", $allTokens);

    filteredTokens = $allTokens;
    filteredColors = $allColors;

    // Keep only the regular background colours
    backgroundTokens = $allTokens.filter((token) => {
      const name = token.name;
      return (
        name.includes("background") &&
        !name.endsWith("-hover") &&
        !name.endsWith("-active") &&
        !name.endsWith("-selected") &&
        !name.endsWith("-selected-hover")
      );
    });

    // Keep only the regular foreground colours
    foregroundTokens = $allTokens.filter((token) => {
      const name = token.name;
      return name.includes("text");
    });

    // console.log("dataFetched. filteredTokens and filteredColors:");
    // console.log(filteredTokens, filteredColors);

    // colorResults = checkColors(foreground, background).contrast;
    // console.log("color contrast:");
    // console.log(colorResults);
  }
</script>

<main>
  <h1 class="my-32 text-l">Contrast between text and background</h1>
  <p>
    This is primarily a tool for the Warp team to check the contrast between the
    various text colours and background colours.
  </p>

  {#if backgroundTokens.length === 0}
    <p>No background colours loaded</p>
  {:else}
    {#each backgroundTokens as background (background.name)}
      <h2 class="mt-32 text-ml">{background.name}</h2>
      <p>Colour: {background.value}</p>
      <p style="color: {background.value};">ABC abc</p>

      <div>
        <!-- Table for foreground colours -->
        {#if foregroundTokens.length === 0}
          <p>No foreground colours loaded</p>
        {:else}
          <table class="mt-32 border-spacing-4 border-collapse ">
            <thead>
              <tr class="text-left">
                <th>Text colour name</th>
                <th>Colour</th>
                <th>Contrast</th>
                <th>Normal text</th>
              </tr>
            </thead>

            <!-- Iterate through colours and display each one -->
            <tbody>
              {#each foregroundTokens as token (token.name)}
                <tr>
                  <td>{token.name}</td>
                  <td>{token.colorName}</td>
                  <td>{checkColors(token.value, "#ffffff").contrast}</td>
                  <td>
                    <div style="background-color: {background.value};">
                      <p style="color: {token.value};">ABC abc</p>

                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    {/each}
  {/if}
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
</style>
