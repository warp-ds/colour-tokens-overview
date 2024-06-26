<script>
 
  import "@warp-ds/elements";
  import chroma from "chroma-js";

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
  import { checkColors } from "../lib/color-checker.js";

  let contrastDemands = [
    { Lc: 100, Size: "&lt; 1", LineThickness: 0.7 },
    { Lc: 90, Size: "1", LineThickness: 1 },
    { Lc: 75, Size: "1.5", LineThickness: 1.5 },
    { Lc: 60, Size: "2", LineThickness: 2 },
    { Lc: 50, Size: "3", LineThickness: 3 },
    { Lc: 45, Size: "4", LineThickness: 4 },
    { Lc: 30, Size: "6", LineThickness: 6 },
    { Lc: 25, Size: "8", LineThickness: 8 },
    { Lc: 20, Size: "10", LineThickness: 10 },
    { Lc: 15, Size: "15", LineThickness: 15 },
  ];

  // Random colours on refresh
  let backgroundColor = chroma.random().hex().toUpperCase();
  let foregroundColor =
    chroma.contrast(backgroundColor, "white") > 4.5 ? "#FFFFFF" : "#000000";

  function newRandomColours() {
    backgroundColor = chroma.random().hex().toUpperCase();
    foregroundColor =
      chroma.contrast(backgroundColor, "white") > 4.5 ? "#FFFFFF" : "#000000";
  }

  function swapColours() {
    let previousBackground = backgroundColor;
    backgroundColor = foregroundColor;
    foregroundColor = previousBackground;
  }

  let backgroundIsValid = true;
  let foregroundIsValid = true;

  // WCAG contrast, check only if valid colours
  $: wcagContrast =
    foregroundIsValid && backgroundIsValid
      ? checkColors(foregroundColor, backgroundColor).contrast
      : wcagContrast;

  // APCA contrast, check only if valid colours
  // https://www.npmjs.com/package/apca-w3
  $: Lc =
    foregroundIsValid && backgroundIsValid
      ? Math.round(
          Math.abs(
            // @ts-ignore
            APCAcontrast(
              sRGBtoY(colorParsley(foregroundColor)),
              sRGBtoY(colorParsley(backgroundColor))
            )
          )
        )
      : Lc;

  // Prepare list
  let sortedDemands = [...contrastDemands].sort((a, b) => b.Lc - a.Lc);

  // Find smallest pixel size to use if valid colours
  $: demand =
    foregroundIsValid && backgroundIsValid
      ? (sortedDemands.find((demand) => demand.Lc <= Lc) || { Size: "No" }).Size
      : 100;

  function handleForegroundInput(event) {
    // check if valid colour
    if (chroma.valid(event.detail.value)) {
      foregroundColor = chroma(event.detail.value).hex();
      foregroundIsValid = true;
    } else {
      foregroundIsValid = false;
    }
  }

  function handleBackgroundInput(event) {
    if (chroma.valid(event.detail.value)) {
      backgroundColor = chroma(event.detail.value).hex();
      backgroundIsValid = true;
    } else {
      backgroundIsValid = false;
    }
  }
</script>

<div
  class="pt-32 pb-128 px-16 top-wrapper"
  style="background-color: {backgroundColor};"
>
  <h1 class="t1 mt-16 text-center" style="color: {foregroundColor};">
    APCA non-text contrast checker
  </h1>
</div>

<main class="flex flex-col items-center justify-center">
  <!-- Choose colours box -->
  <div class="flex justify-center mb-32">
    <w-box bordered={true} class="w-fit -mt-128">
      <h2 class="t3">Choose colours</h2>
      <div class="flex flex-wrap gap-x-24 gap-y-8 mb-24">
        <w-textfield
          label="Foreground colour"
          invalid={!foregroundIsValid}
          help-text={foregroundIsValid
            ? "Enter colour name or HEX code"
            : "Not a valid colour"}
          class="mt-16"
          value={foregroundColor}
          on:change={handleForegroundInput}
        >
        </w-textfield>

        <w-textfield
          label="Background colour"
          invalid={!backgroundIsValid}
          help-text={backgroundIsValid
            ? "Enter colour name or HEX code"
            : "Not a valid colour"}
          class="mt-16"
          value={backgroundColor}
          on:change={handleBackgroundInput}
        >
        </w-textfield>
      </div>
      <div class="flex gap-16">
        <w-button variant="primary" on:click={newRandomColours}
          >Random colours</w-button
        >
        <w-button variant="secondary" on:click={swapColours}
          >Swap colours</w-button
        >
      </div>
    </w-box>
  </div>

  <!--   <h2 class="t2 mb-24">Contrast for graphics</h2>
 -->

  <!-- Result in numbers -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-16">
    <w-box bordered={true} class="">
      <p>APCA contrast:</p>
      <span class="t1">{Lc} Lc</span>
    </w-box>
    <w-box bordered={true} class="">
      <p>WCAG contrast:</p>
      {#if wcagContrast >= 3}
        <div class="flex gap-8">
          <span class="t1">{wcagContrast} : 1</span>
          <img
            class="h-24 mt-8"
            src="/colour-tokens-overview/green_check.svg"
            alt="Green check"
          />
        </div>
      {:else}
        <div class="flex gap-8">
          <span class="t1">{wcagContrast} : 1</span>
          <img
            class="h-24 mt-8"
            src="/colour-tokens-overview/red_cross.svg"
            alt="Red cross"
          />
        </div>
      {/if}
    </w-box>

    <w-box bordered={true} class="">
      <p>Minimum size:</p>
      {#if foregroundIsValid && backgroundIsValid}
        <span class="t1">{@html demand} px</span>
      {:else}{/if}
    </w-box>
  </div>

  <!-- Table -->
  <table class="table-auto my-32 w-full md:w-3/4">
    <thead>
      <tr>
        <th class="text-right">Size</th>
        <th class="text-right pr-16">Lc required</th>
        <th class="pr-16">APCA</th>
        <th class="text-center px-16">Example</th>
      </tr>
    </thead>
    <tbody>
      {#each contrastDemands as item (item.Lc)}
        <tr>
          <!-- Px size -->
          <td class="text-right -pr-16 py-16">{@html item.Size} px</td>
          <!-- LC demand -->
          <td class="text-right pr-16">{item.Lc} Lc</td>
          <!-- APCA -->
          <td class="flex justify-center items-center pr-8 py-16">
            {#if Lc < item.Lc}
              <img
                class="h-24"
                src="/colour-tokens-overview/red_cross.svg"
                alt="Red cross"
              />
            {:else}
              <img
                class="h-24"
                src="/colour-tokens-overview/green_check.svg"
                alt="Green check"
              />
            {/if}
          </td>
          <td>
            <div
              class="cell px-16 py-16 mx-16 rounded-8"
              style="background-color: {backgroundColor};"
            >
              <!-- Line -->
              <div
                class="cell::before"
                style="border-top-width: {item.LineThickness}px; border-top-color: {foregroundColor};"
              ></div>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <h2 class="t2 mb-16 mt-24">About APCA contrast</h2>
  <p class="w-full pb-8">
    The <a href="https://git.apcacontrast.com/documentation/APCAeasyIntro"
      >Advanced Perceptual Contrast Algorithm (APCA)</a
    >
    measures lightness contrast as a value from Lc 0 (no contrast) to Lc 106 (maximum
    contrast).
  </p><p class="w-full pb-8">
    APCA™ is the candidate contrast method for WCAG 3, and is currently in public
    beta. WCAG 3 is still in development and subject to changes prior to adoption.
  </p><p class="w-full pb-8">
    The contrast requirements above are extracted from 
    <a href="https://github.com/Myndex/SAPC-APCA/discussions/39">the Non-Text Minimums table (image)</a> from Myndex, marked "Preliminary – Feb 2, 2022".
     
  </p><p class="w-full pb-8">
    For text there are several APCA contrast checkers available:
    <a
      href="https://www.achecks.org/apca-wcag-3-accessible-colour-contrast-checker/"
      >achecks</a
    >, <a href="https://contrast.tools/">contrast.tools</a> and
    <a href="https://www.myndex.com/APCA/">myndex</a>. In Figma, you can for example use the
    plugins
    <a href="https://www.figma.com/community/plugin/748533339900865323/contrast"
      >Contrast</a
    > or <a href="https://www.figma.com/community/plugin/1281280685402026529/polychrome"
      >Polychrome</a> to check APCA contrast.
    </p>
    
    <p class="w-full pb-8">

    This page was built using
    <a href="https://www.npmjs.com/package/apca-w3">APCA-3</a>,
    <a href="https://warp-ds.github.io/tech-docs/">WARP</a>,
    <a href="https://svelte.dev/">Svelte</a>, and
    <a href="https://www.npmjs.com/package/chroma-js">Chroma.js</a>.
  </p>
</main>

<style>
  main {
    padding: 16px;
    margin: auto;
    max-width: 700px;
    height: 100%;
  }

  .cell {
    position: relative;
    background-color: lightgray;
  }

  .cell::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    border-top-style: solid;
  }

  tr {
    border-bottom: 1px solid #000;
    border-color: var(--w-s-color-border);
    padding-top: 12px;
    padding-bottom: 12px;
  }

  a {
    text-decoration: underline;
    text-decoration-style: dotted;
  }
</style>
