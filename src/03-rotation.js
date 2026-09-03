/* ============================================================
   ROTATIONSWERK
   Alles deterministisch aus dem Datum. Kein Zufall, keine Server.
   Wer am selben Tag schaut, sieht dasselbe Regal.
   ============================================================ */

const EPOCHE = Date.UTC(2020, 0, 6);        // Montag
const TAG_MS = 86400000;
const KERN_ZYKLUS = 28;                      // Tage, bis das Kernregal weiterrückt
const KERN_PLAETZE = 8;
const KERN_VORSCHUB = 2;                     // wie viele Plätze pro Zyklus wechseln
const TISCH_PLAETZE = 12;

/* --- deterministischer Zufall (mulberry32 + xmur3) --- */
function saatVon(str){
  let h = 1779033703 ^ str.length;
  for(let i=0;i<str.length;i++){
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return (h ^= h >>> 16) >>> 0;
}
function wuerfel(saat){
  let a = saat >>> 0;
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function mischen(liste, saat){
  const a = liste.slice(), r = wuerfel(saat);
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(r()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* --- Zeitrechnung --- */
function tagesNummer(d){ return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()) - EPOCHE)/TAG_MS); }
function wochenNummer(d){ return Math.floor(tagesNummer(d)/7); }
function zyklusNummer(d){ return Math.floor(tagesNummer(d)/KERN_ZYKLUS); }

const MONATE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const MON_KURZ = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

/* ============================================================
   ERSCHEINUNGSRHYTHMUS EINES HEFTES
   ============================================================ */
function monateVon(h){
  const f = h.f;
  if(f.m) return {monate: f.m, geschaetzt: false};
  // gleichmäßig über das Jahr verteilt, Phase aus der id
  const n = Math.min(f.n, 12);
  const phase = saatVon(h.id) % Math.max(1, Math.round(12/n));
  const monate = [];
  for(let k=0;k<n;k++){
    let m = 1 + ((Math.round(k*12/n) + phase) % 12);
    if(!monate.includes(m)) monate.push(m);
  }
  monate.sort((a,b)=>a-b);
  return {monate, geschaetzt: true};
}

function terminliste(h, jahrVon, jahrBis){
  const {monate, geschaetzt} = monateVon(h);
  const tag = h.f.tag || 1;
  const liste = [];
  for(let j=jahrVon;j<=jahrBis;j++)
    for(const m of monate) liste.push({d: new Date(j, m-1, tag), j, m});
  liste.sort((a,b)=>a.d-b.d);
  return {liste, geschaetzt};
}

function heftStand(h, jetzt){
  const f = h.f;
  if(h.st === 'archiv') return {typ:'archiv', text:'Archiv · eingestellt ' + h.ende, frisch:false, dringlich: 9999};

  if(f.taeglich){
    return {typ:'taeglich', text:'Erscheint werktäglich', kurz:'täglich', frisch:true, dringlich:0, nr:null};
  }
  if(f.woche !== undefined){
    const wt = f.woche;                       // 1 = Montag ... 4 = Donnerstag
    const heute = jetzt.getDay();
    let zurueck = (heute - wt + 7) % 7;
    const letzte = new Date(jetzt); letzte.setDate(jetzt.getDate() - zurueck); letzte.setHours(0,0,0,0);
    const naechste = new Date(letzte); naechste.setDate(letzte.getDate()+7);
    const tageBis = Math.round((naechste - jetzt)/TAG_MS);
    const wtName = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"][wt];
    return {typ:'woche', letzte, naechste, tageBis,
            text:'Jeden ' + wtName, kurz:'wöchentlich',
            frisch: zurueck <= 2, dringlich: tageBis, nr:null};
  }
  if(f.unregel){
    return {typ:'unregel', text:'Erscheint unregelmäßig' + (f.n ? ' · etwa ' + f.n + '× im Jahr' : ''),
            kurz:'unregelmäßig', frisch:false, dringlich: 500, nr:null};
  }

  const {liste, geschaetzt} = terminliste(h, jetzt.getFullYear()-6, jetzt.getFullYear()+2);
  let iLetzte = -1;
  for(let i=0;i<liste.length;i++) if(liste[i].d <= jetzt) iLetzte = i; else break;
  const letzte = liste[iLetzte], naechste = liste[iLetzte+1];

  let nr = null;
  if(h.ank && !geschaetzt){
    const [aj, am] = h.ank.ym.split('-').map(Number);
    const iAnker = liste.findIndex(x => x.j===aj && x.m===am);
    if(iAnker >= 0) nr = h.ank.nr + (iLetzte - iAnker);
  }

  const tageSeit = Math.round((jetzt - letzte.d)/TAG_MS);
  const tageBis  = Math.round((naechste.d - jetzt)/TAG_MS);
  const abstand  = 365 / h.f.n;

  return {
    typ:'periodisch', letzte: letzte.d, naechste: naechste.d, tageSeit, tageBis, nr, geschaetzt,
    text: rhythmusText(h.f.n),
    kurz: rhythmusKurz(h.f.n),
    letzteText: MONATE[letzte.m-1] + ' ' + letzte.j,
    naechsteText: MONATE[naechste.m-1] + ' ' + naechste.j,
    frisch: tageSeit <= Math.min(21, abstand/3),
    baldda: tageBis <= 10,
    dringlich: tageBis
  };
}

function rhythmusText(n){
  if(n>=300) return 'Erscheint werktäglich';
  if(n>=45)  return 'Erscheint wöchentlich';
  if(n>=24)  return 'Erscheint vierzehntäglich';
  if(n>=10)  return 'Erscheint monatlich (' + n + '× im Jahr)';
  if(n===6)  return 'Erscheint zweimonatlich';
  if(n===4)  return 'Erscheint vierteljährlich';
  if(n===3)  return 'Erscheint dreimal im Jahr';
  if(n===2)  return 'Erscheint halbjährlich';
  if(n===1)  return 'Erscheint einmal im Jahr';
  return 'Erscheint ' + n + '× im Jahr';
}
function rhythmusKurz(n){
  if(n>=300) return 'täglich';
  if(n>=45)  return 'wöchentlich';
  if(n>=10)  return 'monatlich';
  if(n===6)  return 'zweimonatlich';
  if(n===4)  return 'quartalsweise';
  if(n===3)  return '3× im Jahr';
  if(n===2)  return 'halbjährlich';
  if(n===1)  return 'jährlich';
  return n + '× im Jahr';
}

/* ============================================================
   DIE REGALE
   ============================================================ */

/* Kernregal: ein langsames Förderband. Pro Zyklus (28 Tage) rücken
   KERN_VORSCHUB Plätze weiter — der Rest bleibt stehen. */
function kernRegal(bestand, jetzt){
  const pool = mischen(bestand.filter(x => x.tier === 'kern' && x.st !== 'archiv'), 20200106);
  if(!pool.length) return [];
  const z = zyklusNummer(jetzt);
  const raus = [];
  for(let i=0;i<KERN_PLAETZE;i++){
    const idx = (z*KERN_VORSCHUB + i) % pool.length;
    // Platz 0 verlaesst das Regal als naechstes, Platz 7 ist gerade eingerueckt.
    raus.push({...pool[idx], _platz:i,
               _neuImKern: i >= KERN_PLAETZE - KERN_VORSCHUB,
               _bleibtNoch: Math.ceil((i+1)/KERN_VORSCHUB),
               _maxRest: Math.ceil(KERN_PLAETZE/KERN_VORSCHUB)});
  }
  raus.reverse();   // frisch eingerueckt steht links, ausrueckend rechts
  return raus;
}

/* Tisch: wechselt wöchentlich, gewichtet zugunsten kleiner Verlage */
function tischRegal(bestand, jetzt, ausschluss){
  const w = wochenNummer(jetzt);
  const kandidaten = bestand.filter(x => x.st !== 'archiv' && !ausschluss.has(x.id));
  const gewichtet = [];
  for(const x of kandidaten){
    const g = x.tier === 'untergrund' ? 3 : x.tier === 'haus' ? 2 : 1;
    for(let i=0;i<g;i++) gewichtet.push(x);
  }
  const gemischt = mischen(gewichtet, saatVon('tisch') ^ w);
  const raus = [], gesehen = new Set();
  for(const x of gemischt){
    if(gesehen.has(x.id)) continue;
    gesehen.add(x.id); raus.push(x);
    if(raus.length >= TISCH_PLAETZE) break;
  }
  return raus;
}

/* Wühltisch: täglicher Zufallsfund */
function wuehltisch(bestand, jetzt, anzahl){
  const t = tagesNummer(jetzt);
  return mischen(bestand, saatVon('wuehl') ^ t).slice(0, anzahl);
}

/* Schaufenster: ein Strang pro Woche, rotiert durch alle */
const STRAENGE = {
  marx:      {n:'Marxistische Theorie',        ico:'✦'},
  theorie:   {n:'Kritische Theorie',           ico:'◈'},
  anarch:    {n:'Anarchismus & Autonomie',     ico:'✕'},
  fem:       {n:'Feminismus & Queer',          ico:'♀'},
  antifa:    {n:'Antifaschismus & Antirassismus', ico:'▲'},
  arbeit:    {n:'Arbeit & Klasse',             ico:'⚒'},
  oekonomie: {n:'Politische Ökonomie',         ico:'§'},
  oeko:      {n:'Ökologie & Klima',            ico:'❋'},
  koloni:    {n:'Antikolonial & Global',       ico:'◐'},
  stadt:     {n:'Stadt & Wohnen',              ico:'⌂'},
  technik:   {n:'Technik & Digitales',         ico:'⌁'},
  gesch:     {n:'Geschichte der Bewegung',     ico:'⧖'},
  kunst:     {n:'Kunst & Literatur',           ico:'☾'}
};
function schaufenster(jetzt){
  const keys = mischen(Object.keys(STRAENGE), 1968);
  return keys[wochenNummer(jetzt) % keys.length];
}
