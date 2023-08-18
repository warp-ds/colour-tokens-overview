<script>
  import "@warp-ds/elements";

  // Import variables data from Figma
  import rawPrimitive from "../data/primitive-tailwind.js";
  import rawTokens from "../data/tokens-tailwind.js";

  // Wrap the rawData in curly braces
  const wrappedPrimitive = `{${rawPrimitive}}`;
  const wrappedTokens = `{${rawTokens}}`;

  // Use eval to convert the string to an object
  const primitive = eval("(" + wrappedPrimitive + ")");
  const tokens = eval("(" + wrappedTokens + ")");

  // Check that it works
  // console.log(primitive.FINN.colors); // This should now work
  // console.log(tokens.Light.colors); // This should now work

  // Transform tokens object into desired structure
  const transformValue = (value) => {
    const aliasMatch = value.match(/--(.*),/);
    const hexMatch = value.match(/, ([^)]+)\)/);

    return {
      alias: aliasMatch ? aliasMatch[1] : null,
      hexFINN: hexMatch ? hexMatch[1] : null,
    };
  };

  const transformedTokens = {
    Light: {},
    Dark: {},
  };

  // Transform Light colors
  for (let key in tokens.Light.colors) {
    transformedTokens.Light[key] = transformValue(tokens.Light.colors[key]);
  }

  // Transform Dark colors
  for (let key in tokens.Dark.colors) {
    transformedTokens.Dark[key] = transformValue(tokens.Dark.colors[key]);
  }

  console.log("Primitive variables");
  console.log(primitive);
  console.log("Tokens variables");
  console.log(transformedTokens);

  const components = [
    "Alert",
    "Avatar",
    "Badge",
    "Box",
    "Breadcrumbs",
    "Broadcast",
    "Button",
    "Button group",
    "Callout",
    "Card",
    "Checkbox",
    "Datepicker",
    "Expandable",
    "Help text",
    "Image placeholder",
    "Input",
    "Label",
    "List",
    "Modal",
    "Page indicator",
    "Pagination",
    "Pill",
    "Popover",
    "Radio",
    "Select",
    "Slider",
    "Spinner",
    "Star rating",
    "Step indicator",
    "Switch (Toggle)",
    "Tabs",
    "Toast",
    "Tooltip",
  ];
</script>

<main>
  <h1 class="my-8 text-l">WARP components and tokens</h1>

  <div class="grid my-24 gap-24 grid-cols-1 md:grid-cols-3">
    <div class="flex-initial">
      <h2 class="text-m">Components</h2>
      {#each components as component}
        <div class="tokenitem s-bg-default my-8 border s-border-default p-8 rounded-8">
          {component}
        </div>
      {/each}
    </div>
    <div class="s-bg-positive-default">
      <h2 class="text-m">Component tokens</h2>

      <w-card clickable="">
        <div class="m-20">Clickable</div>
      </w-card>
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

  tokenitem {
    background-color: var(--w-s-color-background-hover)
  }
</style>
