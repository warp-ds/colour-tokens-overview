<script>
  // @ts-nocheck

  import "@warp-ds/elements";
  // import { APCAcontrast, APCAcontrastFromHex } from 'apca-w3/src/apca-w3.js';
  import {
    APCAcontrast,
    reverseAPCA,
    sRGBtoY,
    displayP3toY,
    adobeRGBtoY,
    alphaBlend,
    calcAPCA,
    fontLookupAPCA,
  } from "apca-w3";
  import { colorParsley, colorToHex, colorToRGB } from "colorparsley";

  import { get } from "svelte/store";
  import { checkColors } from "../lib/color-checker.js";

  // let contrastLc = APCAcontrast( sRGBtoY( colorParsley('#000000') ), sRGBtoY( colorParsley('#e6e0dd') ) );
  // console.log("constrast LC",   Math.round(contrastLc*10)/10);

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

  let hideBadContrastColours = true;

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
    // console.log("allTokens", $allTokens);

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
  <p>
    <a href="https://www.myndex.com/APCA/">APCA contrast</a> (WCAG 3.0) takes font size and weight into consideration. For example, APCA L<sup>c</sup> contrast for normal,
    non-bold text:
  </p>
  <ul>
    <li>L<sup>c</sup> 100: 15px or larger</li>
    <li>L<sup>c</sup> 90: 16px or larger</li>
    <li>L<sup>c</sup> 75: 18px or larger</li>
    <li>L<sup>c</sup> 60: 24px or larger</li>
    <li>L<sup>c</sup> 45: 42px or larger</li>
  </ul>

  <div class="mt-32">
    <input
      type="checkbox"
      id="accessibilityOnly"
      name="accessibilityOnly"
      bind:checked={hideBadContrastColours}
    />
    <label for="accessibilityOnly"
      >Show accessible colour combinations only</label
    >
  </div>

  {#if backgroundTokens.length === 0}
    <p>No background colours loaded</p>
  {:else}
    {#each backgroundTokens as background (background.name)}
      <!-- Name of background colour -->
      <h2 class="mt-56 text-ml">{background.name}</h2>

      <!-- Circle with colour -->
      <!-- Add border if white background -->

      <div class="flex mt-8">
        <div
          class="w-24 h-24 rounded-4 mr-8 {background.value === '#ffffff'
            ? 'colorsquare border'
            : ''}"
          style="background-color: {background.value};"
        />
        <!-- Colour name for this paleettet -->
        <p>{background.colorName}</p>
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
                <th>APCA</th>
              </tr>
            </thead>

            <!-- Iterate through colours and display each one -->
            <tbody>
              {#each foregroundTokens as token (token.name)}
                <!-- If filter, only show good contrast numbers -->
                {#if !hideBadContrastColours || (hideBadContrastColours && parseFloat(checkColors(token.value, background.value).contrast) > 4.5)}
                  <tr>
                    <!-- Name -->
                    <td style="width: 215px;">
                      <p class="mt-6">{token.name}</p>
                    </td>
                    <!-- Colour -->
                    <td style="width: 180px;">
                      <div class="flex items-center">
                        <div
                          class="w-24 h-24 mr-8 rounded-2 {token.value ===
                          '#ffffff'
                            ? 'colorsquare border'
                            : ''}"
                          style="background-color: {token.value};"
                        />
                        <p class="mt-6">{token.colorName}</p>
                      </div>
                    </td>
                    <!-- Example -->
                    <td>
                      <div
                        class="h-48 w-128 rounded-4 flex justify-center items-center {background.value ===
                        '#ffffff'
                          ? 'colorsquare border'
                          : ''}"
                        style="background-color: {background.value};"
                      >
                        <p class="mb-2" style="color: {token.value};">
                          ABC abc
                        </p>
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
                          src="/colour-tokens-overview/green_check.svg"
                          alt="Green check"
                        />
                      {:else}
                        <img
                          class="h-24 mt-10"
                          src="/colour-tokens-overview/red_cross.svg"
                          alt="Red cross"
                        />
                      {/if}
                    </td>
                    <!-- ACPA -->
                    <td class="text-right">
                      <p class="mt-6">
                        {(() => {
                          const colorForeground = sRGBtoY(
                            colorParsley(token.value)
                          );
                          const colorBackground = sRGBtoY(
                            colorParsley(background.value)
                          );
                          const contrastValue = APCAcontrast(
                            colorForeground,
                            colorBackground
                          );
                          return Math.abs(Math.round(contrastValue ) );
                        })()}
                      </p>
                    </td>
                  </tr>
                {/if}
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

  ul {
    list-style-type: disc; /* disc is the default bullet point style */
    padding-left: 32px;
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
