import { copyFileSync, cpSync, existsSync } from "node:fs";

copyFileSync("dist/index.html", "index.html");
cpSync("dist/assets", "assets", { recursive: true });
if (existsSync("dist/images")) {
  cpSync("dist/images", "images", { recursive: true });
}
if (existsSync("dist/api")) {
  cpSync("dist/api", "api", { recursive: true });
}
if (existsSync("dist/data")) {
  cpSync("dist/data", "data", { recursive: true });
}
if (existsSync("dist/.htaccess")) {
  copyFileSync("dist/.htaccess", ".htaccess");
}
