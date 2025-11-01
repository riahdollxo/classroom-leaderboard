(function(){

  const STORAGE_KEY = "money_leaderboard_rows_v2";
  const TITLE_KEY = "money_leaderboard_title_v2";
  const BG_KEY = "money_leaderboard_bg_v2";
  const COLLAPSE_KEY = "money_leaderboard_collapsed_v2";
  const HIDE_KEY = "money_leaderboard_hide_v2";

  // Optional query to clear any old background override
  const qs = new URLSearchParams(location.search);
  if (qs.get("resetbg") === "1") {
    try { localStorage.removeItem(BG_KEY); } catch(e) {}
    // Force embedded background right away
    document.querySelector('.bg-layer').style.backgroundImage = "url('data:')";
  }

  const $ = s => document.querySelector(s);
  const tbody = $("#tbody");
  const addBtn = $("#addBtn");
  const studentName = $("#studentName");
  const clearBtn = $("#clearBtn");
  const exportBtn = $("#exportBtn");
  const importBtn = $("#importBtn");
  const toggle = $("#toggle");
  const hideBtn = $("#hideBtn");
  const bgColor = $("#bgColor");
  const bgUrl = $("#bgUrl");
  const bgFile = $("#bgFile");
  const applyBgBtn = $("#applyBgBtn");
  const resetBgBtn = $("#resetBgBtn");
  const showFlapsChk = $("#showFlapsChk");
  const titleEl = $("#boardTitle");

  function dollars(n){ n = Math.max(0, n|0); return "$" + String(n).padStart(3,"0"); }

  function makeDigitFlaps(digits){
    const cont = document.createElement("div"); cont.className = "flaps";
    const slots = [];
    for (let i=0;i<digits;i++){
      const slot=document.createElement("div"); slot.className="slot";
      const tile=document.createElement("div"); tile.className="tile";
      const front=document.createElement("div"); front.className="face front"; front.textContent="0";
      const back=document.createElement("div"); back.className="face back"; back.textContent="0";
      tile.appendChild(front); tile.appendChild(back);
      slot.appendChild(tile); cont.appendChild(slot);
      slots.push({tile,front,back,val:"0"});
    }

    function setNumber(n, staggerBase=18){
      const s = String(n).padStart(3,"0").slice(-3);
      for (let i=0;i<3;i++){
        const ch = s[i];
        if (slots[i].val===ch) continue;
        slots[i].back.textContent = ch;
        const t=slots[i].tile;
        setTimeout(()=>{
          t.classList.add("flip");
          setTimeout(()=>{
            slots[i].front.textContent = ch;
            t.classList.remove("flip");
            slots[i].val = ch;
          },160);
        }, i*staggerBase);
      }
    }

    return {el:cont, setNumber};
  }

  function enhanceRow(row){
    if (row.__enhanced) return; row.__enhanced = true;
    const wrap = row.querySelector(".pts-wrap");
    const text = row.querySelector(".pts-text");
    const fl = makeDigitFlaps(3);
    wrap.appendChild(fl.el);
    const cur = parseInt(row.getAttribute("data-pts")||"0",10);
    text.textContent = dollars(cur);
    fl.setNumber(cur);
  }

  try{
    const savedBg = JSON.parse(localStorage.getItem(BG_KEY)||"null");
    if (savedBg && savedBg.image)
      document.querySelector('.bg-layer').style.backgroundImage = `url('${savedBg.image}')`;
  }catch(e){}

  // Flaps toggle
  const storedFlaps = localStorage.getItem("money_leaderboard_showflaps")==="1";
  if (storedFlaps){
    document.head.insertAdjacentHTML('beforeend','<style>.flaps{display:flex!important}</style>');
    showFlapsChk.checked=true;
  }

  showFlapsChk.addEventListener("change", (e)=>{
    localStorage.setItem("money_leaderboard_showflaps", e.target.checked?'1':'0');
    location.reload();
  });

  document.addEventListener("visibilitychange", ()=>{
    if (document.visibilityState==='hidden') save();
  });

})();
