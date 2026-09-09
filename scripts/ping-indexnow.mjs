const KEY = "a8f3c1e94b2d47e0a156c8d3f0e92b17";
const HOST = "tag-eg.online";
const URL_LIST = [
  "https://tag-eg.online/",
  "https://tag-eg.online/catalog",
  "https://tag-eg.online/llms.txt",
  "https://tag-eg.online/sitemap.xml",
];

const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: URL_LIST,
});

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body,
});

const text = await res.text();
console.log(`IndexNow ${res.status} ${res.statusText}: ${text || "(empty)"}`);
if (!res.ok && res.status !== 202) {
  process.exitCode = 1;
}
