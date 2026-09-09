import { copyFileSync, cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";

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

const homeHtml = readFileSync("dist/index.html", "utf8");
const catalogHtml = homeHtml
  .replace(/<title>[\s\S]*?<\/title>/, "<title>كاتلوج مصنع تاج | ساعات حائط وتحف ديكور من بسيون</title>")
  .replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    "$1كاتلوج مصنع تاج في بسيون: ساعات حائط وتحف وديكور. اطلب عبر واتساب. الأسعار غير ظاهرة على الموقع — السعر حسب القطعة والكمية.$2",
  )
  .replaceAll('href="https://tag-eg.online/" />', 'href="https://tag-eg.online/catalog" />')
  .replaceAll('content="https://tag-eg.online/"', 'content="https://tag-eg.online/catalog"')
  .replace(
    /<noscript>[\s\S]*?<\/noscript>/,
    `<noscript>
      <article>
        <h1>كاتلوج مصنع تاج — ساعات حائط وتحف ديكور من بسيون</h1>
        <p>كاتلوج مصنع تاج في بسيون بمحافظة الغربية: ساعات حائط وتحف ديكور وبوتات سيراميك. الشحن لكل محافظات مصر والدفع عند الاستلام. الأسعار غير ظاهرة هنا؛ اطلب عرض السعر عبر واتساب 01010841285.</p>
        <p>المصنع في بسيون وليس في طنطا. الإحداثيات 31.013279، 30.8531894.</p>
        <p><a href="https://tag-eg.online/">الموقع الرئيسي</a> — <a href="https://tag-eg.online/llms.txt">حقائق للمساعدات الذكية</a></p>
      </article>
    </noscript>`,
  );

writeFileSync("dist/catalog.html", catalogHtml);
copyFileSync("dist/catalog.html", "catalog.html");

for (const file of [
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "ai.txt",
  "humans.txt",
  "a8f3c1e94b2d47e0a156c8d3f0e92b17.txt",
]) {
  if (existsSync(`dist/${file}`)) copyFileSync(`dist/${file}`, file);
}
