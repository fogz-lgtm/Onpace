// Deploy build: pre-compile the in-page JSX so the shipped app needs neither
// the 2.4MB Babel download nor a per-launch compile. Run by the Pages workflow;
// the raw index.html still works as-is for direct editing (it keeps the
// in-browser Babel script, which this build strips).
const fs = require("fs");
const babel = require("@babel/core");

const html = fs.readFileSync("index.html", "utf8");
const m = html.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);
if (!m) throw new Error("babel script block not found in index.html");

const compiled = babel.transformSync(m[1], {
  presets: [["@babel/preset-react", { runtime: "classic" }]],
  compact: false,
}).code;

let out = html.replace(m[0], () => `<script>\n${compiled}\n</script>`);
out = out.replace(/[ \t]*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"><\/script>\n?/, "");
if (out.includes("unpkg.com/@babel")) throw new Error("babel script tag not removed");

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist");
fs.writeFileSync("dist/index.html", out);
for (const f of ["icon.png", "sw.js"]) fs.copyFileSync(f, `dist/${f}`);
fs.cpSync("vendor", "dist/vendor", { recursive: true });
console.log(`built dist/: index.html ${out.length} bytes (compiled script ${compiled.length} bytes)`);
