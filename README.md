# Colour tokens overview

Web site that shows an overview of colours and colour classes in Warp, and the mapping between these. 

Currently the site only contains colours for the FINN Light theme. The colours are loaded from YAML files during runtime in order to always be updated.

The project was created by a designers, so don't expect the code to be perfect. 

## Live web page
https://warp-ds.github.io/colour-tokens-overview/


## To run locally
Install:
`npm install``

Run dev:
´npm run dev`

## History
Set up with Vite and Svelte

`npm create vite@latest vite-svelte --template svelte`

**Installed Warp:**
`npm install unocss @warp-ds/uno@1.0.0-alpha.49 @warp-ds/component-classes@1.0.0-alpha.116`

**Installed js-yaml**
This will load the yaml files during runtime.
`npm install js-yaml`

The project is built to the dist folder, put in the gh-pages branch, and published to Github pages.
