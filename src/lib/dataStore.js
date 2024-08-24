// NB: since this is not a Svelte file the reactivitiy won't work. Use JavaScript

// src/lib/dataStore.js
import { writable, get } from "svelte/store";

// Raw data
let colors = null;
let tokens = null;

// Raw stores
export const allTokens = writable([]);
export const allColors = writable([]);
export const tokenColorMapping = writable({});

// Flag to check if data has been fetched
export const dataFetched = writable(false);

// Flag to check if data has been processed
export const dataProcessed = writable(false);

// Fetch data and save to 'tokens' and 'colors'
export async function fetchTokens() {
  // Only run once
  if (!get(dataFetched)) {
    // console.log("Running fetchTokens");

    // Fetch and parse the colors YAML
    const colorsResponse = await fetch(
      "https://raw.githubusercontent.com/warp-ds/tokens/main/tokens/finn-light/colors.json"
    );
    colors = await colorsResponse.json(); // Parse JSON directly

    // Fetch and parse the tokens YAML
    const tokensResponse = await fetch(
      "https://raw.githubusercontent.com/warp-ds/tokens/main/tokens/finn-light/semantic.json"
    );
    tokens = await tokensResponse.json(); // Parse JSON directly

    console.log("Data fetched. Colors and tokens:")
    console.log(colors, tokens);
    // console.log("Example color:", colors["color"]["gray"]["200"]);

    // Once data is fetched, set the flag to true
    dataFetched.set(true);
  }
}

// Function to get the hex code for a primitive token
function getColorForToken(token) {
  const parts = token.split(".");
  const colorFamily = "color";  // The top-level key in your colors.json

  if (parts.length === 1) {
    // Handle single-level color references like "white"
    if (colors[colorFamily] && colors[colorFamily][token]) {
      return colors[colorFamily][token];
    } else if (colors[token]) {
      return colors[token];
    } else {
      console.warn(`Color not found for token: ${token}`);
    }
  } else if (parts.length === 2) {
    // Handle multi-level color references like "gray.200"
    const colorName = parts[0];
    const shade = parts[1];
    if (colors[colorFamily] && colors[colorFamily][colorName] && colors[colorFamily][colorName][shade]) {
      return colors[colorFamily][colorName][shade];
    } else {
      console.warn(`Color not found for token: ${colorName}.${shade}`);
    }
  } else {
    console.log(`Invalid token format: ${token}`);
  }
  return null;  // Return null if color is not found
}




// Function to flatten the semantic tokens
function flattenTokens(prefix, tokenObj) {
  let resultTokens = [];
  let resultMapping = {};

  for (let key in tokenObj) {
    let fullTokenName = prefix ? `${prefix}-${key}` : key;

    if (typeof tokenObj[key] === "object" && "value" in tokenObj[key]) {
      // Match color reference like "{color.gray.200}"
      const colorReferenceMatch = tokenObj[key]["value"].match(/\{color\.(.*?)\}/);
      if (colorReferenceMatch) {
        const colorReference = colorReferenceMatch[1];  // e.g., "gray.200"
        const hexColor = getColorForToken(colorReference);

        if (hexColor) {
          resultTokens.push({
            name: fullTokenName,
            colorName: colorReference,
            value: hexColor,
          });
        } else {
          console.log(`Failed to find hex color for reference: ${colorReference}`);
        }

        resultMapping[fullTokenName] = colorReference;
      } else {
        console.log(`No color reference found in value: ${tokenObj[key]["value"]}`);
      }
    } else if (typeof tokenObj[key] === "object") {
      const nestedResults = flattenTokens(fullTokenName, tokenObj[key]);
      resultTokens = resultTokens.concat(nestedResults.tokens);
      resultMapping = { ...resultMapping, ...nestedResults.mapping };
    }
  }

  return { tokens: resultTokens, mapping: resultMapping };
}


// Utility to remove '-_' suffix if present
// Can skip?
function cleanColorName(name) {
  return name.endsWith("-_") ? name.slice(0, -2) : name;
}

// Function to populate allColors array
function populateColors(colorObj, tokenColorMap) {
  let resultColors = [];
  const colorFamily = "color";  // Assuming all colors are nested under "color"

  for (let colorName in colorObj[colorFamily]) {
    const shades = colorObj[colorFamily][colorName];
    for (let shade in shades) {
      if (typeof shades[shade] === "string") {
        resultColors.push({
          name: `${colorName}.${shade}`,
          value: shades[shade],
          count: 0,
        });
      } else if (typeof shades[shade] === "object" && "value" in shades[shade]) {
        resultColors.push({
          name: `${colorName}.${shade}`,
          value: shades[shade]["value"],
          count: 0,
        });
      }
    }
  }

  // Count how many semantic tokens refer to each color
  resultColors.forEach((color) => {
    color.count = Object.values(tokenColorMap).filter(
      (tokenColor) => tokenColor === color.name
    ).length;
  });

  return resultColors;
}


// When data is loaded, flatten and put into arrays
function processColorsAndTokens() {
  if (get(dataFetched) && !get(dataProcessed)) {
    const { tokens: tokensList, mapping: tokenColorMap } = flattenTokens("", tokens);

    allTokens.set(tokensList);
    tokenColorMapping.set(tokenColorMap);

    const colorsList = populateColors(colors, tokenColorMap);
    allColors.set(colorsList);

    dataProcessed.set(true);
  }
}

// Reactive logic below
dataFetched.subscribe((value) => {
  if (value) {
    processColorsAndTokens();
  }
});

(async () => {
  await fetchTokens();
  processColorsAndTokens();

  console.log("All Tokens:", get(allTokens));
  console.log("All Colors:", get(allColors));
  console.log("Token-Color Mapping:", get(tokenColorMapping));
})();
