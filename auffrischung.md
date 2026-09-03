# Auftragstext der geplanten Auffrischung

Läuft fünfmal täglich in einer frischen Sitzung ohne Gedächtnis, deshalb ist
der Text vollständig. Cron (UTC): `30 23,1,3,7,9 * * *`
Benachrichtigungen sind abgeschaltet — bei fünf Läufen am Tag will das niemand.

---

Der Text wird von der Aufgabenverwaltung gehalten. Die tragenden Punkte:

1. **Seite lesen und zurückschneiden.** Die gelesene Fassung enthält vorne das
   vom Dienst eingefügte Rahmenwerk (`<!doctype html>…<!-- frame-runtime -->`)
   und hinten `</body></html>`. Beides gehört nicht zum Quelltext und wird
   beim Veröffentlichen erneut hinzugefügt. Ohne Schnitt ab
   `<title>Rotes Regal</title>` verschachtelt sich die Seite mit jedem Lauf.
2. **Warteschlange:** die fünf Einträge mit dem ältesten `h`. Gesperrte
   überspringen, solange ihr `h` keine 30 Tage alt ist. Nach Uhrzeit
   bevorzugen: nachts in Europa die europäischen Quellen, morgens UTC die
   anglophonen.
3. **Abrufen:** ein Abruf je Eintrag, 45 Sekunden Abstand. `{JAHR}` und
   `{JAHR-1}` in der Adresse ersetzen. Je Quellenart ein fester Abfrage-Prompt,
   der ausschließlich Zeilen im Format `TITEL | AUTOR | JAHR` zurückgibt.
4. **Speicher ersetzen:** nur der Block zwischen den Markierungen, höchstens
   10 Titel je Eintrag, `stand` auf das heutige Datum. Fehlschläge als
   `sperre` festhalten statt verschweigen.
5. **Dreifach prüfen, dann veröffentlichen:** Datei beginnt mit `<title>`,
   enthält kein `frame-runtime`, Skriptteil besteht `node --check`, Datei ist
   nicht unter 200 000 Bytes. Scheitert etwas, lieber nichts veröffentlichen —
   die alte Fassung bleibt dann stehen.
