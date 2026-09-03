/* ============================================================
   START
   ============================================================ */
function start(){
  strangKaestchenBauen();
  allesNeuZeichnen();

  $$(".reiter").forEach(r => r.addEventListener("click", ()=> blattWechseln(r.dataset.blatt)));

  ["#suche-hefte","#filter-heft-rhythmus","#filter-heft-land","#filter-heft-strang","#filter-heft-tier"]
    .forEach(s => $(s).addEventListener("input", hefteZeichnen));
  ["#suche-verlage","#filter-verlag-land","#filter-verlag-strang","#filter-verlag-tier","#sortierung-verlage"]
    .forEach(s => $(s).addEventListener("input", verlageZeichnen));
  ["#suche-titel","#filter-titel-herkunft","#filter-titel-land","#sortierung-titel"]
    .forEach(s => $(s).addEventListener("input", titelZeichnen));

  $("#schliessen").addEventListener("click", schubladeSchliessen);
  $("#schleier").addEventListener("click", schubladeSchliessen);
  document.addEventListener("keydown", e => {
    if(e.key === "Escape" && !$("#schublade").hidden) schubladeSchliessen();
  });

  $("#griff").addEventListener("click", ()=>{
    const pool = BUECHER_NEU.concat(BUECHER_ALT, BESTAND.filter(x => x.st !== "archiv"));
    const x = pool[Math.floor(Math.random()*pool.length)];
    $("#griff-hinweis").textContent = "Gezogen: " + x.n;
    schubladeOeffnen(x);
  });

  $("#f-art").addEventListener("change", formularArtUmschalten);
  $("#eintragsformular").addEventListener("submit", eintragSpeichern);
  $("#formular-leeren").addEventListener("click", formularLeeren);
  $("#sichern").addEventListener("click", sichern);
  $("#einlesen-knopf").addEventListener("click", ()=> $("#einlesen").click());
  $("#einlesen").addEventListener("change", e => { if(e.target.files[0]) einlesen(e.target.files[0]); e.target.value=""; });
  $("#zuruecksetzen").addEventListener("click", ()=>{
    EIGEN = {neu:[], aenderungen:{}, versteckt:[]};
    lagerSchreiben(); allesNeuZeichnen();
    melden("Der Bestand steht wieder so da, wie er ausgeliefert wurde.");
  });

  formularArtUmschalten();
  downloadsHolen();   // im Hintergrund aufwärmen
}

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
else start();

})();
