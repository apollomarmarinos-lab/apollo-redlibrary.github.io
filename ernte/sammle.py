#!/usr/bin/env python3
"""Nimmt eine Zeile 'id|quelle|nutzlast' und legt sie in ernte.json ab."""
import json, sys, os, datetime
P = "/home/claude/buchladen/ernte/ernte.json"
d = json.load(open(P)) if os.path.exists(P) else {}
eid, quelle = sys.argv[1], sys.argv[2]
heute = datetime.date.today().isoformat()
titel = []
for zeile in sys.stdin.read().strip().split("\n"):
    zeile = zeile.strip()
    if not zeile or zeile.startswith(("N=", "TOTAL=", "JOURNAL=", "ERROR")): continue
    teile = [t.strip().strip('"') for t in zeile.split("|")]
    if len(teile) < 2: continue
    e = {"t": teile[0]}
    if len(teile) > 1 and teile[1] not in ("-", ""): e["a"] = teile[1]
    if len(teile) > 2 and teile[2] not in ("-", ""): e["j"] = teile[2]
    titel.append(e)
d[eid] = {"h": heute, "q": quelle, "t": titel}
json.dump(d, open(P, "w"), ensure_ascii=False, indent=1)
print(f"{eid}: {len(titel)} Titel gespeichert · Speicher hat {len(d)} Einträge")
