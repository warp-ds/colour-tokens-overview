<script>
  import "@warp-ds/elements";

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
        <div class="tokenitem flex items-center my-8 border s-border-default rounded-8">
          <div class="colordot w-16 h-16 m-8 rounded-8"></div>
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

  .tokenitem {
    background-color: var(--w-s-color-background-default);
  }

  .tokenitem:hover {
    background-color: var(--w-s-color-background-hover);
    border-color: var(--w-s-color-border-hover);
  }

  .colordot {
    background-color:blue;
  }
</style>
