const { createClient } = window.supabase;

const CFG = window.LOTJE_CONFIG || {};
const SITE = "www.trekeenlotje.nl";
const $ = (id) => document.getElementById(id);
const COLORS = ["sun", "coral", "mint", "sky", "lilac", "rose"];
const ICONS = ["fork", "cup", "glass", "heart", "pin", "home", "plane", "tree", "film", "music", "book", "ball", "dice", "gift", "cart", "bubbles", "paw", "moon", "star"];
const ICON_NAMES = { fork: "Eten", cup: "Koffie", glass: "Drinken", heart: "Liefde", pin: "Uitje", home: "Thuis", plane: "Reizen", tree: "Natuur", film: "Film", music: "Muziek", book: "Lezen", ball: "Sport", dice: "Spelletjes", gift: "Cadeau", cart: "Boodschappen", bubbles: "Klusjes", paw: "Huisdier", moon: "Avond", star: "Overig" };
const TEMPLATES = [
  { name: "Wat eten we vanavond?", color: "coral", icon: "fork", hint: "Met 6 gerechten erin", fill: ["Pasta", "Wraps", "Curry", "Pannenkoeken", "Soep", "Iets bestellen"] },
  { name: "Wie doet de afwas?", color: "sky", icon: "bubbles", hint: "Gevuld met de groepsleden", fill: "members" },
  { name: "Date-ideeën", color: "rose", icon: "heart", hint: "Met 4 ideeën om te starten", fill: ["Samen koken", "Picknick in het park", "Film in de bioscoop", "Sterren kijken"] },
  { name: "Uitjes in de buurt", color: "mint", icon: "pin", hint: "Lege pot", fill: [] },
  { name: "Welke film kijken we?", color: "lilac", icon: "film", hint: "Lege pot", fill: [] },
];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ================= illustrations ================= */
const cvar=c=>`var(--c-${COLORS.includes(c)?c:"sun"})`;
function iconPath(k,cx,cy,s,col){
  s=s||1;const t=(x,y)=>`${(cx+x*s).toFixed(1)} ${(cy+y*s).toFixed(1)}`;const sw=(2.4*s).toFixed(1);
  const st=`fill="none" stroke="${col||"var(--ink)"}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
  const A=(r,x,y,lg,sw)=>`A${(r*s).toFixed(1)} ${(r*s).toFixed(1)} 0 ${lg} ${sw} ${t(x,y)}`;const fl=`fill="${col||"var(--ink)"}"`;const C=(x,y,r,f)=>`<circle cx="${(cx+x*s).toFixed(1)}" cy="${(cy+y*s).toFixed(1)}" r="${(r*s).toFixed(1)}" ${f?fl:st}/>`;
  switch(k){
    case"cup":return`<path ${st} d="M${t(-8,-4)}L${t(5,-4)}L${t(2,2)}${A(6,-1,8,0,1)}L${t(-2,8)}${A(6,-8,2,0,1)}Z M${t(5,-2)}L${t(7,-2)}${A(3,7,4,0,1)}L${t(5,4)} M${t(-4,-7)}L${t(-4,-9)} M${t(0,-7)}L${t(0,-9)}"/>`;
    case"glass":return`<path ${st} d="M${t(-6,-8)}L${t(6,-8)}L${t(0,1)}Z M${t(0,1)}L${t(0,8)} M${t(-4,8)}L${t(4,8)}"/>`;
    case"home":return`<path ${st} d="M${t(-9,0)}L${t(0,-8)}L${t(9,0)}M${t(-6,-2)}L${t(-6,8)}L${t(6,8)}L${t(6,-2)}M${t(-2,8)}L${t(-2,3)}L${t(2,3)}L${t(2,8)}"/>`;
    case"plane":return`<path ${st} d="M${t(-9,1)}L${t(9,-7)}L${t(3,9)}L${t(0,3)}Z M${t(0,3)}L${t(9,-7)}"/>`;
    case"tree":return`<path ${st} d="M${t(0,-9)}L${t(6,0)}L${t(-6,0)}Z M${t(0,-4)}L${t(8,6)}L${t(-8,6)}Z M${t(0,6)}L${t(0,10)}"/>`;
    case"music":return`<path ${st} d="M${t(-2,6)}L${t(-8,-8)}L${t(8,-10)}L${t(4,4)}"/>${C(-5,6,3)}${C(5,4,3)}`;
    case"book":return`<path ${st} d="M${t(0,-6)}C${t(-3,-9)} ${t(-7,-9)} ${t(-9,-8)}L${t(-9,7)}C${t(-7,6)} ${t(-3,6)} ${t(0,9)}C${t(3,6)} ${t(7,6)} ${t(9,7)}L${t(9,-8)}C${t(7,-9)} ${t(3,-9)} ${t(0,-6)}Z M${t(0,-6)}L${t(0,9)}"/>`;
    case"ball":return`${C(0,0,9)}<path ${st} d="M${t(-9,0)}L${t(9,0)}M${t(0,-9)}C${t(-5,-4)} ${t(-5,4)} ${t(0,9)}M${t(0,-9)}C${t(5,-4)} ${t(5,4)} ${t(0,9)}"/>`;
    case"dice":return`<rect x="${cx-8*s}" y="${cy-8*s}" width="${16*s}" height="${16*s}" rx="${3*s}" ${st}/>${C(-4,-4,1.5,1)}${C(4,4,1.5,1)}${C(0,0,1.5,1)}${C(4,-4,1.5,1)}${C(-4,4,1.5,1)}`;
    case"gift":return`<path ${st} d="M${t(-8,-2)}L${t(8,-2)}L${t(8,9)}L${t(-8,9)}Z M${t(-9,-6)}L${t(9,-6)}L${t(9,-2)}L${t(-9,-2)}Z M${t(0,-6)}L${t(0,9)} M${t(0,-6)}C${t(-2,-11)} ${t(-7,-10)} ${t(-5,-6)} M${t(0,-6)}C${t(2,-11)} ${t(7,-10)} ${t(5,-6)}"/>`;
    case"moon":return`<path ${st} d="M${t(3,-9)}${A(9,8,4,1,0)}${A(7,3,-9,0,1)}Z"/>`;
    case"paw":return`${C(0,4,4.5)}${C(-6,-2,2.2)}${C(-2,-7,2.2)}${C(3,-7,2.2)}${C(7,-2,2.2)}`;
    case"cart":return`<path ${st} d="M${t(-10,-7)}L${t(-6,-7)}L${t(-3,4)}L${t(7,4)}L${t(9,-3)}L${t(-5,-3)}"/>${C(-2,8,1.6,1)}${C(6,8,1.6,1)}`;
    case"fork":return`<path ${st} d="M${t(-8,-8)}L${t(-8,-2)}Q${t(-8,1)} ${t(-5,1)}Q${t(-2,1)} ${t(-2,-2)}L${t(-2,-8)}M${t(-5,-8)}L${t(-5,9)}M${t(5,9)}L${t(5,-8)}Q${t(9,-6)} ${t(9,0)}L${t(5,1)}"/>`;
    case"bubbles":return`<circle cx="${cx-3*s}" cy="${cy+2*s}" r="${6*s}" ${st}/><circle cx="${cx+6*s}" cy="${cy-5*s}" r="${3.5*s}" ${st}/><circle cx="${cx+6*s}" cy="${cy+6*s}" r="${2*s}" ${st}/>`;
    case"heart":return`<path d="M${t(0,8)}C${t(-12,0)} ${t(-9,-10)} ${t(0,-4)}C${t(9,-10)} ${t(12,0)} ${t(0,8)}Z" ${st}/>`;
    case"pin":return`<path d="M${t(0,9)}C${t(-8,0)} ${t(-8,-4)} ${t(-8,-2)}A${8*s} ${8*s} 0 1 1 ${t(8,-2)}C${t(8,-4)} ${t(8,0)} ${t(0,9)}Z" ${st}/><circle cx="${cx}" cy="${cy-2*s}" r="${2.4*s}" ${st}/>`;
    case"film":return`<rect x="${cx-8*s}" y="${cy-6*s}" width="${16*s}" height="${12*s}" rx="${2*s}" ${st}/><path ${st} d="M${t(-8,-2)}L${t(8,-2)}M${t(-3,-6)}L${t(-1,-2)}M${t(3,-6)}L${t(5,-2)}"/>`;
    case"lock":return`<rect x="${(cx-7*s).toFixed(1)}" y="${(cy-2*s).toFixed(1)}" width="${(14*s).toFixed(1)}" height="${(11*s).toFixed(1)}" rx="${(2*s).toFixed(1)}" ${st}/><path ${st} d="M${t(-4,-2)}L${t(-4,-5)}${A(4,4,-5,0,1)}L${t(4,-2)}"/>${C(0,3.5,1.4,1)}`;
    default:return`<path d="M${t(0,-9)}L${t(2.6,-3)}L${t(9,-2.6)}L${t(4,1.8)}L${t(5.6,8.4)}L${t(0,5)}L${t(-5.6,8.4)}L${t(-4,1.8)}L${t(-9,-2.6)}L${t(-2.6,-3)}Z" ${st}/>`;
  }
}
function jar(color,count,seed,icon,animate){
  seed=seed||1;let sd=seed;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  const c=cvar(color);let papers="";const n=Math.min(count||0,18);
  for(let i=0;i<n;i++){const row=Math.floor(i/4),col=i%4;
    const x=25+col*18+(rnd()-.5)*6,y=116-row*12+(rnd()-.5)*4,r=(rnd()-.5)*50;
    papers+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="16" height="9" rx="1" fill="${i%3===0?c:i%3===1?"var(--paper-edge)":"var(--surface)"}" stroke="var(--ink)" stroke-opacity=".35" stroke-width=".8" transform="rotate(${r.toFixed(0)} ${(x+8).toFixed(1)} ${(y+4.5).toFixed(1)})"/>`}
  const lab=icon?`<g opacity=".85">${iconPath(icon,60,n>8?62:76,.9,c)}</g>`:"";
  return`<svg viewBox="0 0 120 140" aria-hidden="true">
    <path d="M36 20h48v6c14 4 22 14 22 28v58c0 13-10 24-24 24H38c-14 0-24-11-24-24V54c0-14 8-24 22-28z" fill="var(--surface)" fill-opacity=".6"/>
    <g>${papers}</g>
    <path d="M36 20h48v6c14 4 22 14 22 28v58c0 13-10 24-24 24H38c-14 0-24-11-24-24V54c0-14 8-24 22-28z" fill="none" stroke="var(--ink)" stroke-width="2.4"/>
    ${lab}
    <rect x="31" y="6" width="58" height="14" rx="3" fill="${c}" stroke="var(--ink)" stroke-width="2.4"/>
  </svg>`;
}
/* a flat person: head + hair + torso */
function person(x,y,s,shirt,skin,hair,flip,waving){
  const f=flip?-1:1;
  return`<g transform="translate(${x} ${y}) scale(${s*f} ${s})">
    <path d="M-20 60c0-22 9-34 20-34s20 12 20 34z" fill="${shirt}"/>
    ${waving?`<g class="wave"><path d="M14 40c6-6 12-20 14-30" stroke="${skin}" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="28" cy="8" r="5" fill="${skin}"/></g>`:""}
    <rect x="-5" y="18" width="10" height="10" rx="3" fill="${skin}"/>
    <circle cx="0" cy="10" r="13" fill="${skin}"/>
    <path d="M-13 9c0-10 6-15 13-15s14 4 14 13c-6-1-12-5-14-9-2 5-7 9-13 11z" fill="${hair}"/>
    <circle cx="4" cy="11" r="1.6" fill="var(--hair)"/><circle cx="-4" cy="11" r="1.6" fill="var(--hair)"/>
    <path d="M-3 16q3 3 6 0" stroke="var(--hair)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>`;
}
function face(i,label){
  const bg=cvar(COLORS[i%6]),l=String(label||"?").trim().charAt(0).toUpperCase()||"?";
  return`<svg viewBox="0 0 40 40" role="img" aria-label="${esc(label||"lid")}"><circle cx="20" cy="20" r="19" fill="${bg}" stroke="var(--bg)" stroke-width="2"/><text x="20" y="25.5" text-anchor="middle" font-family="Figtree, system-ui, sans-serif" font-weight="700" font-size="15" fill="#fff">${esc(l)}</text></svg>`;
}
function slipShape(x,y,r,color,cls,d){return`<g class="${cls||""} ${d||""}"><rect x="${x}" y="${y}" width="26" height="16" rx="2" fill="var(--c-${color})" transform="rotate(${r} ${x+13} ${y+8})"/><path d="M${x+5} ${y+6}h14M${x+5} ${y+10}h9" stroke="rgba(0,0,0,.25)" stroke-width="1.6" transform="rotate(${r} ${x+13} ${y+8})" stroke-linecap="round"/></g>`}
function sparkle(x,y,s,color,d){return`<path class="twinkle ${d||""}" d="M${x} ${y-s}L${x+s*.3} ${y-s*.3}L${x+s} ${y}L${x+s*.3} ${y+s*.3}L${x} ${y+s}L${x-s*.3} ${y+s*.3}L${x-s} ${y}L${x-s*.3} ${y-s*.3}Z" fill="var(--c-${color})"/>`}

function floatSlip(x,y,r,fill,cls){return`<g class="${cls}"><rect x="${x}" y="${y}" width="30" height="18" rx="1.5" fill="${fill}" stroke="var(--ink)" stroke-width="1.6" transform="rotate(${r} ${x+15} ${y+9})"/></g>`}
function sceneLogin(){
  return`<svg viewBox="0 0 300 220" aria-hidden="true">
    <circle cx="150" cy="122" r="92" fill="var(--sceneblob)"/>
    <g transform="translate(96 66) scale(.9)">${jar("sun",11,4,"",false)}</g>
    ${floatSlip(112,30,-14,"var(--surface)","float")}${floatSlip(160,18,10,"var(--c-sun)","float d1")}${floatSlip(196,52,-6,"var(--paper-edge)","float d2")}
  </svg>`;
}
function sceneHero(){
  return`<svg viewBox="0 0 520 200" aria-hidden="true">
    <circle cx="260" cy="118" r="78" fill="var(--sceneblob)"/>
    <g transform="translate(140 74) scale(.78)">${jar("sun",7,2,"",false)}</g>
    <g transform="translate(213 46) scale(1)">${jar("coral",12,5,"",false)}</g>
    <g transform="translate(300 74) scale(.78)">${jar("sky",5,3,"",false)}</g>
    ${floatSlip(250,12,-12,"var(--surface)","float")}${floatSlip(296,26,9,"var(--c-coral)","float d1")}
  </svg>`;
}
function stepIll(n){
  const wrap=b=>`<svg viewBox="0 0 140 96" aria-hidden="true"><circle cx="70" cy="52" r="40" fill="var(--blob)"/>${b}</svg>`;
  if(n===1)return wrap(`<g transform="translate(36 34)">${face(0,"A").replace(/<\/?svg[^>]*>/g,"")}</g><g transform="translate(64 34)">${face(2,"B").replace(/<\/?svg[^>]*>/g,"")}</g><circle cx="110" cy="54" r="0"/>`);
  if(n===2)return wrap(`<g transform="translate(46 30) scale(.45)">${jar("mint",5,3,"",false)}</g><g class="dropin">${floatSlip(56,6,-8,"var(--surface)","")}</g>`);
  return wrap(`<g transform="translate(46 30) scale(.45)">${jar("rose",8,5,"",false)}</g><g class="popout"><rect x="54" y="8" width="34" height="20" rx="1.5" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.6"/><path d="M60 15h20M60 20h12" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round"/></g>`);
}
function emptyJarIll(){return`<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="64" r="48" fill="var(--blob)"/><g transform="translate(26 12) scale(.58)">${jar("sun",0,1,"",false)}</g></svg>`}
function raysSVG(){return""}



/* ================= setup ================= */
if (!CFG.supabaseUrl || !CFG.supabaseAnonKey || CFG.supabaseUrl.includes("JOUW")) {
  $("view").innerHTML = `<section class="login"><h1>Bijna klaar</h1><p>Vul in <b>config.js</b> je Supabase-adres en sleutel in. Zie de handleiding.</p></section>`;
  throw new Error("config ontbreekt");
}
const sb = createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

/* ================= state ================= */
let session = null, me = { id: null, name: "", email: "" };
let view = "loading", gid = null, pid = null;
let groups = [], slips = {}, counts = {}, names = {}, activity = [];
let spinning = false, confirmKey = null, lastResult = null, openPanel = null;
let loginEmail = "", loginStep = "email", channel = null, booted = false;
const DEFAULT_PREFS = { email_enabled: true, frequency: "direct", on_pot: true, on_slips: false, on_draw: true, on_join: true, on_scheduled: true };
let prefs = { ...DEFAULT_PREFS }, wantNotif = location.hash === "#meldingen";
const pendingCode = (() => { try { const c = new URLSearchParams(location.search).get("code"); if (c) { localStorage.setItem("lotje-code", c.toUpperCase()); history.replaceState(null, "", location.pathname); } return localStorage.getItem("lotje-code"); } catch (e) { return null; } })();

const G = () => groups.find((g) => g.id === gid) || null;
const P = () => (G()?.pots || []).find((p) => p.id === pid) || null;
const who = (id) => (id ? (id === me.id ? "jij" : names[id] || "iemand") : "");
const myName = () => me.name || (me.email ? me.email.split("@")[0] : "jij");
const firstName = () => myName().split(" ")[0];
function when(t) { try { return new Date(t).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" }); } catch (e) { return ""; } }
function ago(t) { const m = Math.round((Date.now() - new Date(t)) / 60000); if (m < 1) return "net"; if (m < 60) return m + " min geleden"; const h = Math.round(m / 60); if (h < 24) return h + " uur geleden"; return when(t); }
function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function recall(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
function hash(s) { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 9973; return h + 1; }
function errText(e, f) { console.warn(e); return f; }
function avatarHTML() { return `<span class="ini">${esc(myName().charAt(0).toUpperCase())}</span>`; }

/* ================= navigation ================= */
function go(v, g, p) {
  view = v; gid = g ?? gid; pid = p ?? pid;
  if (v === "home" || v === "login" || v === "notif" || v === "account") { pid = null; if (v !== "notif") gid = null; }
  if (v === "group") pid = null;
  confirmKey = null; lastResult = null; openPanel = null;
  if (["home", "group", "pot"].includes(v)) store("lotje-nav", { view, gid, pid });
  if (v === "group" || v === "pot") loadSlips(gid);
  shell(); window.scrollTo(0, 0);
}
$("backBtn").onclick = () => (view === "pot" ? go("group", gid) : go("home"));
$("logoBtn").onclick = () => go(session ? "home" : "login");
$("meBtn").onclick = () => go("account");
$("bellBtn").onclick = () => go("notif");
$("logoJar").innerHTML = jar("sun", 6, 3, "", false);

/* ================= screens ================= */
function shell() {
  const inApp = !!session && !["login", "name", "loading"].includes(view);
  $("backBtn").hidden = !inApp || view === "home";
  $("meBtn").hidden = !inApp; $("bellBtn").hidden = !inApp;
  if (inApp) $("meBtn").innerHTML = `${avatarHTML()}<span>${esc(firstName())}</span>`;
  updateBadge();
  const v = $("view");
  if (view === "loading") { v.innerHTML = `<section class="login"><div class="scene">${sceneLogin()}</div><p class="muted">Even laden…</p></section>`; return; }
  if (view === "login") {
    v.innerHTML = `<section class="login">
      <div class="scene">${sceneLogin()}</div>
      <h1>Trek een <em>lotje</em></h1>
      <p>Verzamel ideeën, namen of klusjes in een pot en laat het lot beslissen. Samen met je vrienden, huisgenoten of je lief.</p>
      ${pendingCode ? `<p class="demo">Je bent uitgenodigd voor een groep. Log in om mee te doen.</p>` : ""}
      ${loginStep === "email" ? `
      <form class="panel" id="loginForm" style="width:min(380px,100%);text-align:left">
        <label for="lEmail">Je e-mailadres<input id="lEmail" type="email" required autocomplete="email" placeholder="naam@voorbeeld.nl" value="${esc(loginEmail)}"></label>
        <button class="btn primary big" type="submit" id="lBtn">Stuur me een inlogcode</button>
        <p class="fine">Geen wachtwoord nodig. Je krijgt een mail met een code van 6 cijfers.</p>
        <p class="msg" id="lMsg" aria-live="polite"></p>
      </form>` : `
      <form class="panel" id="codeForm" style="width:min(380px,100%);text-align:left">
        <label for="lCode">Vul de code uit je mail in<input id="lCode" class="code-in" inputmode="numeric" autocomplete="one-time-code" maxlength="8" required placeholder="123456"></label>
        <button class="btn primary big" type="submit" id="cBtn">Inloggen</button>
        <p class="fine">Gestuurd naar ${esc(loginEmail)}. Niks gekregen? Kijk in je spam of <button class="linkbtn" type="button" data-act="loginBack">probeer opnieuw</button>.</p>
        <p class="msg" id="lMsg" aria-live="polite"></p>
      </form>`}
    </section>`;
  } else if (view === "name") {
    v.innerHTML = `<section class="login">
      <div class="scene">${sceneLogin()}</div>
      <h1>Hoe heet je?</h1>
      <p>Zo zien je groepsleden wie wat in de pot heeft gedaan.</p>
      <form class="panel" id="nameForm" style="width:min(380px,100%);text-align:left">
        <label for="nName">Je naam<input id="nName" maxlength="40" required autocomplete="given-name" placeholder="Bijv. Rosalie"></label>
        <button class="btn primary big" type="submit">Verder</button>
        <p class="msg" id="nMsg" aria-live="polite"></p>
      </form></section>`;
  } else if (view === "account") {
    v.innerHTML = `<section class="section"><span class="eyebrow">Account</span><h1 style="font-size:clamp(2rem,7vw,2.8rem)">${esc(myName())}</h1><p class="muted">${esc(me.email)}</p></section>
      <form class="panel" id="nameForm"><label for="nName">Je naam<input id="nName" maxlength="40" required value="${esc(me.name)}"></label>
        <div class="actions"><button class="btn primary" type="submit">Opslaan</button></div><p class="msg" id="nMsg" aria-live="polite"></p></form>
      <section class="section"><span class="eyebrow">Op je telefoon</span><p class="muted">Zet Trek een lotje op je beginscherm. iPhone: tik in Safari op Deel en dan "Zet op beginscherm". Android: menu en dan "App installeren".</p></section>
      <section class="section"><span class="eyebrow">Meldingen</span><p class="muted">Kies welke mails je krijgt.</p><p><button class="btn" type="button" data-act="toNotif">Meldingen instellen</button></p></section>
      <p><button class="btn" type="button" data-act="logout">Uitloggen</button></p>
      <section class="panel danger-zone">
        <h2 style="font-size:1.25rem">Account verwijderen</h2>
        <p class="muted" style="font-size:.92rem">Je naam, je e-mailadres, je lidmaatschappen en je instellingen worden gewist. Lotjes en potten die je maakte blijven in de groep staan, zonder je naam. Een groep waar daarna niemand meer in zit, wordt ook verwijderd. Dit kun je niet terugdraaien.</p>
        ${confirmKey === "delAccount" ? `
        <label for="delConfirm"><span>Typ <b>VERWIJDER</b> om te bevestigen</span><input id="delConfirm" autocomplete="off" placeholder="VERWIJDER"></label>
        <div class="actions"><button class="btn danger" type="button" data-act="delAccountGo">Verwijder mijn account</button><button class="btn" type="button" data-act="delAccountCancel">Annuleren</button></div>`
        : `<div class="actions"><button class="btn danger-outline" type="button" data-act="delAccount">Account verwijderen</button></div>`}
        <p class="msg" id="delMsg" aria-live="polite"></p>
      </section>`;
  } else if (view === "home") {
    v.innerHTML = `
    <section class="hero">
      <div class="scene">${sceneHero()}</div>
      <h1>Hoi ${esc(firstName())}! <em>Wat laat je het lot beslissen?</em></h1>
      <p>Open een groep en trek een lotje, of begin iets nieuws.</p>
    </section>
    <section class="section">
      <div class="actions">
        <button class="btn primary" type="button" data-act="panel" data-p="newGroup">+ Nieuwe groep</button>
        <button class="btn" type="button" data-act="panel" data-p="join">Ik heb een code</button>
      </div>
      <form class="panel" id="newGroup" hidden>
        <label for="ngName">Hoe heet je groep?<input id="ngName" maxlength="40" required placeholder="Bijv. Wij tweeën, Huisgenoten, Buurtclub"></label>
        <div class="actions"><button class="btn primary" type="submit">Groep maken</button><button class="btn" type="button" data-act="panel" data-p="">Annuleren</button></div>
      </form>
      <form class="panel" id="join" hidden>
        <label for="jCode">Vul de code in die je van iemand kreeg<input id="jCode" class="code-in" maxlength="8" required placeholder="KX7PQM" autocomplete="off"></label>
        <div class="actions"><button class="btn primary" type="submit">Doe mee</button><button class="btn" type="button" data-act="panel" data-p="">Annuleren</button></div>
      </form>
      <p class="msg" id="homeMsg" aria-live="polite"></p>
    </section>
    <section class="section"><span class="eyebrow">Jouw groepen</span><div id="groupList"></div></section>`;
  } else if (view === "notif") {
    v.innerHTML = `<section class="section"><span class="eyebrow">Meldingen</span><h1 style="font-size:clamp(2rem,7vw,2.8rem)">Meldingen</h1>
      <p class="muted">Je krijgt meldingen per e-mail op <b>${esc(me.email)}</b>. Kies hieronder wat je wilt ontvangen.</p></section>
      <section class="section" id="prefBox"></section>
      <section class="section"><span class="eyebrow">Per groep</span><p class="muted" style="font-size:.88rem">Zet een groep uit en je krijgt over die groep geen mail meer.</p><div class="toggles" id="togs"></div></section>
      <section class="section"><span class="eyebrow">Recent in je groepen</span><ul class="nlist" id="nlist"></ul></section>`;
    const prevSeen = recall("lotje-seen") || 0; setTimeout(() => { store("lotje-seen", Date.now()); updateBadge(); }, 1500);
    renderNotif(prevSeen); return;
  } else if (view === "group") {
    v.innerHTML = `
    <section class="ghead">
      <div><span class="eyebrow">Groep</span><h1 id="gTitle"></h1></div>
      <div class="faces" id="gFaces"></div>
      <div class="share" id="shareBox"></div>
      <div class="panel invite" id="invite" hidden>
        <h2 style="font-size:1.3rem">Iemand uitnodigen</h2>
        <p class="muted" style="font-size:.9rem">Kopieer dit bericht en stuur het via WhatsApp of een andere app. Met de link of de code doen ze meteen mee.</p>
        <textarea id="invText" readonly></textarea>
        <div class="actions"><button class="btn primary" type="button" data-act="copyInvite">Kopieer bericht</button><button class="btn" type="button" data-act="panel" data-p="">Sluiten</button></div>
      </div>
    </section>
    <section class="section">
      <span class="eyebrow">Tik op een pot om te trekken</span>
      <div class="shelfbg"><div class="pots" id="potGrid"></div></div>
    </section>
    <form class="panel" id="newPot" hidden>
      <h2 style="font-size:1.35rem">Nieuwe pot</h2>
      <label class="check" for="npSecret"><input type="checkbox" id="npSecret"><span><b>Geheime pot</b><small>Niemand ziet wat erin zit, behalve je eigen lotjes. Pas bij het trekken komt het lotje tevoorschijn.</small></span></label>
      <p class="muted" style="font-size:.9rem">Kies een kant-en-klare pot:</p>
      <div class="templates">${TEMPLATES.map((t, i) => `<button type="button" class="tpl" data-act="tpl" data-i="${i}">${jar(t.color, t.fill === "members" ? 3 : t.fill.length, i + 2, "", false)}<span>${esc(t.name)}<small>${esc(t.hint)}</small></span></button>`).join("")}</div>
      <p class="muted" style="font-size:.9rem;margin-top:6px">Of maak je eigen pot:</p>
      <label for="npName">Naam<input id="npName" maxlength="40" placeholder="Bijv. Wie kiest de muziek?"></label>
      <div><span style="font-weight:700;font-size:.88rem">Plaatje op de pot</span>
        <div class="icons" role="radiogroup" style="margin-top:6px">${ICONS.map((k, i) => `<label><input type="radio" name="npIcon" id="ic-${k}" value="${k}"${k === "star" ? " checked" : ""}><span class="ic" title="${ICON_NAMES[k]}" aria-label="${ICON_NAMES[k]}"><svg viewBox="0 0 30 30" aria-hidden="true">${iconPath(k, 15, 15, 1.1)}</svg></span></label>`).join("")}</div></div>
      <div class="actions"><button class="btn primary" type="submit">Maak pot</button><button class="btn" type="button" data-act="panel" data-p="">Annuleren</button></div>
      <p class="msg" id="potMsg" aria-live="polite"></p>
    </form>
    <p style="text-align:center"><button class="linkbtn danger" type="button" data-act="leave" id="leaveBtn">Groep verlaten</button></p>`;
  } else if (view === "pot") {
    v.innerHTML = `
    <section class="phead"><span class="eyebrow" id="pGroup"></span><h1 id="pTitle"></h1><p class="muted" id="pSecret" hidden style="margin-top:6px">Geheime pot: je ziet alleen je eigen lotjes. De rest blijft verborgen tot het getrokken wordt.</p></section>
    <section class="stage" id="stage">
      <div class="bigjar" id="bigJar"></div>
      <span class="count" id="pCount"></span>
      <button class="draw" type="button" id="drawBtn" data-act="draw">Trek een lotje!</button>
      <div class="result" id="result"></div>
      <p class="last" id="lastDraw"></p>
      <p class="fair">Eerlijk getrokken: elk lotje heeft precies evenveel kans. De server kiest met echt toeval, niet je telefoon.</p>
    </section>
    <section class="section" id="planBox"></section>
    <section class="section">
      <h2 style="font-size:1.4rem">Lotjes erin</h2>
      <form class="inline" id="addSlip" autocomplete="off">
        <input id="slipIn" maxlength="300" placeholder="Typ iets, bijv. Pizza" aria-label="Nieuw lotje">
        <button class="btn primary" type="submit">Erin!</button>
      </form>
      <p class="muted" style="font-size:.85rem">Meerdere tegelijk? Scheid ze met komma's. Of <button class="linkbtn" type="button" data-act="members">doe alle groepsleden erin</button>.</p>
      <p class="msg" id="slipMsg" aria-live="polite"></p>
      <ul class="slips" id="slipList"></ul>
      <details id="doneBox"><summary id="doneSum"></summary><ul class="slips" id="doneList"></ul></details>
    </section>
    <p style="text-align:center"><button class="linkbtn danger" type="button" data-act="delPot" id="delPotBtn">Pot verwijderen</button></p>`;
  }
  bindForms(); refresh();
}

function refresh() {
  if (view === "home") refreshHome(); else if (view === "group") refreshGroup(); else if (view === "pot") refreshPot(); else if (view === "notif") renderNotif();
  ["newGroup", "join", "newPot", "invite"].forEach((id) => { if ($(id)) $(id).hidden = openPanel !== id; });
  if (openPanel === "invite") updateInvite();
  updateBadge();
}
const realName = (id) => (id === me.id ? myName() : names[id] || "?");
function facesFor(g, max) { return (g.members || []).slice(0, max).map((m) => face(hash(m.user_id), realName(m.user_id))).join(""); }
function refreshHome() {
  const el = $("groupList"); if (!el) return;
  if (!groups.length) {
    el.innerHTML = `<ol class="steps">
      <li style="--sc:var(--c-coral)">${stepIll(1)}<span class="n">1</span><b>Maak een groep</b><span>Voor je vrienden, huisgenoten of jou en je lief.</span></li>
      <li style="--sc:var(--c-mint)">${stepIll(2)}<span class="n">2</span><b>Vul een pot</b><span>Restaurants, date-ideeën, wie de afwas doet: alles kan.</span></li>
      <li style="--sc:var(--c-sky)">${stepIll(3)}<span class="n">3</span><b>Trek een lotje</b><span>Schud de pot en laat het lot beslissen.</span></li>
    </ol>`; return;
  }
  el.innerHTML = `<div class="gcards">${groups.map((g, gi) => {
    const ps = g.pots || [];
    return `<button type="button" class="gcard" style="--gc:var(--c-${["lilac", "coral", "mint", "sky", "rose", "sun"][gi % 6]})" data-act="openGroup" data-id="${esc(g.id)}">
      <h3>${esc(g.name)}</h3><span class="faces">${facesFor(g, 4)}</span>
      <div class="shelf">${ps.length ? ps.map((p) => `<span class="minijar">${jar(p.color, 5, hash(p.id), "", false)}<span>${esc(p.name)}</span></span>`).join("") : `<span class="muted" style="font-size:.88rem">Nog geen potten. Open de groep om er een te maken.</span>`}</div>
      <span class="btn small primary go">Open groep →</span>
    </button>`;
  }).join("")}</div>`;
}
function refreshGroup() {
  const g = G(); if (!g) { go("home"); return; }
  $("gTitle").textContent = g.name;
  $("gFaces").innerHTML = facesFor(g, 5);
  const m = (g.members || []).length;
  $("shareBox").innerHTML = `<span>Vrienden erbij? Deel deze code:</span><span class="code" id="codeTxt">${esc(g.code)}</span>
    <button class="btn small" type="button" data-act="copy">Kopieer</button><button class="btn small primary" type="button" data-act="panel" data-p="invite">Nodig iemand uit</button><span class="muted">${m} ${m === 1 ? "lid" : "leden"}</span>`;
  $("potGrid").innerHTML = (g.pots || []).map((p) => {
    const n = p.id in counts ? counts[p.id] : null;
    return `<button type="button" class="pot" data-act="openPot" data-id="${esc(p.id)}">${jar(p.color, n ?? 3, hash(p.id), p.secret ? "lock" : p.icon || "star", true)}<b>${esc(p.name)}</b><small>${n == null ? "…" : n === 1 ? "1 lotje" : n + " lotjes"}${p.secret ? " · geheim" : ""}${p.schedule_at ? " · gepland" : ""}</small></button>`;
  }).join("") + `<button type="button" class="pot new" data-act="panel" data-p="newPot"><svg viewBox="0 0 120 140" aria-hidden="true"><path d="M36 20h48v6c14 4 22 14 22 28v58c0 13-10 24-24 24H38c-14 0-24-11-24-24V54c0-14 8-24 22-28z" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="7 6"/><circle cx="60" cy="80" r="18" fill="var(--brand)"/><path d="M60 70v20M50 80h20" stroke="var(--brand-ink)" stroke-width="4" stroke-linecap="round"/></svg>Nieuwe pot</button>`;
  $("leaveBtn").textContent = confirmKey === "leave" ? "Zeker weten? Tik nog een keer" : "Groep verlaten";
}
function refreshPot() {
  const p = P(); if (!p) { if (G()) go("group", gid); else go("home"); return; }
  const all = slips[pid] || [], open = all.filter((s) => !s.done), done = all.filter((s) => s.done);
  const total = pid in counts ? counts[pid] : open.length, hidden = Math.max(0, total - open.length);
  $("stage").style.setProperty("--potc", cvar(p.color));
  $("pGroup").textContent = G()?.name || "";
  $("pTitle").textContent = p.name;
  $("pSecret").hidden = !p.secret;
  if (!spinning) $("bigJar").innerHTML = jar(p.color, total, hash(p.id), p.icon || "star", true);
  $("pCount").textContent = total === 0 ? "De pot is leeg" : total === 1 ? "1 lotje in de pot" : total + " lotjes in de pot";
  $("drawBtn").disabled = spinning || !total;
  const d = p.last_draw;
  $("lastDraw").textContent = d && d.name && !lastResult ? `Laatst getrokken: ${d.name} · ${when(d.at)}${d.auto ? " · automatisch" : d.by ? " · door " + who(d.by) : ""}` : "";
  if (!lastResult) $("result").innerHTML = "";
  $("slipList").innerHTML = total ? open.map(slipLi).join("") + (hidden ? `<li class="secret"><span>${hidden === 1 ? "1 geheim lotje" : hidden + " geheime lotjes"} van anderen</span></li>` : "") : `<li class="emptyill" style="background:none;box-shadow:none;border-radius:18px;rotate:0deg">${emptyJarIll()}<span>Nog niks in deze pot. Typ hierboven je eerste lotje.</span></li>`;
  $("doneBox").hidden = !done.length;
  $("doneSum").textContent = `Uit de pot gehaald (${done.length})`;
  $("doneList").innerHTML = done.map((s) => `<li class="done"><span>${esc(s.name)}</span><button class="x back" type="button" data-act="putBack" data-id="${esc(s.id)}">Terug erin</button></li>`).join("");
  $("delPotBtn").textContent = confirmKey === "delPot" ? "Zeker weten? Alle lotjes gaan weg" : "Pot verwijderen";
  renderPlan(p);
}
const REPEAT = { once: "Eenmalig", daily: "Elke dag", weekly: "Elke week", monthly: "Elke maand" };
const pad2 = (n) => String(n).padStart(2, "0");
function fmtWhen(iso) { const d = new Date(iso); return d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" }) + " om " + d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }); }
function renderPlan(p) {
  const box = $("planBox"); if (!box) return;
  if (openPanel === "plan") {
    const base = p.schedule_at ? new Date(p.schedule_at) : new Date(Date.now() + 86400000);
    if (!p.schedule_at) base.setHours(19, 0, 0, 0);
    const dv = `${base.getFullYear()}-${pad2(base.getMonth() + 1)}-${pad2(base.getDate())}`, tv = `${pad2(base.getHours())}:${pad2(base.getMinutes())}`;
    const today = new Date(); const minD = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;
    box.innerHTML = `<form class="panel" id="planForm">
      <h2 style="font-size:1.3rem">Automatisch trekken</h2>
      <p class="muted" style="font-size:.9rem">Op het gekozen moment trekt Trek een lotje vanzelf een lotje uit deze pot. Iedereen in de groep krijgt de uitslag per mail.</p>
      <div class="two"><label for="plDate">Datum<input type="date" id="plDate" required min="${minD}" value="${dv}"></label>
      <label for="plTime">Tijd<input type="time" id="plTime" required value="${tv}"></label></div>
      <label for="plRepeat">Herhalen<select id="plRepeat">${Object.entries(REPEAT).map(([k, v]) => `<option value="${k}"${(p.schedule_repeat || "once") === k ? " selected" : ""}>${v}</option>`).join("")}</select></label>
      <label class="check" for="plTake"><input type="checkbox" id="plTake"${p.schedule_take_out ? " checked" : ""}><span><b>Haal het getrokken lotje uit de pot</b><small>Zo komt hetzelfde lotje niet nog een keer.</small></span></label>
      <div class="actions"><button class="btn primary" type="submit">Opslaan</button><button class="btn" type="button" data-act="panel" data-p="">Annuleren</button></div>
      <p class="msg" id="plMsg" aria-live="polite"></p>
    </form>`;
    bindForms(); return;
  }
  if (p.schedule_at) {
    box.innerHTML = `<div class="plan"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="var(--ink)" stroke-width="2.4"/><path d="M20 11v9l6 4" stroke="var(--ink)" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>
      <div><b>Automatische trekking</b><span>${esc(fmtWhen(p.schedule_at))}</span><small>${REPEAT[p.schedule_repeat] || "Eenmalig"}${p.schedule_take_out ? " · getrokken lotje gaat uit de pot" : ""}</small></div>
      <div class="plan-act"><button class="btn small" type="button" data-act="panel" data-p="plan">Wijzigen</button><button class="btn small" type="button" data-act="planStop">${confirmKey === "planStop" ? "Zeker?" : "Stoppen"}</button></div></div>`;
  } else {
    box.innerHTML = `<button class="planbtn" type="button" data-act="panel" data-p="plan"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="var(--ink)" stroke-width="2.4"/><path d="M20 11v9l6 4" stroke="var(--ink)" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg><span><b>Plan een automatische trekking</b><small>Kies een datum en tijd, dan trekt de app vanzelf</small></span></button>`;
  }
}
function slipLi(s) {
  const sure = confirmKey === "slip:" + s.id;
  return `<li><span>${esc(s.name)}</span><button class="x${sure ? " sure" : ""}" type="button" data-act="delSlip" data-id="${esc(s.id)}" aria-label="Verwijder ${esc(s.name)}">${sure ? "Weg?" : "×"}</button></li>`;
}
function showResult(s) {
  lastResult = s;
  $("result").innerHTML = `<div class="slip pop"><span class="eyebrow">Het lot heeft gesproken</span><div class="big">${esc(s.name)}</div>${s.created_by && s.created_by !== me.id ? `<span class="muted" style="font-size:.85rem">lotje van ${esc(who(s.created_by))}</span>` : ""}</div>
    <div class="actions" style="justify-content:center">
      <button class="btn small" type="button" data-act="draw">Nog een keer</button>
      <button class="btn small" type="button" data-act="takeOut" data-id="${esc(s.id)}">Haal uit de pot</button>
    </div>`;
  $("lastDraw").textContent = "";
}

/* ---------- notifications ---------- */
const mutedIds = () => groups.filter((g) => (g.members || []).some((m) => m.user_id === me.id && m.muted)).map((g) => g.id);
function unread() { const seen = recall("lotje-seen") || 0, mu = mutedIds(); return activity.filter((a) => a.user_id !== me.id && new Date(a.created_at) > seen && !mu.includes(a.group_id)).length; }
function updateBadge() { const n = view === "notif" ? 0 : unread(), b = $("badge"); if (!b) return; b.hidden = !n; b.textContent = n > 9 ? "9+" : n; }
const PREF_TYPES = [
  ["on_pot", "Nieuwe pot", "Iemand maakt een nieuwe pot in je groep"],
  ["on_slips", "Nieuwe lotjes", "Iemand doet lotjes in een pot"],
  ["on_draw", "Lotje getrokken", "Iemand trekt een lotje, met de uitslag"],
  ["on_scheduled", "Geplande trekking", "De uitslag van een automatische trekking"],
  ["on_join", "Nieuw groepslid", "Iemand doet mee met je groep"],
];
function renderPrefs() {
  const box = $("prefBox"); if (!box) return; const on = prefs.email_enabled;
  box.innerHTML = `<div class="toggles">
    <div class="tog big"><span>Meldingen per e-mail<small>Zet alles in één keer aan of uit</small></span><button class="switch" type="button" role="switch" aria-checked="${on}" aria-label="Meldingen per e-mail" data-act="pref" data-k="email_enabled"></button></div>
  </div>
  <div class="${on ? "" : "dim"}">
    <span class="eyebrow">Hoe vaak</span>
    <div class="seg" role="radiogroup" aria-label="Hoe vaak">
      <button type="button" role="radio" aria-checked="${prefs.frequency === "direct"}" data-act="freq" data-v="direct" ${on ? "" : "disabled"}><b>Meteen</b><small>Een mail zodra er iets gebeurt</small></button>
      <button type="button" role="radio" aria-checked="${prefs.frequency === "daily"}" data-act="freq" data-v="daily" ${on ? "" : "disabled"}><b>Dagelijks overzicht</b><small>Eén mail per dag om 19:00</small></button>
    </div>
    <span class="eyebrow" style="display:block;margin-top:18px">Waarover</span>
    <div class="toggles" style="margin-top:8px">${PREF_TYPES.map(([k, t, d]) => `<div class="tog"><span>${t}<small>${d}</small></span><button class="switch" type="button" role="switch" aria-checked="${!!prefs[k]}" aria-label="${t}" data-act="pref" data-k="${k}" ${on ? "" : "disabled"}></button></div>`).join("")}</div>
  </div>
  <p class="msg" id="prefMsg" aria-live="polite"></p>`;
}
async function savePrefs() {
  const { error } = await sb.from("notification_prefs").upsert({ user_id: me.id, ...prefs, updated_at: new Date().toISOString() });
  const m = $("prefMsg"); if (m) m.textContent = error ? "Opslaan lukte niet. Probeer het nog eens." : "Opgeslagen.";
}
async function loadPrefs() {
  const { data } = await sb.from("notification_prefs").select("email_enabled,frequency,on_pot,on_slips,on_draw,on_join,on_scheduled").eq("user_id", me.id).maybeSingle();
  prefs = { ...DEFAULT_PREFS, ...(data || {}) };
}
function actorHTML(a) { return a.user_id ? face(hash(a.user_id), realName(a.user_id)) : `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="var(--ink)"/><circle cx="20" cy="21" r="9" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M20 16v5l3 2" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`; }
function actText(a) { return a.user_id ? `<b>${esc(who(a.user_id) || "Iemand")}</b> ${esc(a.text)}` : esc(a.text); }
function renderNotif(seen) {
  renderPrefs();
  const t = $("togs"); if (!t) return; seen = seen ?? (recall("lotje-seen") || 0);
  const mu = mutedIds();
  t.innerHTML = groups.length ? groups.map((g) => `<div class="tog"><span>${esc(g.name)}</span><button class="switch" type="button" role="switch" aria-checked="${!mu.includes(g.id)}" aria-label="Meldingen voor ${esc(g.name)}" data-act="mute" data-id="${esc(g.id)}"></button></div>`).join("") : `<p class="muted">Je zit nog niet in een groep.</p>`;
  const gname = (id) => groups.find((g) => g.id === id)?.name || "";
  const list = activity.filter((a) => a.user_id !== me.id).slice(0, 40);
  $("nlist").innerHTML = list.length ? list.map((a) => `<li class="${new Date(a.created_at) > seen && !mu.includes(a.group_id) ? "new" : ""}">${actorHTML(a)}<div>${actText(a)}<small>${esc(gname(a.group_id))} · ${ago(a.created_at)}</small></div></li>`).join("")
    : `<li class="emptyill" style="background:none">${emptyJarIll()}<span>Nog geen meldingen. Zodra iemand iets doet in je groepen, zie je het hier.</span></li>`;
}
function toast(a) {
  const g = groups.find((x) => x.id === a.group_id);
  const el = document.createElement("div"); el.className = "toast";
  el.innerHTML = `${actorHTML(a)}<div>${actText(a)}<br><small style="opacity:.75">${esc(g?.name || "")}</small></div>`;
  $("toastBox").innerHTML = ""; $("toastBox").appendChild(el);
  $("bellBtn").classList.remove("ring"); void $("bellBtn").offsetWidth; $("bellBtn").classList.add("ring");
  setTimeout(() => el.remove(), 5000);
}

/* ---------- invite ---------- */
function inviteText() {
  const g = G(); if (!g) return "";
  return `Hoi!\n\nDoe je mee met onze groep "${g.name}" in Trek een lotje? Daarin verzamelen we ideeën in potten en trekken we samen een lotje.\n\nKlik op deze link om direct mee te doen:\nhttps://${SITE}/?code=${g.code}\n\nOf ga naar ${SITE}, tik op "Ik heb een code" en vul deze code in: ${g.code}\n\nTot zo!\n${firstName()}`;
}
function updateInvite() { const t = $("invText"); if (t) t.value = inviteText(); }
async function copyText(txt) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(txt); return true; } catch (err) { /* val terug op de oude manier */ }
  }
  const t = document.createElement("textarea");
  t.value = txt; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.top = "0"; t.style.left = "0"; t.style.opacity = "0"; t.style.fontSize = "16px";
  document.body.appendChild(t); t.focus(); t.select(); t.setSelectionRange(0, txt.length);
  let ok = false; try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
  t.remove(); return ok;
}

/* ================= data ================= */
async function loadProfile() {
  const { data } = await sb.from("profiles").select("id,name").eq("id", me.id).maybeSingle();
  me.name = data?.name || "";
}
async function loadGroups() {
  const { data, error } = await sb.from("groups").select("id,name,code,created_by,created_at,members:group_members(user_id,muted),pots(id,name,color,icon,secret,last_draw,schedule_at,schedule_repeat,schedule_take_out,created_at)").order("created_at");
  if (error) { console.warn(error); return; }
  groups = (data || []).map((g) => ({ ...g, pots: (g.pots || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) }));
  const { data: ps } = await sb.from("profiles").select("id,name");
  (ps || []).forEach((p) => (names[p.id] = p.name || "iemand"));
}
async function loadSlips(g) {
  if (!g) return;
  const { data } = await sb.from("slips").select("id,pot_id,name,done,created_by,created_at").eq("group_id", g).order("created_at");
  const byPot = {}; (data || []).forEach((s) => (byPot[s.pot_id] = byPot[s.pot_id] || []).push(s));
  (groups.find((x) => x.id === g)?.pots || []).forEach((p) => { slips[p.id] = byPot[p.id] || []; counts[p.id] = 0; });
  const { data: cs } = await sb.rpc("slip_counts", { g });
  (cs || []).forEach((c) => (counts[c.pot_id] = c.open_count));
  if (view === "group" || view === "pot") refresh();
}
async function loadActivity() {
  const { data } = await sb.from("activity").select("id,group_id,user_id,kind,text,created_at").order("created_at", { ascending: false }).limit(60);
  activity = data || [];
}
let reloadTimer = null;
function scheduleReload(what) {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(async () => {
    await loadGroups();
    if (what === "slips" || view === "group" || view === "pot") await loadSlips(gid);
    if (!spinning && !lastResult) refresh(); else updateBadge();
  }, 250);
}
function subscribe() {
  if (channel) sb.removeChannel(channel);
  channel = sb.channel("lotje")
    .on("postgres_changes", { event: "*", schema: "public", table: "groups" }, () => scheduleReload())
    .on("postgres_changes", { event: "*", schema: "public", table: "group_members" }, () => scheduleReload())
    .on("postgres_changes", { event: "*", schema: "public", table: "pots" }, () => scheduleReload())
    .on("postgres_changes", { event: "*", schema: "public", table: "slips" }, () => scheduleReload("slips"))
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity" }, async ({ new: a }) => {
      if (!a) return;
      if (!names[a.user_id]) await loadGroups();
      activity.unshift(a);
      if (a.user_id !== me.id && !mutedIds().includes(a.group_id)) toast(a);
      if (view === "notif") renderNotif(); updateBadge();
    })
    .subscribe();
}

async function addSlips(list) {
  const items = list.map((s) => s.trim()).filter(Boolean).slice(0, 40); if (!items.length) return 0;
  const { error } = await sb.from("slips").insert(items.map((name) => ({ pot_id: pid, group_id: gid, name: name.slice(0, 300) })));
  if (error) throw error;
  await loadSlips(gid);
  return items.length;
}
function memberNames() { return (G()?.members || []).map((m) => (m.user_id === me.id ? myName() : names[m.user_id])).filter((n) => n && n !== "iemand"); }
async function createPot(name, color, icon, fill, secret) {
  const g = gid;
  const { data, error } = await sb.from("pots").insert({ group_id: g, name: name.slice(0, 40), color, icon, secret: !!secret }).select("id").single();
  if (error) throw error;
  const items = fill === "members" ? memberNames() : fill || [];
  if (items.length) await sb.from("slips").insert(items.map((n) => ({ pot_id: data.id, group_id: g, name: n })));
  await loadGroups(); await loadSlips(g);
  go("pot", g, data.id);
}
async function draw() {
  if (spinning || !counts[pid]) return;
  spinning = true; $("drawBtn").disabled = true;
  const { data: pick, error } = await sb.rpc("draw_slip", { p: pid });
  if (error || !pick) { spinning = false; $("drawBtn").disabled = false; $("slipMsg").textContent = "Trekken lukte niet. Probeer het nog eens."; return; }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  lastResult = null; $("result").innerHTML = ""; $("lastDraw").textContent = ""; $("drawBtn").disabled = true; $("drawBtn").textContent = "Schudden…";
  const potAt = pid, j = $("bigJar"); j.classList.add("shake");
  setTimeout(() => {
    if (pid !== potAt || view !== "pot") { spinning = false; return; }
    j.classList.remove("shake");
    if (!reduce) { const f = document.createElement("span"); f.className = "fly"; f.style.top = j.offsetTop + 10 + "px"; $("stage").appendChild(f); setTimeout(() => f.remove(), 600); }
    setTimeout(async () => {
      spinning = false; if (pid !== potAt || view !== "pot") return;
      $("drawBtn").textContent = "Trek een lotje!"; refresh(); showResult(pick);
    }, reduce ? 0 : 420);
  }, reduce ? 0 : 900);
}

/* ================= events ================= */
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const a = b.dataset.act, id = b.dataset.id;
  if (a === "loginBack") { loginStep = "email"; return shell(); }
  if (a === "logout") { await sb.auth.signOut(); return; }
  if (a === "panel") { openPanel = b.dataset.p || null; refresh(); const f = openPanel && $(openPanel); if (f) { f.scrollIntoView({ block: "nearest", behavior: "smooth" }); const i = f.querySelector("input[type=text],input[type=email],input:not([type])"); if (i) i.focus(); } return; }
  if (a === "openGroup") return go("group", id);
  if (a === "toNotif") return go("notif");
  if (a === "pref") { const k = b.dataset.k; prefs[k] = !prefs[k]; renderPrefs(); await savePrefs(); return; }
  if (a === "freq") { prefs.frequency = b.dataset.v; renderPrefs(); await savePrefs(); return; }
  if (a === "planStop") {
    if (confirmKey !== "planStop") { confirmKey = "planStop"; return refreshPot(); }
    confirmKey = null; const { error } = await sb.from("pots").update({ schedule_at: null }).eq("id", pid);
    if (!error) { const p = P(); if (p) p.schedule_at = null; } refreshPot(); return;
  }
  if (a === "delAccount") { confirmKey = "delAccount"; shell(); $("delConfirm")?.focus(); return; }
  if (a === "delAccountCancel") { confirmKey = null; return shell(); }
  if (a === "delAccountGo") {
    if (($("delConfirm").value || "").trim().toUpperCase() !== "VERWIJDER") { $("delMsg").textContent = "Typ VERWIJDER om te bevestigen."; return; }
    b.disabled = true; $("delMsg").textContent = "Even bezig…";
    const { error } = await sb.rpc("delete_my_account");
    if (error) { b.disabled = false; $("delMsg").textContent = "Verwijderen lukte niet. Probeer het nog eens."; return; }
    try { localStorage.removeItem("lotje-nav"); localStorage.removeItem("lotje-seen"); } catch (err) {}
    confirmKey = null; await sb.auth.signOut(); loginStep = "email"; view = "login"; shell();
    const v = $("view"); v.insertAdjacentHTML("afterbegin", `<p class="demo">Je account is verwijderd. Bedankt voor het trekken!</p>`); return;
  }
  if (a === "openPot") return go("pot", gid, id);
  if (a === "mute") { const g = groups.find((x) => x.id === id); const m = g?.members.find((x) => x.user_id === me.id); if (!m) return; m.muted = !m.muted; renderNotif(); updateBadge(); await sb.from("group_members").update({ muted: m.muted }).eq("group_id", id).eq("user_id", me.id); return; }
  if (a === "copy" || a === "copyInvite") {
    const txt = a === "copy" ? $("codeTxt").textContent : inviteText();
    const label = a === "copy" ? "Kopieer" : "Kopieer bericht";
    const ok = await copyText(txt);
    if (!ok && a === "copyInvite" && $("invText")) { const t = $("invText"); t.focus(); t.select(); t.setSelectionRange(0, t.value.length); }
    b.textContent = ok ? "Gekopieerd!" : "Lukt niet, selecteer en kopieer zelf";
    clearTimeout(b._t); b._t = setTimeout(() => { b.textContent = label; }, 2500);
    return;
  }
  if (a === "leave") {
    if (confirmKey !== "leave") { confirmKey = "leave"; return refresh(); }
    confirmKey = null; await sb.from("group_members").delete().eq("group_id", gid).eq("user_id", me.id); await loadGroups(); go("home"); return;
  }
  if (a === "tpl") { const t = TEMPLATES[+b.dataset.i]; b.disabled = true; try { await createPot(t.name, t.color, t.icon, t.fill, $("npSecret")?.checked); } catch (err) { $("potMsg").textContent = errText(err, "Pot maken lukte niet. Probeer het nog eens."); b.disabled = false; } return; }
  if (a === "draw") return draw();
  if (a === "takeOut") { lastResult = null; await sb.rpc("set_slip_done", { s: id, d: true }); await loadSlips(gid); return; }
  if (a === "putBack") { await sb.rpc("set_slip_done", { s: id, d: false }); await loadSlips(gid); return; }
  if (a === "delSlip") {
    if (confirmKey !== "slip:" + id) { confirmKey = "slip:" + id; return refreshPot(); }
    confirmKey = null; await sb.from("slips").delete().eq("id", id); await loadSlips(gid); return;
  }
  if (a === "delPot") {
    if (confirmKey !== "delPot") { confirmKey = "delPot"; return refreshPot(); }
    confirmKey = null; const g = gid; const { error } = await sb.from("pots").delete().eq("id", pid);
    if (error) { $("slipMsg").textContent = "Verwijderen lukte niet."; return; }
    await loadGroups(); go("group", g); return;
  }
  if (a === "members") {
    const n = memberNames(); const have = new Set((slips[pid] || []).map((s) => s.name.toLowerCase())); const add = n.filter((x) => !have.has(x.toLowerCase()));
    try { const c = await addSlips(add); $("slipMsg").textContent = c ? `${c} ${c === 1 ? "naam" : "namen"} in de pot gedaan.` : "Alle groepsleden zitten er al in."; } catch (err) { $("slipMsg").textContent = "Toevoegen lukte niet."; }
  }
});

function bindForms() {
  const lf = $("loginForm"); if (lf) lf.onsubmit = async (e) => {
    e.preventDefault(); loginEmail = $("lEmail").value.trim(); if (!loginEmail) return;
    $("lBtn").disabled = true; $("lMsg").textContent = "Even versturen…";
    const { error } = await sb.auth.signInWithOtp({ email: loginEmail, options: { shouldCreateUser: true, emailRedirectTo: location.origin } });
    if (error) { $("lBtn").disabled = false; $("lMsg").textContent = error.status === 429 ? "Even wachten, je hebt net al een code gevraagd. Probeer het over een minuut opnieuw." : "Versturen lukte niet. Klopt je e-mailadres?"; return; }
    loginStep = "code"; shell(); $("lCode").focus();
  };
  const cf = $("codeForm"); if (cf) cf.onsubmit = async (e) => {
    e.preventDefault(); const token = $("lCode").value.replace(/\s/g, ""); if (!token) return;
    $("cBtn").disabled = true;
    const { error } = await sb.auth.verifyOtp({ email: loginEmail, token, type: "email" });
    if (error) { $("cBtn").disabled = false; $("lMsg").textContent = "Deze code klopt niet of is verlopen. Vraag een nieuwe aan."; }
  };
  const nf = $("nameForm"); if (nf) nf.onsubmit = async (e) => {
    e.preventDefault(); const n = $("nName").value.trim(); if (!n) return;
    const { error } = await sb.from("profiles").upsert({ id: me.id, name: n.slice(0, 40) });
    if (error) { $("nMsg").textContent = "Opslaan lukte niet. Probeer het nog eens."; return; }
    me.name = n; names[me.id] = n;
    if (view === "name") afterLogin(); else { $("nMsg").textContent = "Opgeslagen."; shell(); }
  };
  const ng = $("newGroup"); if (ng) ng.onsubmit = async (e) => {
    e.preventDefault(); const n = $("ngName").value.trim(); if (!n) return;
    const { data, error } = await sb.from("groups").insert({ name: n.slice(0, 40) }).select("id").single();
    if (error) { $("homeMsg").textContent = "Groep maken lukte niet. Probeer het nog eens."; return; }
    await loadGroups(); go("group", data.id); openPanel = "newPot"; refresh();
  };
  const jf = $("join"); if (jf) jf.onsubmit = async (e) => { e.preventDefault(); await joinWithCode($("jCode").value); };
  const np = $("newPot"); if (np) np.onsubmit = async (e) => {
    e.preventDefault(); const n = $("npName").value.trim(); if (!n) { $("potMsg").textContent = "Geef je pot een naam of kies een kant-en-klare pot."; return; }
    const used = (G()?.pots || []).map((p) => p.color); const color = COLORS.find((c) => !used.includes(c)) || COLORS[Math.floor(Math.random() * 6)];
    const icon = (np.querySelector("input[name=npIcon]:checked") || {}).value || "star";
    try { await createPot(n, color, icon, [], $("npSecret").checked); } catch (err) { $("potMsg").textContent = "Pot maken lukte niet."; }
  };
  const pf = $("planForm"); if (pf) pf.onsubmit = async (e) => {
    e.preventDefault(); const d = $("plDate").value, t = $("plTime").value; if (!d || !t) return;
    const when = new Date(`${d}T${t}`);
    if (isNaN(when) || when.getTime() < Date.now() + 30000) { $("plMsg").textContent = "Kies een moment in de toekomst."; return; }
    const patch = { schedule_at: when.toISOString(), schedule_repeat: $("plRepeat").value, schedule_take_out: $("plTake").checked };
    const { error } = await sb.from("pots").update(patch).eq("id", pid);
    if (error) { $("plMsg").textContent = "Opslaan lukte niet. Probeer het nog eens."; return; }
    Object.assign(P() || {}, patch); openPanel = null; refresh();
  };
  const as = $("addSlip"); if (as) as.onsubmit = async (e) => {
    e.preventDefault(); const v = $("slipIn").value; if (!v.trim()) return;
    try { const c = await addSlips(v.split(/[,\n]/)); $("slipIn").value = ""; $("slipMsg").textContent = c === 1 ? "Erin!" : `${c} lotjes erin!`; $("slipIn").focus(); }
    catch (err) { $("slipMsg").textContent = "Toevoegen lukte niet. Probeer het nog eens."; }
  };
}
async function joinWithCode(raw) {
  const code = String(raw || "").trim().toUpperCase(); if (!code) return;
  const { data, error } = await sb.rpc("join_group", { p_code: code });
  try { localStorage.removeItem("lotje-code"); } catch (e) {}
  const msg = $("homeMsg");
  if (error || !data) { if (msg) msg.textContent = "Geen groep gevonden met deze code. Kijk de letters en cijfers nog eens na."; return; }
  await loadGroups(); await loadActivity(); go("group", data);
}

/* ================= auth & boot ================= */
async function afterLogin() {
  await Promise.all([loadGroups(), loadActivity(), loadPrefs()]);
  subscribe();
  let code = null; try { code = localStorage.getItem("lotje-code"); } catch (e) {}
  if (code) { view = "home"; shell(); await joinWithCode(code); return; }
  if (wantNotif) { wantNotif = false; history.replaceState(null, "", location.pathname); go("notif"); return; }
  const nav = recall("lotje-nav");
  if (nav && nav.view && groups.some((g) => g.id === nav.gid)) { view = nav.view; gid = nav.gid; pid = nav.pid; if (gid) loadSlips(gid); shell(); }
  else go("home");
}
async function onSession(s) {
  session = s;
  if (!s) { me = { id: null, name: "", email: "" }; groups = []; activity = []; if (channel) { sb.removeChannel(channel); channel = null; } loginStep = "email"; view = "login"; shell(); return; }
  if (me.id === s.user.id && booted) return;
  booted = true;
  me = { id: s.user.id, email: s.user.email || "", name: "" };
  await loadProfile(); names[me.id] = me.name;
  if (!me.name) { view = "name"; shell(); return; }
  await afterLogin();
}
shell();
sb.auth.onAuthStateChange((_evt, s) => { setTimeout(() => onSession(s), 0); });
document.addEventListener("visibilitychange", () => { if (!document.hidden && session) { loadActivity().then(() => scheduleReload()); } });
window.addEventListener("hashchange", () => { if (location.hash === "#meldingen" && session && me.name) { history.replaceState(null, "", location.pathname); go("notif"); } });
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
