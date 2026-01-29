const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

const yes1 = document.getElementById("yes1");
const no1  = document.getElementById("no1");
const yes2 = document.getElementById("yes2");
const no2  = document.getElementById("no2");

const couple = document.getElementById("couple");
const bgMusic = document.getElementById("bgMusic");

const modal = document.getElementById("modal");
const surpriseText = document.getElementById("surpriseText");
const closeModal = document.getElementById("closeModal");

/* ✅ កំណត់ឈ្មោះនៅទីនេះ */
const yourName = "ហេង សេងលៀង"; // <-- កែឈ្មោះអ្នក
const partnerName = "ល័ក្ខ ចលនា";
const fullName = `${yourName} ❤️ ${partnerName}`;

/* ✍️ Typewriter */
function typeText(el, text, speed = 52) {
  el.innerHTML = "";
  let i = 0;
  const timer = setInterval(() => {
    el.innerHTML += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

/* 🌸 Click hearts explosion */
function explodeHearts(x, y, count = 18) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart explode";
    heart.textContent = "❤️";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    heart.style.setProperty("--x", `${Math.random() * 220 - 110}px`);
    heart.style.setProperty("--y", `${Math.random() * 220 - 110}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
}

/* 💞 Background hearts (continuous) */
let bgHeartsTimer = null;
function spawnBgHeart() {
  const h = document.createElement("div");
  h.className = "bg-heart";
  h.textContent = "💗";

  const x = Math.random() * window.innerWidth;
  const size = 14 + Math.random() * 20;
  const drift = (Math.random() * 180 - 90) + "px";
  const rotate = (Math.random() * 260 - 130) + "deg";
  const duration = 6 + Math.random() * 4;

  h.style.left = x + "px";
  h.style.fontSize = size + "px";
  h.style.setProperty("--dx", drift);
  h.style.setProperty("--r", rotate);
  h.style.setProperty("--s", (0.85 + Math.random() * 0.9).toFixed(2));
  h.style.animationDuration = duration + "s";

  document.body.appendChild(h);
  setTimeout(() => h.remove(), (duration + 0.2) * 1000);
}
function startBgHearts() {
  if (bgHeartsTimer) return;
  bgHeartsTimer = setInterval(spawnBgHeart, 320);
}
function stopBgHearts() {
  clearInterval(bgHeartsTimer);
  bgHeartsTimer = null;
}

/* ✅ Runaway: run inside .buttons then return home (works on page2 too) */
function runAway(btn) {
  const parent = btn.parentElement; // .buttons
  let home = { left: 0, top: 0 };
  let backTimer = null;

  function setHomePosition() {
    // reset to CSS home first (right)
    btn.style.right = "0";
    btn.style.left = "auto";
    btn.style.top = "0";
    btn.style.transform = "rotate(0deg)";

    const pr = parent.getBoundingClientRect();
    const br = btn.getBoundingClientRect();

    // if hidden (page2), pr will be 0
    if (pr.width === 0 || pr.height === 0) return false;

    home.left = br.left - pr.left;
    home.top  = br.top  - pr.top;

    // switch to left/top control
    btn.style.right = "auto";
    btn.style.left = home.left + "px";
    btn.style.top  = home.top + "px";
    return true;
  }

  function ensureHomeReady() {
    const ok = setHomePosition();
    if (!ok) requestAnimationFrame(ensureHomeReady);
  }

  ensureHomeReady();
  window.addEventListener("resize", ensureHomeReady);

  function move() {
    ensureHomeReady();
    clearTimeout(backTimer);

    const pr = parent.getBoundingClientRect();
    const br = btn.getBoundingClientRect();

    const padding = 6;
    const maxX = Math.max(0, pr.width - br.width - padding);
    const maxY = Math.max(0, pr.height - br.height - padding);

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    btn.style.left = x + "px";
    btn.style.top  = y + "px";
    btn.style.transform = `rotate(${(Math.random() * 12 - 6).toFixed(1)}deg)`;

    // return home
    backTimer = setTimeout(() => {
      btn.style.left = home.left + "px";
      btn.style.top  = home.top + "px";
      btn.style.transform = "rotate(0deg)";
    }, 520);
  }

  btn.addEventListener("pointerenter", move);
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    move();
  }, { passive: false });

  btn.addEventListener("mouseleave", () => {
    clearTimeout(backTimer);
    btn.style.left = home.left + "px";
    btn.style.top  = home.top + "px";
    btn.style.transform = "rotate(0deg)";
  });

  // expose recalc (for page2 show)
  return { recalc: ensureHomeReady };
}

// controllers
const no1Ctl = runAway(no1);
const no2Ctl = runAway(no2);

/* Page 1 text */
typeText(document.getElementById("typeText1"), "❤️ ខ្ញុំស្រឡាញ់អ្នក ❤️");
setTimeout(() => {
  typeText(document.getElementById("typeText2"), "តើអ្នកស្រឡាញ់ខ្ញុំវិញទេ?");
  typeText(document.getElementById("partnerOnly"), "ល័ក្ខ ចលនា ❤️", 45);
}, 900);

startBgHearts();

/* Page1 -> Page2 */
yes1.addEventListener("click", (e) => {
  explodeHearts(e.clientX, e.clientY);

  setTimeout(() => {
    page1.classList.add("hidden");
    page2.classList.remove("hidden");

    // ✅ recalc no2 home after page2 is visible (prevents overlap)
    requestAnimationFrame(() => no2Ctl.recalc());

    typeText(document.getElementById("typeText3"), "💍 តើអ្នកព្រមរៀបការជាមួយខ្ញុំទេ?");
    typeText(document.getElementById("names2"), fullName, 45);
  }, 650);
});

/* Surprise modal (romantic) */
function showSurprise() {
  stopBgHearts();

  surpriseText.innerHTML = `
    <div style="line-height:1.65;">
      <div style="font-size:1.25rem;">🌙✨ សម្ដីពិតចេញពីបេះដូង ✨🌙</div>
      <div style="margin-top:10px;"><b>${fullName}</b></div>

      <div style="margin-top:12px;">
        ពេលដែលអ្នក <b>“ព្រមទៅមុខជាមួយគ្នា 💍”</b> នោះ…<br/>
        ខ្ញុំមានអារម្មណ៍ថា ពិភពលោកទាំងមូលកំពុងញញឹម 💖
      </div>

      <div style="margin-top:12px;">
        ខ្ញុំមិនសន្យាថាជីវិតនឹងងាយស្រួលទេ…<br/>
        តែខ្ញុំសន្យាថា <b>ខ្ញុំនឹងកាន់ដៃអ្នក</b> មិនទុកចោលឡើយ 🤍
      </div>

      <div style="margin-top:12px;">
        ស្នេហារបស់យើង… គឺជា “ផ្ទះ” 🏡<br/>
        ហើយឈ្មោះផ្ទះនោះគឺ <b>យើង</b> ❤️
      </div>

       <div style="margin-top:10px;">
        និងអ្វីដែលខ្ញុំតែងតែសុំក្នុងចិត្ត… សូមអូននៅជាមួយខ្ញុំ ❤️♾️
      </div>

      <div style="margin-top:14px; font-size:1.1rem;">
        <b>ជារៀងរហូត</b> ♾️💍
      </div>
      <div style="margin-top:14px;">
        💖 ហើយចាប់ពីថ្ងៃនេះ… ខ្ញុំចង់ឲ្យ ‘យើង’ មានគ្នា រៀងរាល់ថ្ងៃ <b>រាល់វិនាទី</b> ❤️✨
      </div>
       <div style="margin-top:10px;">
        💞 ខ្ញុំមិនចង់ឲ្យអូននៅតែឯងទេ… ព្រោះទីកន្លែងអូន គឺនៅ<b>ក្នុងបេះដូងខ្ញុំជានិច្ច</b> 💞🥺
      </div>
      <div style="margin-top:14px; opacity:0.9;​"><b>— <i>My love for you will never end ♾️❤️</i></b>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

yes2.addEventListener("click", (e) => {
  explodeHearts(e.clientX, e.clientY, 26);
  couple.classList.remove("hidden");
  bgMusic.play();
  setTimeout(showSurprise, 750);
});

/* Close modal */
function closeTheModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  startBgHearts();
}
closeModal.addEventListener("click", closeTheModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeTheModal();
});
