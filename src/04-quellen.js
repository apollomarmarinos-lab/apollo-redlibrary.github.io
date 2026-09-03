/* ============================================================
   QUELLEN — woher die Titel kommen
   Regel statt Liste: aus Land und Art ergibt sich das Rezept.
   Nur Abweichungen stehen unten.

     dnb  Deutsche Nationalbibliothek, SRU        (DE/AT/CH-Verlage)
     bnf  Bibliothèque nationale de France, SRU   (FR-Verlage)
     cr   Crossref, Zeitschriftenausgaben mit DOI (Hefte)
     web  Neuerscheinungsseite des Hauses         (anglophone Verlage)

   Jeder Eintrag im Speicher merkt sich, wann er zuletzt geholt wurde.
   Die Auffrischung nimmt sich immer die ältesten — nie alles auf einmal.
   ============================================================ */

/* Verlagsname, wie ihn der Bibliothekskatalog führt (nur wo er abweicht) */
const KATALOGNAME = {
  dietz:"Karl Dietz", argument:"Argument", wagenbach:"Wagenbach", merve:"Merve",
  vsa:"VSA", dampfboot:"Westfälisches Dampfboot", nautilus:"Edition Nautilus",
  papyrossa:"PapyRossa", unrast:"Unrast", assoziation:"Assoziation A",
  assemblage:"edition assemblage", buchmacherei:"Die Buchmacherei",
  schmetterling:"Schmetterling", caira:"ça ira", tiamat:"Edition Tiamat",
  graswurzel:"Graswurzelrevolution", editionav:"Edition AV", laika:"Laika",
  tranvia:"Verbrecher", westend:"Westend", campus:"Campus", transcript:"transcript",
  suhrkamp:"Suhrkamp", matthes:"Matthes & Seitz", mandelbaum:"Mandelbaum",
  bahoe:"bahoe books", promedia:"Promedia", rotpunkt:"Rotpunkt", passagen:"Passagen",
  turia:"Turia + Kant", diaphanes:"diaphanes", brumaire:"Brumaire", alibri:"Alibri",
  trotzdem:"Trotzdem", querverlag:"Querverlag", wortenmeer:"w_orten & meer",
  konkretverlag:"konkret", dietznachf:"Dietz", klartext:"Klartext",
  decouverte:"La Découverte", lafabrique:"La Fabrique", socialessociales:"Éditions sociales",
  amsterdam:"Éditions Amsterdam", agone:"Agone", syllepse:"Syllepse",
  libertalia:"Libertalia", lechappee:"L'Échappée", divergences:"Divergences",
  croquant:"Croquant", raisons:"Raisons d'agir", nada:"Nada",
  passagerclandestin:"Passager clandestin", wildproject:"Wildproject",
  ladispute:"La Dispute", commun:"Éditions du commun", icibas:"Ici-bas",
  acl:"Atelier de création libertaire", delga:"Delga", atelier:"Éditions de l'Atelier",
  eclat:"Éclat", rueechiquier:"Rue de l'échiquier", grevis:"Grevis", lux:"Lux"
};

/* Zeitschriften mit DOI. Wo die ISSN belegt ist, steht sie hier;
   sonst löst die Auffrischung sie einmalig über die Crossref-Titelsuche auf
   und schreibt sie zurück. */
const ISSN = {
  prokla:"0342-8176",        // belegt
  nlr:"0028-6060",           // belegt
  hm:"1465-4466", antipode:"0066-4812", raceclass:"0306-3968",
  scisoc:"0036-8237", rethinking:"0893-5696", actuelmarx:"0994-4524",
  multitudes:"0292-0107", mouvements:"1291-6412", argumentz:"0004-1157",
  dissent:"0012-3846", anarchiststudies:"0967-3393", radphil:"0300-211X",
  mr:"0027-0520", widerspruch:"1420-0945"
};
/* Hefte, deren ISSN erst gesucht werden muss (Crossref-Titelsuche, dann merken) */
const CR_SUCHE = ["catalyst","sozgesch","zmarx","emanzipation","luxemburg"];

/* Verlage ohne Bibliotheksdeckung: eigene Neuerscheinungsseite.
   Stimmt eine Adresse nicht mehr, sucht die Auffrischung einmal den
   Buch-Bereich der Startseite und schreibt die gefundene Adresse zurück. */
const WEBPFAD = {
  verso:"https://www.versobooks.com/collections/new-releases",
  pluto:"https://www.plutobooks.com/new-books/",
  haymarket:"https://www.haymarketbooks.org/books",
  mrpress:"https://monthlyreview.org/press/books/",
  akpress:"https://www.akpress.org/catalog/new-releases.html",
  pmpress:"https://www.pmpress.org/index.php?l=new_releases",
  lawrence:"https://www.lwbooks.co.uk/books",
  semiotexte:"https://semiotexte.com/collections/all",
  repeater:"https://repeaterbooks.com/collections/new-releases",
  commonnotions:"https://www.commonnotions.org/store",
  autonomedia:"https://autonomedia.org/",
  minorcomp:"https://www.minorcompositions.info/",
  freedom:"https://freedompress.org.uk/shop/",
  duke:"https://www.dukeupress.edu/Explore-Subjects/New-Books",
  newpress:"https://thenewpress.com/books",
  beacon:"https://www.beacon.org/",
  sevenstories:"https://sevenstories.com/collections/new-releases",
  orbooks:"https://www.orbooks.com/",
  betweenlines:"https://btlbooks.com/books",
  fernwood:"https://fernwoodpublishing.ca/books",
  daraja:"https://darajapress.com/publications",
  leftword:"https://mayday.leftword.com/collections/new-releases",
  pathfinder:"https://www.pathfinderpress.com/collections/new",
  microcosm:"https://microcosmpublishing.com/catalog",
  zero:"https://www.zero-books.net/",
  brill:"https://brill.com/display/serial/HM"
};

/* Aus einem Katalogeintrag das Abruf-Rezept ableiten. */
function rezept(x){
  if(x.art === "heft"){
    if(ISSN[x.id])            return {t:"cr", issn: ISSN[x.id]};
    if(CR_SUCHE.includes(x.id)) return {t:"cr-suche", titel: x.n};
    if(x.st === "archiv") return null;        // eingestellt: nichts mehr zu holen
    return x.url ? {t:"web-heft", url:x.url} : null;   // aktuelle Ausgabe von der eigenen Seite
  }
  if(WEBPFAD[x.id])           return {t:"web", url: WEBPFAD[x.id]};
  const name = KATALOGNAME[x.id] || x.n.replace(/^(Verlag|Éditions|Edition|Les Éditions( de l'| du)?)\s+/i,"").trim();
  if(["DE","AT","CH"].includes(x.land)) return {t:"dnb", v:name};
  if(x.land === "FR")                   return {t:"bnf", v:name};
  return x.url ? {t:"web", url:x.url} : null;
}

/* Rückenbestand: dieselbe Quelle, nur mit Jahresdeckel. Wo ein Haus früher
   anders hieß, wird der historische Name abgefragt — dort liegt das Gewicht. */
const ALTNAME = {
  decouverte:"Maspero",          // François Maspero, bis 1982
  socialessociales:"Éditions sociales",
  suhrkamp:"edition suhrkamp",
  tranvia:"Verbrecher"
};
const RUECKEN_GRENZE = 1998;     // alles davor gilt als Rückenbestand

function rezeptAlt(x){
  if(x.art !== "verlag") return null;
  const r = rezept(x);
  if(!r || (r.t !== "dnb" && r.t !== "bnf")) return null;   // nur Bibliothekskataloge
  return {t: r.t + "-alt", v: ALTNAME[x.id] || r.v, bis: RUECKEN_GRENZE};
}
