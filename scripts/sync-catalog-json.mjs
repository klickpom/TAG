import { readFileSync, writeFileSync } from "fs";

const src = readFileSync("src/data/lookbook.ts", "utf8");
const items = [
  ...src.matchAll(
    /\{ id: "(lb\d+)", name: "([^"]+)", image: img\("([^"]+)"\), kind: "(clocks|pots)", size: "([^"]+)", price: "([^"]*)" \}/g
  ),
].map((m) => ({
  id: m[1],
  name: m[2],
  image: `/api/media.php?f=${m[3]}`,
  kind: m[4],
  size: m[5],
  price: m[6],
}));

if (items.length !== 46) {
  throw new Error(`parsed ${items.length} catalog items, expected 46`);
}

const json = `${JSON.stringify(items, null, 2)}\n`;
writeFileSync("data/catalog.json", json);
writeFileSync("public/data/catalog.json", json);
console.log(`wrote ${items.length} items`);
