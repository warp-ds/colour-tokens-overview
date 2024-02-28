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

  let backgroundColor = chroma.random().hex().toUpperCase();
  let foregroundColor =
    chroma.contrast(backgroundColor, "white") > 4.5 ? "#FFFFFF" : "#000000";

  // APCA modeule documentation
  // https://www.npmjs.com/package/apca-w3

  let Lc = Math.round(Math.abs(APCAcontrast(
    sRGBtoY(colorParsley(foregroundColor)),
    sRGBtoY(colorParsley(backgroundColor)))));

</script>

<div
  class="pt-32 pb-128 px-16 top-wrapper"
  style="background-color: {backgroundColor};"
>
  <h1 class="t1 mt-16 text-center" style="color: {foregroundColor};">
    APCA colour contrast checker
  </h1>
</div>

<main>
  <div class="flex justify-center">
    <w-box bordered={true} class="w-fit -mt-128">
      <h2 class="t2">Choose colours</h2>
      <w-textfield
        label="Foreground colour"
        help-text="HEX code like #111111"
        class="mt-16"
        value={foregroundColor}
      >
      </w-textfield>

      <w-textfield
        label="Background colour"
        help-text="HEX code like #efefef"
        class="mt-16"
        value={backgroundColor}
      >
      </w-textfield>
    </w-box>
  </div>

  <h2 class="t2 mt-64">Contrast for graphics</h2>

  <w-alert variant="info" show class="mt-16">
    <p>Contrast:</p>
    <span class="t1">{Lc} Lc</span>
  </w-alert>
  
  <w-alert variant="info" show class="mt-16">
    <p>Minimum size:</p>
    <span class="t1">? pixels</span>
  </w-alert>

</main>

<style>
  main {
    padding: 16px;
    margin: auto;
    max-width: 700px;
    height: 100%;
  }
</style>
