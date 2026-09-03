
/* ============================================================
   ZEITSCHRIFTENREGAL
   ============================================================ */
const RHYTHMUS_GRUPPEN = [
  {k:"alle",     n:"Jeder Rhythmus"},
  {k:"taeglich", n:"täglich"},
  {k:"woche",    n:"wöchentlich"},
  {k:"monat",    n:"monatlich"},
  {k:"zweimonat",n:"zweimonatlich"},
  {k:"quartal",  n:"vierteljährlich"},
  {k:"selten",   n:"seltener als quartalsweise"},
  {k:"unregel",  n:"unregelmäßig"}
];
function rhythmusGruppe(h){
  const f = h.f || {};
  if(f.taeglich) return "taeglich";
  if(f.woche !== undefined) return "woche";
  if(f.unregel) return "unregel";
  const n = f.n || 0;
  if(n >= 10) return "monat";
  if(n === 6) return "zweimonat";
  if(n === 4) return "quartal";
  return "selten";
}

function heftZeile(x, i){
  const s = heftStand(x, HEUTE);
  const z = el("div","heft-zeile"); stapel(z,i);

  const nr = el("div","heft-nr");
  if(s.nr){ nr.textContent = s.nr; nr.appendChild(el("small",null,"Ausgabe")); }
  else if(s.typ==="taeglich"){ nr.textContent="◼"; nr.appendChild(el("small",null,"täglich")); }
  else if(s.typ==="woche"){ nr.textContent="◻"; nr.appendChild(el("small",null,"wöch.")); }
  else { nr.textContent="—"; }
  z.appendChild(nr);

  const name = el("div","heft-name");
  name.appendChild(document.createTextNode(x.n));
  if(x.unter) name.appendChild(el("span",null,x.unter));
  z.appendChild(name);

  z.appendChild(el("div","heft-hrsg", (x.hrsg||"") + (x.ort ? " · " + x.ort : "")));
  z.appendChild(el("div","heft-rhythmus", s.kurz || "—"));

  const stand = el("div","heft-stand");
  if(s.typ==="archiv"){ stand.appendChild(markeVon("archiv","Archiv")); }
  else if(s.frisch){ stand.appendChild(markeVon("neu","gerade neu")); }
  else if(s.baldda){ stand.appendChild(markeVon("bald","in " + s.tageBis + " T.")); }
  else if(s.typ==="periodisch"){ stand.textContent = "→ " + MON_KURZ[s.naechste.getMonth()] + " " + s.naechste.getFullYear(); }
  else if(s.typ==="taeglich"){ stand.appendChild(markeVon("neu","heute")); }
  else if(s.typ==="woche"){
    stand.textContent = s.tageBis === 1 ? "→ morgen" : "→ in " + s.tageBis + " Tagen";
  }
  else { stand.textContent = "wenn fertig"; }
  z.appendChild(stand);

  klickbar(z, ()=> schubladeOeffnen(x));
  return z;
}
function markeVon(art, text){ return el("span","marke "+art, text); }

/* ============================================================
   FILTERWERK — für Hefte und Verlage gleich gebaut
   ============================================================ */
function optionenFuellen(sel, eintraege){
  sel.textContent = "";
  eintraege.forEach(([wert,text])=>{
    const o = document.createElement("option");
    o.value = wert; o.textContent = text;
    sel.appendChild(o);
  });
}
function strangOptionen(){
  return [["alle","Jeder Strang"]].concat(
    Object.keys(STRAENGE).map(k => [k, STRAENGE[k].n])
  );
}
function landOptionen(menge){
  const vorhanden = Array.from(new Set(menge.map(x=>x.land))).sort();
  return [["alle","Jedes Land"]].concat(vorhanden.map(l => [l, LAENDER[l]||l]));
}
const TIER_OPTIONEN = [["alle","Jede Größe"],["kern","Kern"],["haus","Haus"],["untergrund","Untergrund"]];

function passt(x, {such, land, strang, tier}){
  if(land !== "alle" && x.land !== land) return false;
  if(tier !== "alle" && x.tier !== tier) return false;
  if(strang !== "alle" && !x.s.includes(strang)) return false;
  if(such){
    const heu = [x.n, x.ort, x.hrsg, x.unter, x.txt, (x.bek||[]).join(" "), LAENDER[x.land]]
      .filter(Boolean).join(" ").toLowerCase();
    if(!heu.includes(such)) return false;
  }
  return true;
}

function hefteZeichnen(){
  const menge = BESTAND.filter(x => x.art==="heft" && x.st!=="archiv");
  const f = {
    such: $("#suche-hefte").value.trim().toLowerCase(),
    land: $("#filter-heft-land").value,
    strang: $("#filter-heft-strang").value,
    tier: $("#filter-heft-tier").value
  };
  const rg = $("#filter-heft-rhythmus").value;
  let treffer = menge.filter(x => passt(x,f) && (rg==="alle" || rhythmusGruppe(x)===rg));

  treffer = treffer
    .map(x => ({x, s: heftStand(x, HEUTE)}))
    .sort((a,b) => (a.s.dringlich - b.s.dringlich) || a.x.n.localeCompare(b.x.n,"de"))
    .map(o => o.x);

  const ziel = $("#hefte-liste"); ziel.textContent = "";
  $("#ergebnis-hefte").textContent = treffer.length + " von " + menge.length + " Heften";
  if(!treffer.length){ ziel.appendChild(leer("Nichts im Regal", "Für diese Kombination steht gerade nichts da. Nimm einen Filter zurück — oder trag das Heft unter „Bestand pflegen“ selbst ein.")); return; }
  treffer.forEach((x,i)=> ziel.appendChild(heftZeile(x,i)));
}

function verlageZeichnen(){
  const menge = BESTAND.filter(x => x.art==="verlag");
  const f = {
    such: $("#suche-verlage").value.trim().toLowerCase(),
    land: $("#filter-verlag-land").value,
    strang: $("#filter-verlag-strang").value,
    tier: $("#filter-verlag-tier").value
  };
  let treffer = menge.filter(x => passt(x,f));
  const sort = $("#sortierung-verlage").value;
  const cmp = {
    az:      (a,b)=> a.n.localeCompare(b.n,"de"),
    jahr:    (a,b)=> (a.jahr||9999)-(b.jahr||9999) || a.n.localeCompare(b.n,"de"),
    "jahr-neu":(a,b)=> (b.jahr||0)-(a.jahr||0) || a.n.localeCompare(b.n,"de"),
    land:    (a,b)=> a.land.localeCompare(b.land) || a.n.localeCompare(b.n,"de")
  }[sort];
  treffer.sort(cmp);

  const ziel = $("#verlage-liste"); ziel.textContent = "";
  $("#ergebnis-verlage").textContent = treffer.length + " von " + menge.length + " Verlagen";
  if(!treffer.length){ ziel.appendChild(leer("Regal leer", "Diese Kombination gibt nichts her. Setz einen Filter zurück.")); return; }
  treffer.forEach((x,i)=> ziel.appendChild(stueckKarte(x,i)));
}

function antiquariatZeichnen(){
  const menge = BESTAND.filter(x => x.st==="archiv").sort((a,b)=>(b.ende||0)-(a.ende||0));
  const ziel = $("#antiquariat-liste"); ziel.textContent = "";
  menge.forEach((x,i)=> ziel.appendChild(stueckKarte(x,i)));
}

function leer(titel, text){
  const d = el("div","leermeldung");
  d.style.gridColumn = "1 / -1";
  d.appendChild(el("strong",null,titel));
  d.appendChild(document.createTextNode(text));
  return d;
}

/* ============================================================
   SCHUBLADE
   ============================================================ */
let letzterFokus = null;
function schubladeOeffnen(x){
  letzterFokus = document.activeElement;
  if(x.art === "buch") return schubladeBuch(x);
  const s = x.art==="heft" ? heftStand(x, HEUTE) : null;

  $("#sch-art").textContent = x.art==="heft" ? "Zeitschrift" : "Verlag";
  $("#sch-art").className = "art-marke" + (x.art==="heft"?" heft":"");
  $("#sch-land").textContent = (LAENDER[x.land]||x.land) + (x.ort ? " · " + x.ort : "");
  $("#sch-titel").textContent = x.n;
  $("#sch-unter").textContent = x.unter || (x.hrsg ? "Herausgegeben von " + x.hrsg : (TIER_ERKL[x.tier]||""));
  $("#sch-text").textContent = x.txt || "";

  const dl = $("#sch-daten"); dl.textContent = "";
  const reihe = (k,v)=>{
    if(!v) return;
    const d = el("div");
    d.appendChild(el("dt",null,k));
    const dd = el("dd"); 
    if(v instanceof Node) dd.appendChild(v); else dd.textContent = v;
    d.appendChild(dd); dl.appendChild(d);
  };
  reihe("Gegründet", x.jahr ? String(x.jahr) : null);
  if(x.st==="archiv") reihe("Eingestellt", String(x.ende));
  reihe("Einordnung", (TIER_NAME[x.tier]||"—") + " — " + (TIER_ERKL[x.tier]||""));
  if(x.hrsg) reihe("Herausgeber", x.hrsg);

  const hd = HEFTDATEN[x.id];
  if(hd && (hd.nr || hd.d)){
    const w = el("span");
    w.textContent = (hd.nr ? "Nr. " + hd.nr : "aktuelle Ausgabe") + (hd.d ? " · " + monatText(hd.d) : "") + (hd.th ? " · " + hd.th : "");
    const q = el("span");
    q.style.cssText = "display:block;font-family:var(--f-karte);font-size:.6rem;letter-spacing:.05em;color:var(--tinte-hell);margin-top:3px";
    q.textContent = "abgerufen bei " + (QUELLENNAME[hd.q]||hd.q) + " am " + hd.h;
    w.appendChild(q);
    reihe("Zuletzt erschienen", w);
  }
  if(s && s.typ !== "archiv"){
    reihe("Rhythmus", s.text);
    if(s.typ==="periodisch"){
      reihe("Zuletzt", s.letzteText + (s.nr ? " · Nr. " + s.nr : ""));
      const nn = el("span");
      nn.textContent = s.naechsteText + (s.nr ? " · voraussichtlich Nr. " + (s.nr+1) : "");
      if(s.geschaetzt){
        const h = el("span"); h.style.cssText="display:block;font-family:var(--f-karte);font-size:.62rem;letter-spacing:.05em;color:var(--tinte-hell);margin-top:3px";
        h.textContent = "Monate geschätzt — der Rhythmus ist belegt, die genauen Termine nicht.";
        nn.appendChild(h);
      }
      reihe("Erwartet", nn);
    }
  }
  if(x.s && x.s.length){
    const wrap = el("div"); wrap.style.cssText="display:flex;flex-wrap:wrap;gap:5px";
    x.s.forEach(k => {
      if(!STRAENGE[k]) return;
      const b = el("span"); 
      b.style.cssText = "font-family:var(--f-karte);font-size:.6rem;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--linie);padding:2px 6px 1px";
      b.textContent = STRAENGE[k].ico + " " + STRAENGE[k].n;
      wrap.appendChild(b);
    });
    reihe("Stränge", wrap);
  }

  const bek = $("#sch-bekannt"); bek.textContent = "";

  if(x.art === "verlag"){
    const neu = BUECHER_NEU.filter(b => b.vid === x.id);
    const alt = BUECHER_ALT.filter(b => b.vid === x.id);
    if(neu.length) bek.appendChild(titelBlock("Zuletzt erschienen", neu.slice(0,8), SPEICHER[x.id]));
    if(alt.length) bek.appendChild(titelBlock("Aus dem Rückenbestand", alt.slice(0,8), SPEICHER[x.id+":alt"]));
    if(!neu.length && !alt.length) bek.appendChild(wartetBlock(x));
  }
  if(x.art === "heft"){
    const hd2 = HEFTDATEN[x.id];
    if(hd2 && hd2.t && hd2.t.length)
      bek.appendChild(titelBlock("Aus dieser Ausgabe", hd2.t.map(a=>({n:a.t, autor:a.a})), hd2));
    else bek.appendChild(wartetBlock(x));
  }

  if(x.bek && x.bek.length){
    const h = el("h3", null, "Bekannt für");
    h.style.cssText = "font-family:var(--f-plakat);font-variation-settings:'wdth' 104,'wght' 800;text-transform:uppercase;font-size:.82rem;letter-spacing:.04em;margin:26px 0 4px";
    bek.appendChild(h);
    const ul = el("ul","bekannt-liste");
    x.bek.forEach(t => ul.appendChild(el("li",null,t)));
    bek.appendChild(ul);
  }

  const akt = $("#sch-aktionen"); akt.textContent = "";
  if(x.url){
    const a = document.createElement("a");
    a.className = "knopf stark"; a.href = x.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = "Zur Website ↗";
    akt.appendChild(a);
  }
  const bearbeiten = el("button","knopf","Eintrag bearbeiten");
  bearbeiten.type="button";
  bearbeiten.addEventListener("click", ()=>{ schubladeSchliessen(); blattWechseln("bestand"); formularFuellen(x); });
  akt.appendChild(bearbeiten);

  const sch = $("#schublade");
  sch.hidden = false;
  requestAnimationFrame(()=> sch.classList.add("offen"));
  $("#schliessen").focus();
  document.body.style.overflow = "hidden";
}
function schubladeSchliessen(){
  const sch = $("#schublade");
  sch.classList.remove("offen");
  document.body.style.overflow = "";
  setTimeout(()=>{ sch.hidden = true; }, 330);
  if(letzterFokus && letzterFokus.focus) letzterFokus.focus();
}
