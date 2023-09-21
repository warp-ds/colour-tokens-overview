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
    various text colours and background colours. Currently only for FINN
    colours. The colour contrast for small and normal text must be minimun <strong
      >4.5 : 1</strong
    >.
  </p>

  <!-- Checkbox 
  <div class="mt-32">
    <input
    type="checkbox"
    id="accessibilityOnly"
    name="accessibilityOnly"
    value="checkedValue"
  />
  <label for="accessibilityOnly">Only accessible colour combinations</label>

  </div>
  -->
  
  {#if backgroundTokens.length === 0}
    <p>No background colours loaded</p>
  {:else}
    {#each backgroundTokens as background (background.name)}
      <h2 class="mt-56 text-ml">{background.name}</h2>

      <div class="flex mt-8">
        <div
          class="colorsquare w-24 h-24 rounded-4 mr-8"
          style="background-color: {background.value};"
        />
        <p> {background.colorName}</p>
      </div>

      <div>
        {#if foregroundTokens.length === 0}
          <p>No foreground colours loaded</p>
        {:else}
          <!-- Table for foreground colours -->
          <table
            class="mt-32 border-spacing-x-24"
            style="border-collapse: collapse;"
          >
            <!-- Column headers -->
            <thead>
              <tr class="text-left mb-48">
                <th>Text colour name</th>
                <th>Colour</th>
                <th>Example</th>
                <th>Contrast</th>
                <th>Accessible</th>
              </tr>
            </thead>

            <!-- Iterate through colours and display each one -->
            <tbody>
              {#each foregroundTokens as token (token.name)}
                <tr>
                  <!-- Name -->
                  <td>
                    <p class="mt-6">{token.name}</p>
                  </td>
                  <!-- Colour -->
                  <td>
                    <div class="flex items-center">
                      <div
                        class="w-24 h-24 mr-8 rounded-2"
                        style="background-color: {token.value};"
                      />
                      <p class="mt-6">{token.colorName}</p>
                    </div>
                  </td>
                  <!-- Example -->
                  <td>
                    <div
                      class="h-48 w-128 colorsquare rounded-4 flex justify-center items-center"
                      style="background-color: {background.value};"
                    >
                      <p class="mb-2" style="color: {token.value};">ABC abc</p>
                    </div>
                  </td>
                  <!-- Contrast -->
                  <td class="text-left">
                    <p class="mt-6">
                      {checkColors(token.value, background.value).contrast} : 1
                    </p>
                  </td>
                  <!-- Accessible -->
                  <td class="flex justify-center items-center">
                    <!-- Evaluation OK or not -->
                    {#if parseFloat(checkColors(token.value, background.value).contrast) > 4.5}
                      <img
                        class="h-24 mt-10"
                        src="../src/assets/green_check.svg"
                        alt="Green check"
                      />
                    {:else}
                      <img
                        class="h-24 mt-10"
                        src="../src/assets/red_cross.svg"
                        alt="Red cross"
                      />
                    {/if}
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
    max-width: 900px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .colorsquare {
    border-color: var(--w-s-color-border-default);
  }

  table {
    /* margin-left: -24px;  Adjust to match your border-spacing value */
  }

  td,
  th {
    padding-right: 24px; /* Space to the right of the cell content */
    padding-left: 24px; /* Space to the right of the cell content */
    padding-top: 12px;
    padding-bottom: 12px;
    vertical-align: middle;
  }

  tr {
    border-bottom: 1px solid #000;
    border-color: var(--w-s-color-border);
    padding-top: 12px;
    padding-bottom: 12px;
  }

  tr:last-child {
    border-bottom: none;
  }

  td:first-child,
  th:first-child {
    padding-left: 0;
  }

  td:last-child,
  th:last-child {
    padding-right: 0;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }

  input[type="checkbox"],
label {
    vertical-align: middle;
}
</style>
