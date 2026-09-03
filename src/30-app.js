/* ============================================================
   DER LADEN — Zustand, Darstellung, Bedienung
   ============================================================ */
(function(){
"use strict";

const LAGER = "rotesregal.bestand.v1";
const HEUTE = new Date();

const LAENDER = {DE:"Deutschland", AT:"Österreich", CH:"Schweiz", FR:"Frankreich",
  UK:"Großbritannien", US:"USA", CA:"Kanada", NL:"Niederlande", IT:"Italien",
  ES:"Spanien", IN:"Indien", ZA:"Südafrika"};
const TIER_NAME = {kern:"Kern", haus:"Haus", untergrund:"Untergrund"};
const TIER_ERKL = {
  kern:"Steht im Kernregal und rotiert langsam",
  haus:"Etabliertes Haus mit stabilem Programm",
  untergrund:"Klein, unabhängig, kollektiv oder im Selbstverlag"
};

/* ---------- Speicher, defensiv ---------- */
function lagerLesen(){
  try{
    const roh = localStorage.getItem(LAGER);
    if(!roh) return {neu:[], aenderungen:{}, versteckt:[]};
    const d = JSON.parse(roh);
    return {neu: d.neu||[], aenderungen: d.aenderungen||{}, versteckt: d.versteckt||[]};
  }catch(e){ return {neu:[], aenderungen:{}, versteckt:[]}; }
}
function lagerSchreiben(){
  try{ localStorage.setItem(LAGER, JSON.stringify(EIGEN)); }
  catch(e){ melden("Konnte nicht gespeichert werden — der Browser lässt keinen Speicher zu. Die Änderung gilt für diese Sitzung.", true); }
}
let EIGEN = lagerLesen();

/* ---------- Bestand zusammensetzen ---------- */
let BESTAND = [];
function bestandBauen(){
  const grund = [
    ...VERLAGE.map(v => ({...v, art:"verlag"})),
    ...HEFTE.map(h => ({...h, art:"heft"}))
  ];
  const versteckt = new Set(EIGEN.versteckt);
  BESTAND = grund
    .filter(x => !versteckt.has(x.id))
    .map(x => EIGEN.aenderungen[x.id] ? {...x, ...EIGEN.aenderungen[x.id], _geaendert:true} : x)
    .concat(EIGEN.neu.map(x => ({...x, _eigen:true})));
  BESTAND.forEach(x => { if(!x.st) x.st = "aktiv"; if(!x.s) x.s = []; });
}

/* ---------- Kleinkram ---------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
function klickbar(n, fn){
  n.setAttribute("role","button");
  n.setAttribute("tabindex","0");
  n.addEventListener("click", fn);
  n.addEventListener("keydown", e => {
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); fn(e); }
  });
  return n;
}
function el(tag, klasse, text){
  const n = document.createElement(tag);
  if(klasse) n.className = klasse;
  if(text != null) n.textContent = text;
  return n;
}
function datumLang(d){
  const wt = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"][d.getDay()];
  return wt + ", " + d.getDate() + ". " + MONATE[d.getMonth()] + " " + d.getFullYear();
}
function stapel(knoten, i){ knoten.style.animationDelay = Math.min(i,16)*26 + "ms"; }

/* ============================================================
   DARSTELLUNG: Kopfzeilen
   ============================================================ */
function kopfZeichnen(){
  $("#datumszeile").innerHTML = "Auflage vom <b>" + datumLang(HEUTE) + "</b>";
  $("#fuss-datum").textContent = "Stand dieser Ansicht: " + datumLang(HEUTE) + ".";
  $("#bestandszahl").textContent = BESTAND.length;
  $("#landzahl").textContent = new Set(BESTAND.map(x=>x.land)).size;
  $("#z-hefte").textContent   = BESTAND.filter(x=>x.art==="heft" && x.st!=="archiv").length;
  $("#z-verlage").textContent = BESTAND.filter(x=>x.art==="verlag").length;
  $("#z-archiv").textContent  = BESTAND.filter(x=>x.st==="archiv").length;
}

/* ============================================================
   TICKER — der tägliche Wühltisch
   ============================================================ */
function tickerZeichnen(){
  const funde = wuehltisch(BESTAND.filter(x=>x.st!=="archiv"), HEUTE, 14);
  const bahn = $("#tickerlauf");
  bahn.textContent = "";
  const eintraege = funde.map(x => {
    const s = el("span");
    s.innerHTML = "<i>◆</i> " + x.n + " · " + (x.ort||"") + (x.jahr? " · seit "+x.jahr : "");
    return s;
  });
  // zweimal, damit der Umlauf nahtlos ist
  eintraege.forEach(e => bahn.appendChild(e));
  eintraege.forEach(e => bahn.appendChild(e.cloneNode(true)));
}

/* ============================================================
   DER TISCH
   ============================================================ */
function stueckKarte(x, i){
  const k = el("div", "stueck");
  stapel(k, i);
  const kopf = el("div","stueck-kopf");
  const art = el("span","art-marke" + (x.art==="heft"?" heft":""), x.art==="heft"?"Heft":"Verlag");
  kopf.appendChild(art);
  kopf.appendChild(el("span","land-marke", x.land));
  k.appendChild(kopf);

  k.appendChild(el("h3", null, x.n));

  const unter = x.art==="heft"
    ? (x.unter || (x.hrsg ? "Herausgegeben von " + x.hrsg : ""))
    : (x.bek && x.bek.length ? x.bek.slice(0,2).join(" · ") : (x.txt||"").slice(0,90));
  k.appendChild(el("p","unter", unter));

  const fuss = el("div","stueck-fuss");
  fuss.appendChild(el("span","ort", (x.ort||"") + (x.jahr ? " · " + x.jahr : "")));
  const tp = el("span","tier-punkt " + x.tier, TIER_NAME[x.tier]||"");
  fuss.appendChild(tp);
  k.appendChild(fuss);

  klickbar(k, ()=> schubladeOeffnen(x));
  return k;
}

/* tischZeichnen() und kernZeichnen() stehen in 33-titel.js —
   sie arbeiten mit Buchtiteln statt mit Verlagsnamen. */

/* ============================================================
   SCHAUFENSTER
   ============================================================ */
function schaufensterZeichnen(){
  const key = schaufenster(HEUTE);
  const strang = STRAENGE[key];
  $("#sf-zeichen").textContent = strang.ico;
  $("#sf-titel").textContent = strang.n;

  const treffer = BESTAND.filter(x => x.s.includes(key) && x.st !== "archiv");
  const gemischt = mischen(treffer, saatVon(key) ^ wochenNummer(HEUTE)).slice(0, 26);
  $("#sf-zahl").textContent = treffer.length + " Titel im Bestand · " + gemischt.length + " im Fenster";

  const ziel = $("#sf-inhalt"); ziel.textContent = "";
  gemischt.forEach((x,i)=>{
    const c = el("button","chip"); c.type="button"; stapel(c,i);
    c.innerHTML = "<b></b> <span class='mini'></span>";
    c.querySelector("b").textContent = x.n;
    c.querySelector(".mini").textContent = x.land;
    c.addEventListener("click", ()=> schubladeOeffnen(x));
    ziel.appendChild(c);
  });
}

/* ============================================================
   TAKTGEBER
   ============================================================ */
function zifferblatt(anteil, beschriftung){
  const r = 15, u = 2*Math.PI*r;
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox","0 0 40 40");
  svg.setAttribute("width","40"); svg.setAttribute("height","40");
  svg.setAttribute("class","zifferblatt"); svg.setAttribute("aria-hidden","true");
  svg.innerHTML =
    '<circle class="spur" cx="20" cy="20" r="'+r+'"></circle>' +
    '<circle class="bogen" cx="20" cy="20" r="'+r+'" stroke-dasharray="'+u+'" stroke-dashoffset="'+u+'"></circle>' +
    '<text x="20" y="23" text-anchor="middle">'+beschriftung+'</text>';
  requestAnimationFrame(()=>{
    const b = svg.querySelector(".bogen");
    if(b) b.setAttribute("stroke-dashoffset", String(u * (1-anteil)));
  });
  return svg;
}

function taktgeberZeichnen(){
  const tag = tagesNummer(HEUTE);
  const imTag   = (HEUTE.getHours()*60+HEUTE.getMinutes())/1440;
  const imWoche = (tag % 7)/7;
  const imZyklus= (tag % KERN_ZYKLUS)/KERN_ZYKLUS;

  const naechsteHefte = BESTAND
    .filter(x => x.art==="heft" && x.st!=="archiv")
    .map(x => ({x, s: heftStand(x, HEUTE)}))
    .filter(o => o.s.typ==="periodisch" || o.s.typ==="woche")
    .sort((a,b)=> a.s.dringlich - b.s.dringlich)[0];

  const takte = [
    {t:"Wühltisch", a:imTag,   z:"Tag",
     p:"Vierzehn blind gegriffene Titel laufen oben durch die Leiste. Morgen sind es andere.",
     n:"Wechselt um Mitternacht"},
    {t:"Der Tisch", a:imWoche, z:"Woche",
     p:"Zwölf Titel vorne auf dem Tisch, zugunsten kleiner Verlage gewichtet.",
     n:"Neu gelegt in " + (7 - tag%7) + " Tagen"},
    {t:"Kernregal", a:imZyklus, z:"28 T",
     p:"Acht feste Plätze. Pro Zyklus rücken zwei Titel nach, sechs bleiben stehen.",
     n:"Vorschub in " + (KERN_ZYKLUS - tag%KERN_ZYKLUS) + " Tagen"},
    {t:"Zeitschriften", a:null, z:"",
     p:"Jedes Heft folgt seinem eigenen Erscheinungsrhythmus, vom Tagesblatt bis zum Jahrbuch.",
     n: naechsteHefte ? "Als Nächstes: " + naechsteHefte.x.n : ""}
  ];

  const ziel = $("#taktgeber"); ziel.textContent = "";
  takte.forEach(t=>{
    const k = el("div","takt");
    const kopf = el("div","takt-kopf");
    if(t.a !== null) kopf.appendChild(zifferblatt(t.a, t.z));
    kopf.appendChild(el("h4",null,t.t));
    k.appendChild(kopf);
    k.appendChild(el("p",null,t.p));
    if(t.n) k.appendChild(el("span","naechst",t.n));
    ziel.appendChild(k);
  });
}
