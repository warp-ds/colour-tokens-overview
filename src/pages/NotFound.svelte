<!-- src/pages/NotFound.svelte -->
<script>
  import { onMount } from "svelte";

  // tracking
  onMount(() => {
    const script = document.createElement("script");
    script.src = "//zgo.at/count.js";
    script.async = true;
    script.dataset.goatcounter = "https://warp.goatcounter.com/count";
    script.dataset.goatcounterSettings = JSON.stringify({ path: "/404" });

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  });
</script>

<div>
  <h1>404 - Not Found</h1>
  <p>The page you are looking for doesn't exist.</p>
</div>
