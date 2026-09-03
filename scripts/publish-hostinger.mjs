import { cpSync, copyFileSync, existsSync } from "node:fs";

copyFileSync("dist/index.html", "index.html");
cpSync("dist/assets", "assets", { recursive: true });
if (existsSync("dist/images")) {
  cpSync("dist/images", "images", { recursive: true });
}
