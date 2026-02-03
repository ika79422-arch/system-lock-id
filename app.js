// ---------- UI demo ----------
const form = document.getElementById("lockForm");
const toast = document.getElementById("toast");
const summary = document.getElementById("summary");
const kode = document.getElementById("kode");

function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  toast.style.opacity = "0";
  toast.style.transition = "opacity 180ms ease";
  requestAnimationFrame(() => (toast.style.opacity = "1"));
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => (toast.hidden = true), 220);
  }, 1600);
}

// format "80000" -> "80.000"
function formatRibuan(raw) {
  const digits = String(raw).replace(/[^\d]/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

kode.addEventListener("input", (e) => {
  const caret = e.target.selectionStart;
  const before = e.target.value;
  e.target.value = formatRibuan(before);
  // best-effort caret: keep near end
  try { e.target.setSelectionRange(caret, caret); } catch {}
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const userId = (data.get("userId") || "").trim();
  const provider = data.get("provider");
  const game = data.get("game");
  const server = data.get("server");
  const winrate = data.get("winrate");
  const kodeVal = data.get("kode");

  showToast("Demo aktif ✅");

  summary.hidden = false;
  summary.innerHTML = `
    <strong>Ringkasan (Demo)</strong><br/>
    User ID: <span class="mono">${userId || "(kosong)"}</span><br/>
    Provider: <span class="mono">${provider}</span><br/>
    Game: <span class="mono">${game}</span><br/>
    Server: <span class="mono">${server}</span><br/>
    Winrate: <span class="mono">${winrate}</span><br/>
    Kode Aktivasi: <span class="mono">${kodeVal}</span>
  `;
});

// ---------- Binary rain background ----------
const canvas = document.getElementById("binaryRain");
const ctx = canvas.getContext("2d", { alpha: true });

let w, h, cols, drops, fontSize;

function resize() {
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  w = canvas.width = Math.floor(window.innerWidth * dpr);
  h = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  fontSize = 16 * dpr;
  cols = Math.floor(w / fontSize);
  drops = new Array(cols).fill(1).map(() => Math.random() * h / fontSize);
}
window.addEventListener("resize", resize);
resize();

function drawBinary() {
  // fade
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, w, h);

  ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

  for (let i = 0; i < cols; i++) {
    const text = Math.random() > 0.5 ? "1" : "0";
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    // neon cyan-ish with slight variance
    const a = 0.18 + Math.random() * 0.18;
    ctx.fillStyle = `rgba(120, 240, 255, ${a})`;
    ctx.fillText(text, x, y);

    // reset drop
    if (y > h && Math.random() > 0.975) drops[i] = 0;
    drops[i] += 0.75 + Math.random() * 0.6;
  }

  requestAnimationFrame(drawBinary);
}
drawBinary();
