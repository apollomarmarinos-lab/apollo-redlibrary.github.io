
/* ============================================================
   BESTAND PFLEGEN
   ============================================================ */
function strangKaestchenBauen(){
  const ziel = $("#f-straenge"); ziel.textContent = "";
  Object.keys(STRAENGE).forEach(k=>{
    const l = el("label");
    const i = document.createElement("input");
    i.type = "checkbox"; i.value = k; i.name = "strang";
    l.appendChild(i);
    l.appendChild(document.createTextNode(STRAENGE[k].ico + " " + STRAENGE[k].n));
    ziel.appendChild(l);
  });
}
function formularArtUmschalten(){
  const istHeft = $("#f-art").value === "heft";
  $("#feld-hrsg").style.display   = istHeft ? "" : "none";
  $("#feld-unter").style.display  = istHeft ? "" : "none";
  $("#feld-rhythmus").style.display = istHeft ? "" : "none";
  $("#f-bek").placeholder = istHeft ? "Themenheft X\nSonderausgabe Y" : "Reihe X\nBuch Y";
}
function formularLeeren(){
  $("#eintragsformular").reset();
  $("#f-id").value = "";
  $$("#f-straenge input").forEach(i => i.checked = false);
  $("#speichern").textContent = "In den Bestand aufnehmen";
  formularArtUmschalten();
}
function formularFuellen(x){
  $("#f-id").value = x.id;
  $("#f-art").value = x.art;
  $("#f-name").value = x.n || "";
  $("#f-ort").value = x.ort || "";
  $("#f-land").value = x.land || "DE";
  $("#f-jahr").value = x.jahr || "";
  $("#f-tier").value = x.tier || "untergrund";
  $("#f-hrsg").value = x.hrsg || "";
  $("#f-unter").value = x.unter || "";
  $("#f-url").value = x.url || "";
  $("#f-txt").value = x.txt || "";
  $("#f-bek").value = (x.bek||[]).join("\n");
  const f = x.f || {};
  $("#f-rhythmus").value = f.taeglich ? "300" : f.woche !== undefined ? "52"
    : f.unregel ? "-1" : f.n ? String(f.n) : "0";
  $$("#f-straenge input").forEach(i => i.checked = (x.s||[]).includes(i.value));
  $("#speichern").textContent = "Änderung übernehmen";
  formularArtUmschalten();
  $("#f-name").focus();
  $("#eintragsformular").scrollIntoView({behavior:"smooth", block:"center"});
}

function rhythmusAusFormular(){
  const w = $("#f-rhythmus").value;
  if(w === "0")   return null;
  if(w === "-1")  return {n:2, unregel:true};
  if(w === "300") return {n:300, taeglich:true};
  if(w === "52")  return {n:52, woche:4};
  return {n: parseInt(w,10), tag:1};
}

function eintragSpeichern(ev){
  ev.preventDefault();
  const name = $("#f-name").value.trim();
  if(!name){ melden("Ohne Namen geht es nicht — trag mindestens den Namen ein.", true); return; }

  const vorhandeneId = $("#f-id").value;
  const art = $("#f-art").value;
  const daten = {
    art, n: name,
    ort: $("#f-ort").value.trim(),
    land: $("#f-land").value,
    jahr: parseInt($("#f-jahr").value,10) || null,
    tier: $("#f-tier").value,
    url: $("#f-url").value.trim(),
    txt: $("#f-txt").value.trim(),
    s: $$("#f-straenge input:checked").map(i=>i.value),
    bek: $("#f-bek").value.split("\n").map(z=>z.trim()).filter(Boolean),
    st: "aktiv"
  };
  if(art === "heft"){
    daten.hrsg  = $("#f-hrsg").value.trim();
    daten.unter = $("#f-unter").value.trim();
    const f = rhythmusAusFormular();
    daten.f = f || {n:4, unregel:true};
  }

  if(vorhandeneId){
    const eigen = EIGEN.neu.find(e => e.id === vorhandeneId);
    if(eigen) Object.assign(eigen, daten);
    else EIGEN.aenderungen[vorhandeneId] = daten;
    melden("„" + name + "“ wurde geändert.");
  }else{
    let id = "eigen-" + name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,28);
    let n = 2; const alle = new Set(BESTAND.map(x=>x.id));
    while(alle.has(id)){ id = id.replace(/-\d+$/,"") + "-" + (n++); }
    EIGEN.neu.push({id, ...daten});
    melden("„" + name + "“ steht jetzt im Regal und nimmt ab sofort an der Rotation teil.");
  }
  lagerSchreiben();
  allesNeuZeichnen();
  formularLeeren();
}

function eintragEntfernen(x){
  if(x._eigen){ EIGEN.neu = EIGEN.neu.filter(e => e.id !== x.id); }
  else{ if(!EIGEN.versteckt.includes(x.id)) EIGEN.versteckt.push(x.id);
        delete EIGEN.aenderungen[x.id]; }
  lagerSchreiben(); allesNeuZeichnen();
  melden("„" + x.n + "“ ist aus dem Regal genommen.");
}
function aenderungVerwerfen(id){
  delete EIGEN.aenderungen[id];
  EIGEN.versteckt = EIGEN.versteckt.filter(v => v !== id);
  lagerSchreiben(); allesNeuZeichnen();
  melden("Ursprünglicher Eintrag ist wieder da.");
}

function eigenListeZeichnen(){
  const ziel = $("#eigen-liste"); ziel.textContent = "";
  const zeilen = [];
  EIGEN.neu.forEach(x => zeilen.push({x:{...x,_eigen:true}, art:"neu"}));
  Object.keys(EIGEN.aenderungen).forEach(id=>{
    const b = BESTAND.find(y=>y.id===id);
    if(b) zeilen.push({x:b, art:"geaendert"});
  });
  EIGEN.versteckt.forEach(id=>{
    const g = [...VERLAGE,...HEFTE].find(y=>y.id===id);
    if(g) zeilen.push({x:g, art:"entfernt"});
  });

  $("#eigen-zahl").textContent = zeilen.length;
  if(!zeilen.length){
    ziel.appendChild(leer("Noch nichts geändert","Der Bestand steht so da, wie er ausgeliefert wurde. Alles, was du oben einträgst, erscheint hier."));
    return;
  }
  zeilen.forEach(({x, art})=>{
    const z = el("div","bestandszeile");
    const w = el("div","wer");
    const b = el("b",null,x.n); w.appendChild(b);
    w.appendChild(el("span",null, (x.art==="heft"?"Zeitschrift":"Verlag") + " · " + (x.ort||"—") + " · " +
      (art==="neu"?"selbst eingetragen": art==="geaendert"?"geändert":"aus dem Regal genommen")));
    z.appendChild(w);
    z.appendChild(el("span","eigen-marke", art==="neu"?"neu": art==="geaendert"?"geändert":"entfernt"));

    if(art !== "entfernt"){
      const be = el("button","knopf leise","Bearbeiten"); be.type="button";
      be.addEventListener("click", ()=> formularFuellen(BESTAND.find(y=>y.id===x.id) || x));
      z.appendChild(be);
    }
    const w2 = el("button","knopf leise", art==="neu" ? "Löschen" : art==="entfernt" ? "Zurückholen" : "Original wiederherstellen");
    w2.type="button";
    w2.addEventListener("click", ()=> art==="neu" ? eintragEntfernen({...x,_eigen:true}) : aenderungVerwerfen(x.id));
    z.appendChild(w2);
    ziel.appendChild(z);
  });
}

function melden(text, warnung){
  const ziel = $("#bestand-meldung");
  ziel.textContent = "";
  const m = el("div","meldung", text);
  if(warnung) m.style.borderLeftColor = "var(--blau)";
  ziel.appendChild(m);
  clearTimeout(melden._t);
  melden._t = setTimeout(()=>{ if(ziel.firstChild===m) ziel.textContent=""; }, 7000);
}

/* ---------- Sichern / Einlesen ---------- */
/* Im Artifact-Viewer läuft ein Download nur über die downloads-Freigabe.
   Außerhalb (lokale Datei) tut es der klassische Link. Klappt beides nicht,
   legen wir den Bestand zum Herauskopieren offen. */
let DOWNLOADS = null, DOWNLOADS_GEPRUEFT = false;
async function downloadsHolen(){
  if(DOWNLOADS_GEPRUEFT) return DOWNLOADS;
  DOWNLOADS_GEPRUEFT = true;
  try{
    if(window.claude && typeof window.claude.use === "function")
      DOWNLOADS = await window.claude.use("downloads");
  }catch(e){ DOWNLOADS = null; }
  return DOWNLOADS;
}

function bestandsDatei(){
  return JSON.stringify({format:"rotes-regal-1", gesichert:new Date().toISOString(), ...EIGEN}, null, 2);
}

async function sichern(){
  const daten = bestandsDatei();
  const ns = await downloadsHolen();

  if(ns){
    try{
      await ns.save({filename: "rotes-regal-bestand.json", data: daten});
      melden("Bestand gesichert.");
    }catch(err){
      const code = err && err.code;
      if(code === "declined")            melden("Abgebrochen — es wurde nichts gesichert.");
      else if(code === "rate_limited")   melden("Es läuft schon eine Abfrage. Kurz warten, dann noch einmal.", true);
      else if(code === "too_large")      melden("Der Bestand ist zu groß für eine Sicherung.", true);
      else                               zumHerauskopieren(daten);
    }
    return;
  }

  if(!window.claude){                    // lokale Datei, eigener Server
    try{
      const blob = new Blob([daten], {type:"application/json"});
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "rotes-regal-bestand.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
      melden("Bestandsdatei wurde erzeugt.");
      return;
    }catch(e){ /* fällt durch */ }
  }
  zumHerauskopieren(daten);
}

function zumHerauskopieren(daten){
  const ziel = $("#bestand-meldung"); ziel.textContent = "";
  const kasten = el("div","meldung");
  kasten.appendChild(el("p", null, "Diese Ansicht darf keine Dateien ablegen. Hier ist dein Bestand zum Herauskopieren — sichere ihn in einer Datei namens rotes-regal-bestand.json, dann kannst du ihn über „Bestand einlesen“ zurückholen."))
  const t = document.createElement("textarea");
  t.value = daten; t.readOnly = true; t.rows = 8;
  t.style.cssText = "width:100%;margin-top:10px;font-family:var(--f-karte);font-size:.7rem;border:1px solid var(--linie);background:var(--papier-hoch);color:var(--tinte);padding:9px;resize:vertical";
  kasten.appendChild(t);
  const k = el("button","knopf","In die Zwischenablage"); k.type="button";
  k.style.marginTop = "10px";
  k.addEventListener("click", async ()=>{
    try{ await navigator.clipboard.writeText(daten); k.textContent = "Kopiert ✓"; }
    catch(e){ t.select(); k.textContent = "Markiert — mit Strg/Cmd+C kopieren"; }
  });
  kasten.appendChild(k);
  ziel.appendChild(kasten);
  clearTimeout(melden._t);
  t.focus(); t.select();
}

function einlesen(datei){
  const leser = new FileReader();
  leser.onload = () => {
    try{
      const d = JSON.parse(leser.result);
      EIGEN = {neu: d.neu||[], aenderungen: d.aenderungen||{}, versteckt: d.versteckt||[]};
      lagerSchreiben(); allesNeuZeichnen();
      melden("Bestand eingelesen: " + EIGEN.neu.length + " eigene Einträge, " +
             Object.keys(EIGEN.aenderungen).length + " Änderungen.");
    }catch(e){
      melden("Die Datei ließ sich nicht lesen. Erwartet wird eine .json-Datei, die hier gesichert wurde.", true);
    }
  };
  leser.readAsText(datei);
}

/* ============================================================
   BLÄTTER / REITER
   ============================================================ */
function blattWechseln(name){
  $$(".reiter").forEach(r => r.setAttribute("aria-selected", String(r.dataset.blatt === name)));
  $$(".blatt").forEach(b => { b.hidden = (b.id !== "blatt-" + name); });
  window.scrollTo({top:0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
}

/* ============================================================
   ALLES ZEICHNEN
   ============================================================ */
function allesNeuZeichnen(){
  bestandBauen();
  titelDatenBauen();
  kopfZeichnen();
  tickerZeichnen();
  tischZeichnen();
  kernZeichnen();
  kioskZeichnen();
  schaufensterZeichnen();
  taktgeberZeichnen();
  filterOptionenAktualisieren();
  titelFilterFuellen();
  titelZeichnen();
  hefteZeichnen();
  verlageZeichnen();
  antiquariatZeichnen();
  umlaufZeichnen();
  eigenListeZeichnen();
}

function filterOptionenAktualisieren(){
  const merken = sel => sel.value;
  const setzen = (sel, wert) => { if(Array.from(sel.options).some(o=>o.value===wert)) sel.value = wert; };
  const hefte = BESTAND.filter(x=>x.art==="heft" && x.st!=="archiv");
  const verlage = BESTAND.filter(x=>x.art==="verlag");

  const merkA = [merken($("#filter-heft-rhythmus")), merken($("#filter-heft-land")),
                 merken($("#filter-heft-strang")), merken($("#filter-heft-tier"))];
  const merkB = [merken($("#filter-verlag-land")), merken($("#filter-verlag-strang")), merken($("#filter-verlag-tier"))];

  optionenFuellen($("#filter-heft-rhythmus"), RHYTHMUS_GRUPPEN.map(g=>[g.k,g.n]));
  optionenFuellen($("#filter-heft-land"), landOptionen(hefte));
  optionenFuellen($("#filter-heft-strang"), strangOptionen());
  optionenFuellen($("#filter-heft-tier"), TIER_OPTIONEN);
  optionenFuellen($("#filter-verlag-land"), landOptionen(verlage));
  optionenFuellen($("#filter-verlag-strang"), strangOptionen());
  optionenFuellen($("#filter-verlag-tier"), TIER_OPTIONEN);

  setzen($("#filter-heft-rhythmus"), merkA[0]); setzen($("#filter-heft-land"), merkA[1]);
  setzen($("#filter-heft-strang"), merkA[2]);   setzen($("#filter-heft-tier"), merkA[3]);
  setzen($("#filter-verlag-land"), merkB[0]);   setzen($("#filter-verlag-strang"), merkB[1]);
  setzen($("#filter-verlag-tier"), merkB[2]);
}

