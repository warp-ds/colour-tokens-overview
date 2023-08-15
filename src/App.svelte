<script>
  import "@warp-ds/elements";
</script>

<main>
  <f-breadcrumbs class="mt-10">
    <a href="#/url/1">Eiendom</a>
    <a href="#/url/2">Bolig til salgs</a>
    <a href="#/url/3" aria-current="page"> Oslo </a>
  </f-breadcrumbs>

  <h1>Vite + Svelte</h1>

  <div class="grid m-32 gap-24 grid-cols-1 md:grid-cols-3">
    <div>
      <p>One</p>
      <w-button variant="primary">Primary button</w-button>
    </div>
    <div>
      <p>Two</p>
      <w-button variant="primary">Primary button</w-button>
    </div>
    <div>
      <p>Three</p>
      <w-button variant="primary">Primary button</w-button>
    </div>
    <div>
      <p>Four</p>
      <w-button variant="primary">Primary button</w-button>
    </div>
    <div>
      <p>Five</p>
      <w-button variant="primary">Primary button</w-button>
    </div>
    <div>
      <p>Six</p>
      <w-button variant="primary">Primary button</w-button>
    </div>
  </div>

  <div class="grid grid-cols-3">
    <div />
    <div>
      <w-alert variant="info" show="">
        <p class="font-bold">This is "info" variant of the alert element</p>
        <p>With an additional description</p>
      </w-alert>
    </div>
    <div />
  </div>
</main>

<style>
</style>
