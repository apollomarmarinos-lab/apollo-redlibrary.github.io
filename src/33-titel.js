
/* ============================================================
   TITEL — was aus dem Speicher wird
   Abgerufenes schlägt Berechnetes. Fehlt etwas, greift der Rhythmus.
   ============================================================ */
let INDEX = {};          // id -> Katalogeintrag
let BUECHER_NEU = [];    // Neuerscheinungen, aus den Bibliothekskatalogen
let BUECHER_ALT = [];    // Rückenbestand, gleiche Quelle mit Jahresdeckel
let HEFTDATEN = {};      // heftId -> abgerufener Ausgabenstand

const INKS = ["ink-tinte","ink-rot","ink-blau","ink-papier"];
const BREITEN = ["", "breit", "", "schmal", ""];

const QUELLENNAME = {
  dnb:"Deutsche Nationalbibliothek", "dnb-alt":"Deutsche Nationalbibliothek",
  bnf:"Bibliothèque nationale de France", "bnf-alt":"Bibliothèque nationale de France",
  cr:"Crossref", "cr-suche":"Crossref", web:"Verlagsseite", "web-heft":"Zeitschriftenseite"
};

function titelDatenBauen(){
  INDEX = {}; BUECHER_NEU = []; BUECHER_ALT = []; HEFTDATEN = {};
  BESTAND.forEach(x => INDEX[x.id] = x);

  Object.keys(SPEICHER).forEach(schluessel => {
    if(schluessel === "stand") return;
    const eintrag = SPEICHER[schluessel];
    const alt = schluessel.endsWith(":alt");
    const id  = alt ? schluessel.slice(0, -4) : schluessel;
    const wer = INDEX[id];
    if(!wer || !eintrag.t) return;

    if(wer.art === "heft" && !alt){
      HEFTDATEN[id] = eintrag;
      return;
    }
    const ziel = alt ? BUECHER_ALT : BUECHER_NEU;
    eintrag.t.forEach((b, i) => {
      if(!b.t) return;
      ziel.push({
        art:"buch", id: id + (alt?"-alt-":"-neu-") + i,
        n: b.t, autor: b.a || null, jahr: b.j ? parseInt(b.j,10) : null,
        vid: id, v: wer.n, ort: wer.ort, land: wer.land, tier: wer.tier,
        s: wer.s || [], herkunft: alt ? "ruecken" : "neu",
        quelle: eintrag.q, geholt: eintrag.h
      });
    });
  });
}

/* Wie viele Einträge sind schon abgerufen? */
function umlaufStand(){
  const mitAbruf = ABRUFPLAN.filter(p => !p.i.endsWith(":alt"));
  const geholt = mitAbruf.filter(p => SPEICHER[p.i]);
  const gesperrt = Object.values(SPEICHER).filter(e => e && e.sperre).length;
  const rueckenGeholt = Object.keys(SPEICHER).filter(k => k.endsWith(":alt")).length;
  const letzterLauf = SPEICHER.stand;
  const rueckenMoeglich = ABRUFPLAN.filter(p => p.i.endsWith(":alt")).length;
  return {
    gesamt: mitAbruf.length, geholt: geholt.length, gesperrt,
    rueckenGeholt, rueckenMoeglich,
    buecher: BUECHER_NEU.length + BUECHER_ALT.length,
    hefte: Object.keys(HEFTDATEN).length,
    stand: letzterLauf || null
  };
}

/* ============================================================
   BUCHKARTE (Tisch, Suchergebnisse)
   ============================================================ */
function buchKarte(b, i){
  const k = el("div","stueck buch");
  stapel(k, i);
  const kopf = el("div","stueck-kopf");
  kopf.appendChild(el("span","art-marke buch", b.herkunft === "ruecken" ? "Rückenbestand" : "Neu"));
  kopf.appendChild(el("span","land-marke", b.jahr ? String(b.jahr) : b.land));
  k.appendChild(kopf);

  k.appendChild(el("h3", null, b.n));
  k.appendChild(el("p","unter", b.autor || "—"));

  const fuss = el("div","stueck-fuss");
  fuss.appendChild(el("span","ort", b.v));
  fuss.appendChild(el("span","tier-punkt " + b.tier, TIER_NAME[b.tier]||""));
  k.appendChild(fuss);

  klickbar(k, ()=> schubladeOeffnen(b));
  return k;
}

/* ============================================================
   DER TISCH — echte Neuerscheinungen, wöchentlich neu gelegt
   ============================================================ */
function tischZeichnen(){
  const ziel = $("#tisch"); ziel.textContent = "";
  const kernIds = new Set(buecherKern().map(b => b.id));
  const pool = BUECHER_NEU.filter(b => !kernIds.has(b.id));

  if(!pool.length){
    ziel.appendChild(leer("Der Tisch ist noch leer",
      "Es sind noch keine Neuerscheinungen abgerufen. Die Auffrischung holt sie portionsweise nach."));
    $("#tisch-alter").textContent = "";
    return;
  }
  // je Verlag höchstens zwei, damit ein Haus den Tisch nicht besetzt
  const gemischt = mischen(pool, saatVon("tisch") ^ wochenNummer(HEUTE));
  const proVerlag = {}, gewaehlt = [];
  for(const b of gemischt){
    proVerlag[b.vid] = (proVerlag[b.vid]||0) + 1;
    if(proVerlag[b.vid] > 2) continue;
    gewaehlt.push(b);
    if(gewaehlt.length >= TISCH_PLAETZE) break;
  }
  gewaehlt.forEach((b,i)=> ziel.appendChild(buchKarte(b,i)));

  const tageInWoche = tagesNummer(HEUTE) % 7;
  const rest = 7 - tageInWoche;
  $("#tisch-alter").textContent = (tageInWoche === 0 ? "Heute frisch gelegt"
    : "Liegt seit " + tageInWoche + (tageInWoche===1?" Tag":" Tagen"))
    + " · noch " + rest + (rest===1?" Tag":" Tage");
}

/* ============================================================
   DAS KERNREGAL — Rückenbestand, langsames Förderband
   ============================================================ */
function buecherKern(){
  let pool = BUECHER_ALT.slice();
  // Reicht der Rückenbestand nicht, füllen die ältesten Neuerscheinungen auf
  if(pool.length < KERN_PLAETZE * 2){
    const auffuellen = BUECHER_NEU.filter(b => b.tier === "kern")
      .sort((a,b)=> (a.jahr||9999) - (b.jahr||9999));
    pool = pool.concat(auffuellen);
  }
  if(!pool.length) return [];
  pool = mischen(pool, 19680501);
  const z = zyklusNummer(HEUTE), raus = [];
  for(let i=0;i<KERN_PLAETZE;i++){
    const b = pool[(z*KERN_VORSCHUB + i) % pool.length];
    raus.push({...b, _platz:i,
      _neuImKern: i >= KERN_PLAETZE - KERN_VORSCHUB,
      _bleibtNoch: Math.ceil((i+1)/KERN_VORSCHUB),
      _maxRest: Math.ceil(KERN_PLAETZE/KERN_VORSCHUB)});
  }
  raus.reverse();
  return raus;
}

function kernZeichnen(){
  const kern = buecherKern();
  const ziel = $("#kernregal"); ziel.textContent = "";

  if(!kern.length){
    ziel.appendChild(leer("Regal noch nicht bestückt",
      "Der Rückenbestand wird gerade erst geholt. Sieh im Umlauf nach, wie weit es ist."));
    $("#kern-rest").textContent = "";
    return;
  }
  kern.forEach((b,i)=>{
    const h = saatVon(b.id);
    const r = el("div","ruecken " + INKS[h % 4] + " " + BREITEN[(h>>3) % BREITEN.length]);
    r.setAttribute("aria-label", b.n + (b.autor ? " von " + b.autor : "") + " — noch " + b._bleibtNoch + " Zyklen im Kernregal");
    stapel(r, i);
    r.appendChild(el("span","ruecken-kopfband"));
    const text = el("span","ruecken-text");
    text.appendChild(el("b", null, b.n));
    if(b.autor) text.appendChild(el("i", null, b.autor));
    r.appendChild(text);
    if(b._neuImKern) r.appendChild(el("span","frisch-fahne","neu"));
    const fuss = el("div","ruecken-fuss");
    fuss.appendChild(el("span","rest", b.jahr ? String(b.jahr) : "noch " + b._bleibtNoch));
    const leiste = el("div","leiste");
    for(let p=0;p<b._maxRest;p++){
      const s = el("i"); if(p < b._bleibtNoch) s.className = "voll";
      leiste.appendChild(s);
    }
    fuss.appendChild(leiste);
    r.appendChild(fuss);
    klickbar(r, ()=> schubladeOeffnen(b));
    ziel.appendChild(r);
  });
  const restTage = KERN_ZYKLUS - tagesNummer(HEUTE) % KERN_ZYKLUS;
  $("#kern-rest").textContent = "Nächster Vorschub in " + restTage + (restTage===1?" Tag":" Tagen");
}

/* ============================================================
   FRISCH AM KIOSK — abgerufene Heftausgaben mit Inhalt
   ============================================================ */
function kioskZeichnen(){
  const ziel = $("#kiosk"); ziel.textContent = "";
  const hefte = Object.keys(HEFTDATEN)
    .map(id => ({x: INDEX[id], d: HEFTDATEN[id]}))
    .filter(o => o.x && o.d.t && o.d.t.length)
    .sort((a,b) => String(b.d.d||"").localeCompare(String(a.d.d||"")));

  $("#kiosk-zahl").textContent = hefte.length
    ? hefte.length + " Ausgaben mit Inhaltsverzeichnis"
    : "noch keine Ausgabe abgerufen";

  if(!hefte.length){
    ziel.appendChild(leer("Noch nichts eingetroffen",
      "Die aktuellen Ausgaben werden portionsweise geholt. Bis dahin zeigt das Zeitschriftenregal den berechneten Rhythmus."));
    return;
  }
  hefte.slice(0, 6).forEach((o, i) => {
    const k = el("div","ausgabe"); stapel(k, i);
    const kopf = el("div","ausgabe-kopf");
    const nr = el("div","ausgabe-nr");
    nr.appendChild(el("b", null, o.d.nr ? "Nr. " + o.d.nr : "neu"));
    if(o.d.d) nr.appendChild(el("span", null, monatText(o.d.d)));
    kopf.appendChild(nr);
    const titel = el("div","ausgabe-titel");
    titel.appendChild(el("h3", null, o.x.n));
    if(o.d.th) titel.appendChild(el("p","thema", "Schwerpunkt: " + o.d.th));
    else if(o.x.unter) titel.appendChild(el("p","thema", o.x.unter));
    kopf.appendChild(titel);
    k.appendChild(kopf);

    const ul = el("ul","inhalt");
    o.d.t.slice(0,5).forEach(a=>{
      const li = el("li");
      li.appendChild(el("span","aufsatz", a.t));
      if(a.a) li.appendChild(el("span","verfasser", a.a));
      ul.appendChild(li);
    });
    k.appendChild(ul);

    const fuss = el("div","ausgabe-fuss");
    fuss.appendChild(el("span", null, "Quelle: " + (QUELLENNAME[o.d.q] || o.d.q) + " · geholt " + o.d.h));
    k.appendChild(fuss);

    klickbar(k, ()=> schubladeOeffnen(o.x));
    ziel.appendChild(k);
  });
}
function monatText(ym){
  const [j,m] = String(ym).split("-").map(Number);
  return m ? MONATE[m-1] + " " + j : String(ym);
}

/* ---------- Schubladen-Bausteine ---------- */
function blockUeberschrift(text){
  const h = el("h3", null, text);
  h.style.cssText = "font-family:var(--f-plakat);font-variation-settings:'wdth' 104,'wght' 800;text-transform:uppercase;font-size:.82rem;letter-spacing:.04em;margin:26px 0 4px";
  return h;
}
function titelBlock(ueberschrift, titel, meta){
  const w = el("div");
  w.appendChild(blockUeberschrift(ueberschrift));
  const ul = el("ul","werkliste");
  titel.forEach(b=>{
    const li = el("li");
    li.appendChild(el("span","werk", b.n));
    const zeile = [];
    if(b.autor) zeile.push(b.autor);
    if(b.jahr) zeile.push(b.jahr);
    if(zeile.length) li.appendChild(el("span","werk-unter", zeile.join(" · ")));
    ul.appendChild(li);
  });
  w.appendChild(ul);
  if(meta && meta.q){
    const q = el("p","quellzeile", "Abgerufen bei " + (QUELLENNAME[meta.q]||meta.q) + " am " + meta.h + ".");
    w.appendChild(q);
  }
  return w;
}
function wartetBlock(x){
  const w = el("div");
  w.appendChild(blockUeberschrift("Titel"));
  const p = el("p","quellzeile");
  const sp = SPEICHER[x.id];
  if(sp && sp.sperre) p.textContent = "Nicht abrufbar: " + sp.sperre;
  else {
    const r = rezept(x);
    p.textContent = r
      ? "Steht in der Warteschlange. Wird demnächst bei " + (QUELLENNAME[r.t]||r.t) + " geholt."
      : "Für diesen Eintrag gibt es keine maschinell abfragbare Quelle — hier gilt der berechnete Rhythmus.";
  }
  w.appendChild(p);
  return w;
}

/* ---------- Schublade für ein Buch ---------- */
function schubladeBuch(b){
  $("#sch-art").textContent = b.herkunft === "ruecken" ? "Rückenbestand" : "Neuerscheinung";
  $("#sch-art").className = "art-marke buch";
  $("#sch-land").textContent = (LAENDER[b.land]||b.land) + (b.jahr ? " · " + b.jahr : "");
  $("#sch-titel").textContent = b.n;
  $("#sch-unter").textContent = b.autor || "";
  const verlag = INDEX[b.vid];
  $("#sch-text").textContent = verlag && verlag.txt ? verlag.txt : "";

  const dl = $("#sch-daten"); dl.textContent = "";
  const reihe = (k,v)=>{
    if(!v) return;
    const d = el("div"); d.appendChild(el("dt",null,k));
    const dd = el("dd"); if(v instanceof Node) dd.appendChild(v); else dd.textContent = v;
    d.appendChild(dd); dl.appendChild(d);
  };
  reihe("Verfasst von", b.autor);
  reihe("Erschienen", b.jahr ? String(b.jahr) : null);
  if(verlag){
    const link = el("button","verlagslink", verlag.n + " ↗");
    link.type = "button";
    link.addEventListener("click", ()=> schubladeOeffnen(verlag));
    reihe("Verlag", link);
    reihe("Sitz", (verlag.ort||"") + " · " + (LAENDER[verlag.land]||verlag.land));
  }
  reihe("Nachgewiesen", (QUELLENNAME[b.quelle]||b.quelle) + ", abgerufen am " + b.geholt);

  $("#sch-bekannt").textContent = "";
  const akt = $("#sch-aktionen"); akt.textContent = "";
  if(verlag && verlag.url){
    const a = document.createElement("a");
    a.className = "knopf stark"; a.href = verlag.url; a.target="_blank"; a.rel="noopener noreferrer";
    a.textContent = "Zum Verlag ↗";
    akt.appendChild(a);
  }
  const sch = $("#schublade");
  sch.hidden = false;
  requestAnimationFrame(()=> sch.classList.add("offen"));
  $("#schliessen").focus();
  document.body.style.overflow = "hidden";
}

/* ============================================================
   DER UMLAUF — wie weit der Bestand geholt ist
   ============================================================ */
function umlaufZeichnen(){
  const u = umlaufStand();
  const notiz = document.querySelector("#blatt-umlauf .abschnitt-notiz");
  if(notiz) notiz.innerHTML = "Fünf kleine Läufe am Tag" +
    (u.stand ? "<br>Zuletzt aufgefrischt am " + u.stand : "");
  $("#umlauf-zahlen").textContent = "";
  const zahlen = [
    [u.geholt + " / " + u.gesamt, "Einträge abgerufen"],
    [u.buecher, "Titel im Speicher"],
    [u.hefte, "Ausgaben mit Inhalt"],
    [u.rueckenGeholt + " / " + u.rueckenMoeglich, "Rückenbestände"]
  ];
  zahlen.forEach(([z, t])=>{
    const k = el("div","zahlkachel");
    k.appendChild(el("b", null, String(z)));
    k.appendChild(el("span", null, t));
    $("#umlauf-zahlen").appendChild(k);
  });

  const balken = $("#umlauf-balken");
  balken.textContent = "";
  const anteil = u.gesamt ? u.geholt / u.gesamt : 0;
  const b = el("div","balken");
  const f = el("i"); f.style.width = "0%";
  b.appendChild(f);
  balken.appendChild(b);
  requestAnimationFrame(()=>{ f.style.width = Math.round(anteil*100) + "%"; });

  const liste = $("#umlauf-liste"); liste.textContent = "";
  const zeilen = ABRUFPLAN
    .map(p => ({p, sp: SPEICHER[p.i]}))
    .sort((a,b2)=> (a.sp ? a.sp.h : "0000").localeCompare(b2.sp ? b2.sp.h : "0000")
                   || a.p.n.localeCompare(b2.p.n,"de"));

  zeilen.slice(0, 40).forEach(({p, sp}, i)=>{
    const z = el("div","umlauf-zeile");
    if(i < 5) z.classList.add("dran");
    const w = el("div","wer");
    w.appendChild(el("b", null, p.n));
    w.appendChild(el("span", null, (p.k==="heft"?"Zeitschrift":"Verlag") + " · " + (QUELLENNAME[p.t]||p.t)));
    z.appendChild(w);
    if(i < 5 && !(sp && sp.sperre)) z.appendChild(el("span","marke neu","im nächsten Lauf"));
    else if(sp && sp.sperre)        z.appendChild(el("span","marke archiv","gesperrt"));
    else if(sp && sp.t && sp.t.length) z.appendChild(el("span","marke bald", sp.t.length + " Titel"));
    else                            z.appendChild(el("span","marke warte","in der Schlange"));
    z.appendChild(el("span","wann", sp ? sp.h : "—"));
    liste.appendChild(z);
  });
}

/* ============================================================
   ALLE TITEL — durchsuchbar
   ============================================================ */
function titelZeichnen(){
  const alle = BUECHER_NEU.concat(BUECHER_ALT);
  const such = $("#suche-titel").value.trim().toLowerCase();
  const herkunft = $("#filter-titel-herkunft").value;
  const land = $("#filter-titel-land").value;
  const sort = $("#sortierung-titel").value;

  let treffer = alle.filter(b=>{
    if(herkunft !== "alle" && b.herkunft !== herkunft) return false;
    if(land !== "alle" && b.land !== land) return false;
    if(such){
      const heu = [b.n, b.autor, b.v, b.ort, b.jahr].filter(Boolean).join(" ").toLowerCase();
      if(!heu.includes(such)) return false;
    }
    return true;
  });
  const cmp = {
    neu:    (a,b)=> (b.jahr||0)-(a.jahr||0) || a.n.localeCompare(b.n,"de"),
    alt:    (a,b)=> (a.jahr||9999)-(b.jahr||9999) || a.n.localeCompare(b.n,"de"),
    az:     (a,b)=> a.n.localeCompare(b.n,"de"),
    verlag: (a,b)=> a.v.localeCompare(b.v,"de") || (b.jahr||0)-(a.jahr||0)
  }[sort];
  treffer.sort(cmp);

  $("#ergebnis-titel").textContent = treffer.length + " von " + alle.length + " Titeln"
    + (alle.length ? "" : " — der Speicher füllt sich noch");
  const ziel = $("#titel-liste"); ziel.textContent = "";
  if(!treffer.length){
    ziel.appendChild(leer(alle.length ? "Nichts gefunden" : "Noch keine Titel geholt",
      alle.length ? "Setz einen Filter zurück oder such nach etwas anderem."
                  : "Die Auffrischung holt die Titel portionsweise. Unter „Umlauf“ steht, wie weit sie ist."));
    return;
  }
  treffer.slice(0, 120).forEach((b,i)=> ziel.appendChild(buchKarte(b,i)));
  if(treffer.length > 120){
    const m = leer("120 von " + treffer.length + " gezeigt", "Grenz die Suche ein, um den Rest zu sehen.");
    ziel.appendChild(m);
  }
}

function titelFilterFuellen(){
  const alle = BUECHER_NEU.concat(BUECHER_ALT);
  const sel = $("#filter-titel-land"), merk = sel.value;
  optionenFuellen(sel, landOptionen(alle));
  if(Array.from(sel.options).some(o=>o.value===merk)) sel.value = merk;
  $("#z-titel").textContent = alle.length;
}
