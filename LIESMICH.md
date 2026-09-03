# Rotes Regal

Eine digitale linke Buchhandlung, die sich selbst umräumt. 90 Verlage und 89
Zeitschriften aus dem deutsch-, englisch- und französischsprachigen Raum;
die Buchtitel und Heftausgaben stammen aus Bibliothekskatalogen und von den
Seiten der Häuser, nicht aus einer handgepflegten Liste.

## Sofort ansehen

`rotes-regal-standalone.html` im Browser öffnen. Keine Installation, kein
Server, keine Netzverbindung nötig — die Schriften kommen von Google Fonts,
ohne sie greifen die Ersatzschriften.

`rotes-regal.html` ist dieselbe Seite ohne `<!doctype>`/`<head>`/`<body>`,
weil der Artifact-Dienst diesen Rahmen selbst hinzufügt.

## Neu bauen

    ./bauen.sh

Setzt die Bausteine aus `src/` zusammen und prüft den Skriptteil mit
`node --check`. Braucht nur node und bash.

## Aufbau

    src/10-kopf.html          Farbmarken, Schriften, Kopf und Reiter
    src/11-stil-teile.html    Tisch, Buchrücken, Zeitschriftenregal, Schaufenster
    src/12-stil-teile2.html   Taktgeber, Filter, Schublade, Formulare
    src/13-stil-titel.html    Titel, Ausgaben, Umlaufansicht
    src/14-stil-nachtrag.html Kleinigkeiten
    src/20-markup.html        Das gesamte HTML-Gerüst

    src/01-katalog-verlage.js  90 Verlage: Ort, Jahr, Einordnung, Stränge, Regalzettel
    src/02-katalog-hefte.js    89 Zeitschriften, dazu Erscheinungsrhythmus und Anker
    src/03-rotation.js         Das Rotationswerk (siehe unten)
    src/04-quellen.js          Welcher Eintrag bei welcher Quelle abgefragt wird
    src/05-speicher.js         TITELSPEICHER — die abgerufenen Titel
    src/06-abrufplan.js        ABRUFPLAN — 234 fertige Abfrageadressen
    src/30..39-*.js            Darstellung, Filter, Schublade, Bestandspflege

    ernte/ernte.json           Erste Ernte im Rohformat
    ernte/sammle.py            Kleines Hilfsskript zum Einsammeln

## Wie die Rotation rechnet

Alles ergibt sich deterministisch aus dem Datum — kein Server, kein Zufall.
Wer am selben Tag hereinschaut, sieht dasselbe Regal.

| Regal            | Takt     | Inhalt |
|------------------|----------|--------|
| Wühltisch        | täglich  | 14 blind gegriffene Einträge in der Laufleiste |
| Der Tisch        | wöchentl.| 12 Neuerscheinungen, höchstens zwei je Haus |
| Kernregal        | 28 Tage  | 8 Bücher aus dem Rückenbestand, Förderband: zwei rücken nach, sechs bleiben |
| Schaufenster     | wöchentl.| ein Strang, rotiert durch alle 13 |
| Zeitschriften    | eigener  | je Heft nach seinem Erscheinungsrhythmus |

Der Kern ist ein Ring: `pool[(zyklus*2 + platz) % laenge]`. Platz 7 ist gerade
eingerückt, Platz 0 verlässt das Regal als Nächstes. Ein voller Umlauf durch
den Ring dauert `laenge/2` Zyklen.

Heftnummern werden aus belegten Ankerpunkten fortgezählt, etwa PROKLA 224 vom
September 2026 bei vier Ausgaben im Jahr. Wo ein Abruf eine echte Ausgabe
geliefert hat, schlägt sie die Berechnung; die Berechnung bleibt Rückfallebene.

## Woher die Titel kommen

| Kürzel    | Quelle | Deckt ab |
|-----------|--------|----------|
| `dnb`     | Deutsche Nationalbibliothek, SRU | 40 Verlage in DE/AT/CH. Durch das Pflichtexemplar praktisch vollständig. Mehrere Häuser gehen in eine Abfrage: `vlg="A" or vlg="B"` |
| `bnf`     | Bibliothèque nationale de France, SRU | 23 französische Häuser. Trifft unscharf — hinterher nach `dc:publisher` filtern |
| `cr`      | Crossref | 20 Zeitschriften mit DOI, mitsamt Inhaltsverzeichnis. Mehrere ISSN je Abfrage: `filter=issn:X,issn:Y` |
| `web`     | Neuerscheinungsseite des Hauses | 27 anglophone Verlage |
| `web-heft`| Seite der Zeitschrift | 61 Hefte ohne DOI |
| `*-alt`   | dieselbe Quelle mit Jahresdeckel 1998 | Rückenbestand. Wo ein Haus früher anders hieß, wird der alte Name abgefragt (La Découverte → Maspero) |

Nicht verfügbar: OpenLibrary und Library of Congress sperren per robots.txt,
Google Books drosselt nach IP. Deshalb bei den anglophonen Häusern der
Seitenabruf.

## Wie die Auffrischung läuft

Eine veröffentlichte Artifact-Seite darf selbst nichts abrufen — die CSP
blockiert jedes `fetch`. Stattdessen liest eine geplante Aufgabe fünfmal
täglich (23:30 / 01:30 / 03:30 / 07:30 / 09:30 UTC, jeweils Nacht in Europa
bzw. Nordamerika) die veröffentlichte Seite, holt **fünf** Einträge nach und
veröffentlicht sie neu. Das ist für die Quellen der schonendere Weg: ein
Abruf pro Zyklus von einer Maschine statt einer pro Besuch.

Die Auswahl trifft immer die am längsten nicht besuchten Einträge. Bei 234
Einträgen und 25 Abrufen am Tag dauert ein voller Umlauf gut anderthalb
Wochen — jede Quelle wird also etwa einmal pro Woche berührt. Zwischen den
Abrufen liegen 45 Sekunden. Seiten, die Automaten abwehren, bekommen im
Speicher ein Feld `sperre` und werden 30 Tage in Ruhe gelassen.

Die Aufgabe verändert ausschließlich den Block zwischen

    /* ===== TITELSPEICHER ANFANG ===== */
    /* ===== TITELSPEICHER ENDE ===== */

Der vollständige Auftragstext der Aufgabe steht in `auffrischung.md`.

### Speicherformat

    "dampfboot": {h:"2026-09-02", q:"dnb", t:[{t:"Titel", a:"Autor", j:"2026"}]}
    "prokla":    {h:"2026-09-02", q:"cr", nr:"224", d:"2026-08",
                  th:"Kämpfe ums Recht", t:[{t:"Aufsatz", a:"Nachname"}]}
    "akpress":   {h:"2026-09-02", q:"web", sperre:"Wehrt Automaten ab.", t:[]}

`h` = zuletzt geholt, `q` = Quellenart, `t` = Titel bzw. Aufsätze,
`u2` = abweichende Adresse, falls die geplante nicht mehr stimmt.

## Eigene Einträge

Der Reiter „Bestand pflegen" legt Verlage und Zeitschriften an, ändert und
entfernt sie. Das liegt im `localStorage` des Browsers, nicht in der Datei.
„Bestand sichern" gibt alles als JSON heraus, „Bestand einlesen" holt es
zurück. Neue Einträge nehmen sofort an der Rotation teil; wer als „Kern"
eingestuft wird, kommt ins Kernregal.

## Zum Bestand selbst

Kuratiert, nicht vollständig, und streitbar — was in einer linken Buchhandlung
ungefähr der Normalzustand ist. Die Regalzettel sind Einschätzungen, die
bibliografischen Angaben stammen aus den genannten Katalogen. Acht eingestellte
Zeitschriften stehen im Antiquariat, weil ihre Archive online geblieben sind.
