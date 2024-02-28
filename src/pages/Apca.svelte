<script>
  import "@warp-ds/elements";
  import { onMount } from 'svelte';
  import { get } from "svelte/store";
  import jsyaml from "js-yaml";
  import { slide, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  let overlap = 128;

  function generateRandomColor() {
    let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    console.log("random colour", randomColor);
    return randomColor;
  }

  let color = generateRandomColor();

</script>

<div class="pt-32 pb-{overlap} px-16 top-wrapper" style="background-color: {color};">
  <h1 class="t1 mt-16 text-center">APCA colour contrast checker</h1>
</div>

<main>
  <div class="flex justify-center">
    <w-box bordered={true} class="w-fit -mt-{overlap}">
      <h2 class="t2">Choose colours</h2>
      <w-textfield
        label="Foreground colour"
        placeholder=""
        help-text="HEX code like #111111"
        class="mt-16"
      >
      </w-textfield>

      <w-textfield
        label="Background colour"
        placeholder=""
        help-text="HEX code like #efefef"
        class="mt-16"
      >
      </w-textfield>
    </w-box>
  </div>

  <h2 class="t2 mt-64">Contrast for graphics</h2>

  <w-alert variant="info" show class="mt-16">
    <p>Minimum size:</p>
    <span class="t1">33</span>
    <p>pixels</p>
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
