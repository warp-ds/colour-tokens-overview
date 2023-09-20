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
    various text colours and background colours. Currently only for FINN colours.
  </p>

  {#if backgroundTokens.length === 0}
    <p>No background colours loaded</p>
  {:else}
    {#each backgroundTokens as background (background.name)}
      <h2 class="mt-32 text-ml">{background.name}</h2>

      <div class="flex">
        <div
          class="colorsquare w-24 h-24 rounded-4 border mr-8"
          style="background-color: {background.value};"
        />
        <p>{background.colorName}, {background.value}</p>
      </div>

      <div>
        {#if foregroundTokens.length === 0}
          <p>No foreground colours loaded</p>
        {:else}
          <!-- Table for foreground colours -->
          <table
            class="mt-32 border-spacing-16"
            style="border-collapse: separate;"
          >
            <thead>
              <tr class="text-left">
                <th>Text colour name</th>
                <th>Colour</th>
                <th>Normal text</th>
                <th>Contrast</th>
              </tr>
            </thead>

            <!-- Iterate through colours and display each one -->
            <tbody>
              {#each foregroundTokens as token (token.name)}
                <tr>
                  <!-- Name -->
                  <td>{token.name}</td>
                  <!-- Colour -->

                  <td>
                    <div class="flex mt-8">
                      <div
                        class="colorsquare w-24 h-24 rounded-4 border mr-8 flex justify-center items-center"
                        style="background-color: {background.value};"
                      >
                        <div
                          class="w-16 h-16 rounded-2"
                          style="background-color: {token.value};"
                        />
                      </div>

                      <p>{token.colorName}</p>
                    </div>
                  </td>
                  <!-- Normal text -->
                  <td>
                    <div
                      class="mt-2 colorsquare border rounded-4 flex justify-center items-center h-24"
                      style="background-color: {background.value};"
                    >
                      <p class="mb-0" style="color: {token.value};">ABC abc</p>
                    </div>
                  </td>
                  <!-- Contrast -->
                  <td>{checkColors(token.value, background.value).contrast}</td>
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

  .colorsquare {
    border-color: var(--w-s-color-border-default);
  }
</style>
