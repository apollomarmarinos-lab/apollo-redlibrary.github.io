/* ============================================================
   KATALOG — VERLAGE
   tier: "kern"      = Kanon, rotiert langsam im Kernregal
         "haus"      = etabliert, feste Größe
         "untergrund"= klein, unabhängig, Kollektiv, Zine-nah
   ============================================================ */

const VERLAGE = [

/* ---------- DEUTSCHSPRACHIG ---------- */
{id:"dietz", n:"Karl Dietz Verlag Berlin", ort:"Berlin", land:"DE", jahr:1945, tier:"kern",
 s:["marx","gesch"], url:"https://dietzberlin.de",
 bek:["Marx-Engels-Werke (MEW)","Rosa Luxemburg: Gesammelte Werke","Marx-Engels-Gesamtausgabe (MEGA)"],
 txt:"Das Archiv der Arbeiterbewegung als Verlag. Wer die blauen MEW-Bände im Regal stehen hat, hat sie von hier."},

{id:"argument", n:"Argument Verlag", ort:"Hamburg / Berlin", land:"DE", jahr:1959, tier:"kern",
 s:["marx","theorie","fem"], url:"https://www.argument.de",
 bek:["Historisch-Kritisches Wörterbuch des Marxismus","Das Argument (Zeitschrift)","Ariadne Krimis"],
 txt:"Aus einem Studentenzirkel um Wolfgang Fritz Haug geworden. Das HKWM ist das ambitionierteste Wörterbuchprojekt der Linken – und wird seit Jahrzehnten Band für Band fertig."},

{id:"wagenbach", n:"Verlag Klaus Wagenbach", ort:"Berlin", land:"DE", jahr:1964, tier:"kern",
 s:["kunst","theorie","gesch"], url:"https://www.wagenbach.de",
 bek:["Quartheft-Reihe","Pier Paolo Pasolini","Erich Fried"],
 txt:"Der Verlag der roten Quarthefte. Wagenbachs Räume wurden 1972 wegen der Baader-Meinhof-Dokumentation durchsucht – heute ein Haus für italienische Literatur und feine Politik."},

{id:"merve", n:"Merve Verlag", ort:"Berlin / Leipzig", land:"DE", jahr:1970, tier:"kern",
 s:["theorie","kunst"], url:"https://merve.de",
 bek:["Deleuze/Guattari: Rhizom","Baudrillard: Agonie des Realen","Foucault: Von der Subversion des Wissens"],
 txt:"Die bunten Rauten. Merve hat die französische Theorie nach Deutschland geschmuggelt, im Taschenformat, ohne Fußnotenapparat, zum Mitnehmen in der Jackentasche."},

{id:"vsa", n:"VSA Verlag", ort:"Hamburg", land:"DE", jahr:1972, tier:"haus",
 s:["oekonomie","arbeit","marx"], url:"https://www.vsa-verlag.de",
 bek:["Sozialismus.de (Zeitschrift)","Gewerkschaftliche Zeitgeschichte","Krisenanalysen"],
 txt:"Gewerkschaftsnahe politische Ökonomie, verlässlich und in großer Zahl. Wenn du wissen willst, wie eine Tarifrunde theoretisch aussieht: hier."},

{id:"dampfboot", n:"Verlag Westfälisches Dampfboot", ort:"Münster", land:"DE", jahr:1976, tier:"haus",
 s:["marx","theorie","oekonomie"], url:"https://www.dampfboot-verlag.de",
 bek:["PROKLA","Reihe Theorie und Geschichte des Bürgerlichen Staates"],
 txt:"Benannt nach der Zeitschrift, in der Marx 1847 publizierte. Hausverlag der PROKLA und Adresse für kritische Sozialwissenschaft mit Anspruch."},

{id:"nautilus", n:"Edition Nautilus", ort:"Hamburg", land:"DE", jahr:1974, tier:"haus",
 s:["anarch","kunst","gesch"], url:"https://edition-nautilus.de",
 bek:["Flugschriften-Reihe","Anarchistische Klassiker","Internationale Literatur"],
 txt:"Aus der Hamburger Sponti-Szene. Die Flugschriften sind dünn, schnell gelesen und treffen erstaunlich oft ins Schwarze."},

{id:"papyrossa", n:"PapyRossa Verlag", ort:"Köln", land:"DE", jahr:1990, tier:"haus",
 s:["marx","oekonomie","gesch"], url:"https://papyrossa.de",
 bek:["Basiswissen-Reihe","Neue Kleine Bibliothek"],
 txt:"Gegründet im Jahr, in dem alles andere schloss. Die Basiswissen-Bände sind die günstigste Art, sich in ein Thema einzulesen."},

{id:"unrast", n:"Unrast Verlag", ort:"Münster", land:"DE", jahr:1989, tier:"haus",
 s:["antifa","fem","koloni"], url:"https://www.unrast-verlag.de",
 bek:["Reihe antifaschistische Politik","Kritische Weißseinsforschung","Transparent-Reihe"],
 txt:"Kollektivbetrieb. Wenn irgendwo ein antifaschistisches Rechercheergebnis zum Buch wird, steht meistens Unrast drauf."},

{id:"assoziation", n:"Assoziation A", ort:"Berlin / Hamburg", land:"DE", jahr:1994, tier:"untergrund",
 s:["arbeit","anarch","stadt"], url:"https://www.assoziation-a.de",
 bek:["Operaismus-Klassiker","Stadtforschung von unten","Bewegungsgeschichte"],
 txt:"Aus dem Zusammenschluss autonomer Verlagsprojekte. Hier erscheint der italienische Operaismus auf Deutsch, und Bücher über Kämpfe, die sonst niemand dokumentiert."},

{id:"assemblage", n:"edition assemblage", ort:"Münster", land:"DE", jahr:2011, tier:"untergrund",
 s:["fem","antifa","koloni"], url:"https://www.edition-assemblage.de",
 bek:["queer-feministische Theorie","Empowerment-Reihe","Antira-Praxisbücher"],
 txt:"Jung, laut, konsequent. Der Verlag hat die Sprache der letzten fünfzehn Jahre linker Bewegung mitgeprägt – und druckt Bücher, die man tatsächlich in Plena weiterreicht."},

{id:"buchmacherei", n:"Die Buchmacherei", ort:"Berlin", land:"DE", jahr:2010, tier:"untergrund",
 s:["marx","gesch","arbeit"], url:"https://diebuchmacherei.de",
 bek:["Rätekommunismus","Arbeiterbewegungsgeschichte","Wiederentdeckungen"],
 txt:"Ein Verlag ohne Verlagshaus. Gräbt Texte des Rätekommunismus und der undogmatischen Linken aus, die sonst in Kellern verrotten würden."},

{id:"schmetterling", n:"Schmetterling Verlag", ort:"Stuttgart", land:"DE", jahr:1985, tier:"untergrund",
 s:["theorie","gesch","marx"], url:"https://www.schmetterling-verlag.de",
 bek:["Reihe theorie.org","Anti-Bibliothek"],
 txt:"theorie.org ist die beste Einstiegsreihe, die es auf Deutsch gibt: 150 Seiten pro Strömung, klar geschrieben, ohne Weihrauch."},

{id:"caira", n:"ça ira Verlag", ort:"Freiburg / Wien", land:"DE", jahr:1985, tier:"untergrund",
 s:["theorie","marx"], url:"https://www.ca-ira.net",
 bek:["Wertkritik","Kritische Theorie","Adorno-Umfeld"],
 txt:"Streitlustig, schmal im Programm, kompromisslos in der Sache. Der Verlag der Wertkritik und ihrer Nachbarschaften."},

{id:"tiamat", n:"Edition Tiamat", ort:"Berlin", land:"DE", jahr:1979, tier:"untergrund",
 s:["kunst","theorie","gesch"], url:"https://edition-tiamat.de",
 bek:["Critica Diabolis-Reihe"],
 txt:"Klaus Bittermanns Ein-Mann-Unternehmen. Über 250 Bände Critica Diabolis: Polemik, Subkultur, und der lange Streit der Linken mit sich selbst."},

{id:"graswurzel", n:"Verlag Graswurzelrevolution", ort:"Nettersheim", land:"DE", jahr:1988, tier:"untergrund",
 s:["anarch","oeko"], url:"https://www.graswurzel.net",
 bek:["Gewaltfreier Anarchismus","Antimilitarismus"],
 txt:"Gewaltfreie Aktion als Theorie und Handbuch. Der Verlag zur Zeitung, die seit 1972 durchhält."},

{id:"editionav", n:"Edition AV", ort:"Bodenburg", land:"DE", jahr:2001, tier:"untergrund",
 s:["anarch","arbeit","gesch"], url:"https://www.edition-av.de",
 bek:["Anarchosyndikalismus","Bewegungsgeschichte","Vergessene Autor:innen"],
 txt:"Ein Verlag als Ausgrabungsstätte. Anarchistische und syndikalistische Texte, die sonst niemand nachdruckt."},

{id:"laika", n:"LAIKA Verlag", ort:"Hamburg", land:"DE", jahr:2010, tier:"untergrund",
 s:["theorie","koloni","gesch"], url:"https://www.laika-verlag.de",
 bek:["LAIKA Diskurs","Bibliothek des Widerstands"],
 txt:"Die Bibliothek des Widerstands – Buch plus DVD, Bewegungsgeschichte als Materialsammlung. Ein eigenwilliges, großzügiges Projekt."},

{id:"tranvia", n:"Verbrecher Verlag", ort:"Berlin", land:"DE", jahr:1995, tier:"haus",
 s:["kunst","theorie"], url:"https://www.verbrecherei.de",
 bek:["Literatur & Essayistik","Kritische Ausgaben"],
 txt:"Literatur mit politischem Rückgrat, aus einer Berliner Wohnung heraus gewachsen. Der Name war ursprünglich ein Witz."},

{id:"westend", n:"Westend Verlag", ort:"Frankfurt a. M.", land:"DE", jahr:2010, tier:"haus",
 s:["oekonomie","theorie"], url:"https://www.westendverlag.de",
 bek:["Populäre Gesellschaftskritik","Ökonomie-Sachbuch"],
 txt:"Gesellschaftskritik fürs Bahnhofsbuchhandelsregal. Erreicht Leute, die sonst nie in einen linken Buchladen gehen."},

{id:"campus", n:"Campus Verlag", ort:"Frankfurt a. M.", land:"DE", jahr:1975, tier:"haus",
 s:["theorie","oekonomie","fem"], url:"https://www.campus.de",
 bek:["Sozialwissenschaftliche Reihen","Frankfurter Beiträge"],
 txt:"Akademisch, solide, im Umfeld der Frankfurter Schule groß geworden. Dort erscheint viel, was später zitiert wird."},

{id:"transcript", n:"transcript Verlag", ort:"Bielefeld", land:"DE", jahr:1999, tier:"haus",
 s:["theorie","fem","technik"], url:"https://www.transcript-verlag.de",
 bek:["Cultural Studies","Gender Studies","Open Access"],
 txt:"Der Verlag der Qualifikationsschriften. Enorm viel davon frei zugänglich – wer keinen Bibliotheksausweis hat, liest hier trotzdem mit."},

{id:"suhrkamp", n:"Suhrkamp / edition suhrkamp", ort:"Berlin", land:"DE", jahr:1950, tier:"kern",
 s:["theorie","kunst"], url:"https://www.suhrkamp.de",
 bek:["Adorno: Minima Moralia","Benjamin: Illuminationen","Habermas","es-Reihe"],
 txt:"Die Regenbogenrücken der edition suhrkamp waren einmal das Erkennungszeichen einer ganzen Generation. Kritische Theorie hat hier ihre Adresse."},

{id:"matthes", n:"Matthes & Seitz Berlin", ort:"Berlin", land:"DE", jahr:2004, tier:"haus",
 s:["theorie","oeko","kunst"], url:"https://www.matthes-seitz-berlin.de",
 bek:["Fröhliche Wissenschaft","Naturkunden","Französische Theorie"],
 txt:"Schön gemachte Bücher über Natur, Theorie und die Zumutungen der Gegenwart. Die Naturkunden sind Ökologie als Ästhetik."},

{id:"mandelbaum", n:"Mandelbaum Verlag", ort:"Wien", land:"AT", jahr:1994, tier:"haus",
 s:["gesch","theorie","koloni"], url:"https://www.mandelbaum.at",
 bek:["kritik & utopie","Sozialgeschichte","Essstudien"],
 txt:"Wiener Haus mit langem Atem. Die Reihe kritik & utopie ist eine der besten deutschsprachigen Theoriereihen der Gegenwart."},

{id:"bahoe", n:"bahoe books", ort:"Wien", land:"AT", jahr:2015, tier:"untergrund",
 s:["gesch","kunst","antifa"], url:"https://bahoebooks.net",
 bek:["Politische Comics","Widerstandsgeschichte","Reprints"],
 txt:"Comics und Bewegungsgeschichte zu Preisen, die man sich leisten kann. Der beste Beweis, dass linke Bücher nicht grau sein müssen."},

{id:"promedia", n:"Promedia Verlag", ort:"Wien", land:"AT", jahr:1982, tier:"untergrund",
 s:["koloni","gesch"], url:"https://www.mediashop.at",
 bek:["Edition Brennpunkt","Internationale Politik"],
 txt:"Antiimperialistische Reportagen und Länderanalysen aus Wien. Oft die einzige deutschsprachige Quelle zu einem Konflikt."},

{id:"rotpunkt", n:"Rotpunktverlag", ort:"Zürich", land:"CH", jahr:1976, tier:"haus",
 s:["gesch","koloni","kunst"], url:"https://www.rotpunktverlag.ch",
 bek:["Reportagen","Lateinamerika","Edition Blau"],
 txt:"Aus der Zürcher Bewegung entstanden, heute ein Haus für politische Reportage und Literatur mit Weltblick."},

{id:"passagen", n:"Passagen Verlag", ort:"Wien", land:"AT", jahr:1987, tier:"untergrund",
 s:["theorie"], url:"https://www.passagen.at",
 bek:["Derrida","Rancière","Nancy"],
 txt:"Wer französische Gegenwartsphilosophie auf Deutsch sucht und bei Merve nicht fündig wird, findet sie hier."},

{id:"turia", n:"Turia + Kant", ort:"Wien / Berlin", land:"AT", jahr:1985, tier:"untergrund",
 s:["theorie","fem"], url:"https://www.turia.at",
 bek:["Psychoanalyse","Feministische Theorie","Philosophie"],
 txt:"Schmale Bände, dichte Sätze. Psychoanalyse und Theorie für Leute, die keine Angst vor Lacan haben."},

{id:"diaphanes", n:"diaphanes", ort:"Zürich / Berlin", land:"CH", jahr:1997, tier:"untergrund",
 s:["theorie","kunst"], url:"https://www.diaphanes.net",
 bek:["Theorie & Ästhetik","Kunstwissenschaft"],
 txt:"Theorie an der Kante zur Kunst. Gestalterisch das eleganteste Programm im deutschsprachigen Raum."},

{id:"brumaire", n:"Brumaire Verlag", ort:"Berlin", land:"DE", jahr:2024, tier:"untergrund",
 s:["oekonomie","marx"], url:"https://brumaireverlag.de",
 bek:["Surplus Magazin"],
 txt:"Der jüngste Zugang im Regal. Macht linke Ökonomiekritik in einem Magazinformat, das aussieht, als wolle es gelesen werden."},

{id:"alibri", n:"Alibri Verlag", ort:"Aschaffenburg", land:"DE", jahr:1994, tier:"untergrund",
 s:["theorie","antifa"], url:"https://www.alibri-buecher.de",
 bek:["Religionskritik","Aufklärung & Humanismus"],
 txt:"Konsequente Religionskritik, ein Feld, das die Linke oft der Rechten überlässt."},

{id:"trotzdem", n:"Trotzdem Verlag", ort:"Grafenau", land:"DE", jahr:1976, tier:"untergrund",
 s:["anarch","gesch"], url:"https://www.trotzdem-verlag.de",
 bek:["Anarchistische Klassiker","Bewegungsgeschichte"],
 txt:"Der Name ist Programm und Verlagsgeschichte zugleich. Anarchistische Grundtexte, seit fast fünfzig Jahren lieferbar gehalten."},

{id:"blackmosquito", n:"Black Mosquito", ort:"Kiel", land:"DE", jahr:2009, tier:"untergrund",
 s:["anarch","antifa","fem"], url:"https://black-mosquito.org",
 bek:["Versand & Kollektiv","Zines","Tonträger"],
 txt:"Kein Verlag, sondern der Vertrieb, über den die kleinen Sachen überhaupt erst zu dir kommen. Zines, Broschüren, Aufnäher, Bücher."},

{id:"querverlag", n:"Querverlag", ort:"Berlin", land:"DE", jahr:1995, tier:"untergrund",
 s:["fem","kunst"], url:"https://www.querverlag.de",
 bek:["Queere Literatur","Sachbuch LGBTIQ"],
 txt:"Der älteste explizit queere Verlag in Deutschland, geführt von einer Lesbe und einem Schwulen. Belletristik und Sachbuch nebeneinander."},

{id:"wortenmeer", n:"w_orten & meer", ort:"Berlin", land:"DE", jahr:2011, tier:"untergrund",
 s:["fem","antifa"], url:"https://wortenundmeer.net",
 bek:["Barrierearme Bücher","Feministische Theorie"],
 txt:"Verlag für herrschaftskritische Texte, der Barrierearmut nicht als Zusatz, sondern als Ausgangspunkt behandelt."},

{id:"konkretverlag", n:"KVV konkret", ort:"Hamburg", land:"DE", jahr:1974, tier:"untergrund",
 s:["theorie","antifa"], url:"https://www.konkret-magazin.de",
 bek:["konkret texte-Reihe"],
 txt:"Der Buchverlag zur Zeitschrift. Streitschriften in einer Tonlage, die es sonst nirgends mehr gibt."},

{id:"dietznachf", n:"J. H. W. Dietz Nachf.", ort:"Bonn", land:"DE", jahr:1881, tier:"haus",
 s:["gesch","arbeit"], url:"https://www.dietz-verlag.de",
 bek:["Sozialdemokratische Geschichte","Politik & Gesellschaft"],
 txt:"Der Verlag der alten SPD, älter als fast alles andere im Regal. Für Geschichte der Arbeiterbewegung unverzichtbar, auch wenn man streitet."},

{id:"klartext", n:"Klartext Verlag", ort:"Essen", land:"DE", jahr:1983, tier:"untergrund",
 s:["gesch","arbeit"], url:"https://www.klartext-verlag.de",
 bek:["Ruhrgebietsgeschichte","Arbeitergeschichte"],
 txt:"Regionalverlag mit nationaler Bedeutung: Industrie- und Arbeitergeschichte, dort geschrieben, wo sie stattgefunden hat."},

/* ---------- ANGLOPHON ---------- */
{id:"verso", n:"Verso Books", ort:"London / New York", land:"UK", jahr:1970, tier:"kern",
 s:["marx","theorie","koloni"], url:"https://www.versobooks.com",
 bek:["Mike Davis: Planet of Slums","Benedict Anderson: Imagined Communities","Radical Thinkers-Reihe"],
 txt:"Ursprünglich New Left Books, der Buchverlag der New Left Review. Der größte unabhängige radikale Verlag der englischsprachigen Welt – und der mit den besten Covern."},

{id:"lawrence", n:"Lawrence & Wishart", ort:"London", land:"UK", jahr:1936, tier:"kern",
 s:["marx","gesch","theorie"], url:"https://www.lwbooks.co.uk",
 bek:["Gramsci: Prison Notebooks","Marx & Engels Collected Works","Soundings"],
 txt:"Aus der Kommunistischen Partei Großbritanniens hervorgegangen. Die englische Gramsci-Ausgabe ist hier zu Hause."},

{id:"mrpress", n:"Monthly Review Press", ort:"New York", land:"US", jahr:1952, tier:"kern",
 s:["marx","oekonomie","koloni"], url:"https://monthlyreview.org",
 bek:["Baran & Sweezy: Monopoly Capital","Braverman: Labor and Monopoly Capital","Harry Magdoff"],
 txt:"Der unabhängige sozialistische Verlag der USA, gegründet mitten in der McCarthy-Ära. Politische Ökonomie ohne Parteibuch."},

{id:"semiotexte", n:"Semiotext(e)", ort:"Los Angeles", land:"US", jahr:1974, tier:"kern",
 s:["theorie","kunst"], url:"https://semiotexte.com",
 bek:["Foreign Agents-Reihe","Native Agents","Baudrillard, Virilio, Guattari"],
 txt:"Die kleinen schwarzen Bände, die französische Theorie in die amerikanische Kunstwelt eingeschleust haben. Format: Hosentasche."},

{id:"pluto", n:"Pluto Press", ort:"London", land:"UK", jahr:1969, tier:"haus",
 s:["marx","koloni","arbeit"], url:"https://www.plutobooks.com",
 bek:["Kritische Politikwissenschaft","Palästina & Nahost","Wirtschaftskritik"],
 txt:"Solide, kämpferisch, akademisch anschlussfähig. Ein Rückgrat der englischsprachigen radikalen Publizistik."},

{id:"haymarket", n:"Haymarket Books", ort:"Chicago", land:"US", jahr:2001, tier:"haus",
 s:["arbeit","antifa","koloni"], url:"https://www.haymarketbooks.org",
 bek:["Angela Y. Davis","Keeanga-Yamahtta Taylor","Abolition-Reihe"],
 txt:"Benannt nach dem Haymarket-Prozess. Gemeinnützig, bewegungsnah, und mit einer Preispolitik, die man Vorbild nennen darf."},

{id:"akpress", n:"AK Press", ort:"Chico, CA / Edinburgh", land:"US", jahr:1990, tier:"untergrund",
 s:["anarch","fem","antifa"], url:"https://www.akpress.org",
 bek:["Anarchistische Theorie & Praxis","Abolition","Emma Goldman"],
 txt:"Verlag und Versand als Arbeiter:innenkollektiv, ohne Chef:innen, seit über dreißig Jahren. Das Modell funktioniert offenbar."},

{id:"pmpress", n:"PM Press", ort:"Oakland, CA", land:"US", jahr:2007, tier:"untergrund",
 s:["anarch","gesch","kunst"], url:"https://www.pmpress.org",
 bek:["Outspoken Authors","Ursula K. Le Guin","Bewegungsgeschichte"],
 txt:"Von AK-Press-Gründer Ramsey Kanaan gestartet. Enorme Bandbreite: Science Fiction, Kochbücher, Streikgeschichte, alles mit Haltung."},

{id:"freedom", n:"Freedom Press", ort:"London", land:"UK", jahr:1886, tier:"untergrund",
 s:["anarch","gesch"], url:"https://freedompress.org.uk",
 bek:["Kropotkin","Freedom (Zeitung)","Anarchistische Klassiker"],
 txt:"Von Charlotte Wilson und Peter Kropotkin gegründet – der älteste anarchistische Verlag der Welt, immer noch in Whitechapel."},

{id:"repeater", n:"Repeater Books", ort:"London", land:"UK", jahr:2014, tier:"untergrund",
 s:["theorie","kunst","technik"], url:"https://repeaterbooks.com",
 bek:["Mark Fisher: The Weird and the Eerie","Popkultur & Theorie"],
 txt:"Gegründet von Leuten, die vorher Zer0 Books gemacht haben. Popkultur, Hauntology, und die Frage, warum sich die Zukunft aufgelöst hat."},

{id:"zero", n:"Zer0 Books", ort:"Winchester", land:"UK", jahr:2009, tier:"untergrund",
 s:["theorie","kunst"], url:"https://www.zero-books.net",
 bek:["Mark Fisher: Capitalist Realism"],
 txt:"Ohne Zer0 gäbe es Capitalist Realism nicht, und ohne Capitalist Realism sähe die linke Gegenwartssprache anders aus. Ein schmales Buch, große Folgen."},

{id:"commonnotions", n:"Common Notions", ort:"Brooklyn / Philadelphia", land:"US", jahr:2012, tier:"untergrund",
 s:["arbeit","fem","anarch"], url:"https://www.commonnotions.org",
 bek:["Silvia Federici","Bewegungsforschung","Kollektive Praxis"],
 txt:"Verlag als Bewegungsinfrastruktur. Bücher, die aus Organizing entstehen und dorthin zurückgehen."},

{id:"autonomedia", n:"Autonomedia", ort:"Brooklyn", land:"US", jahr:1983, tier:"untergrund",
 s:["anarch","theorie","technik"], url:"https://autonomedia.org",
 bek:["Hakim Bey: T.A.Z.","Bolo'bolo","Semiotext(e)-Umfeld"],
 txt:"Anti-Copyright, oft schon vor dem Internet. Die T.A.Z. hat eine ganze Generation von Raves und Hausprojekten begleitet."},

{id:"minorcomp", n:"Minor Compositions", ort:"Colchester / Brooklyn", land:"UK", jahr:2009, tier:"untergrund",
 s:["theorie","kunst","arbeit"], url:"https://www.minorcompositions.info",
 bek:["Harney & Moten: The Undercommons","Autonomia-Umfeld"],
 txt:"Alles frei als PDF, trotzdem schön gedruckt. Ein Imprint von Autonomedia, das die interessanteste Theorie der letzten Jahre gemacht hat."},

{id:"brill", n:"Historical Materialism Book Series (Brill)", ort:"Leiden", land:"NL", jahr:2003, tier:"haus",
 s:["marx","theorie","gesch"], url:"https://brill.com",
 bek:["Über 300 Bände marxistischer Forschung"],
 txt:"Die teuersten Bücher im Laden – und nach ein paar Jahren als günstige Haymarket-Taschenbücher wieder da. Geduld lohnt sich."},

{id:"duke", n:"Duke University Press", ort:"Durham, NC", land:"US", jahr:1921, tier:"haus",
 s:["fem","koloni","theorie"], url:"https://www.dukeupress.edu",
 bek:["Queer Theory","Black Studies","Kulturtheorie"],
 txt:"Der Universitätsverlag, der am meisten Bewegungstheorie kanonisiert hat. Ohne Duke keine Zitierfähigkeit."},

{id:"newpress", n:"The New Press", ort:"New York", land:"US", jahr:1992, tier:"haus",
 s:["antifa","arbeit"], url:"https://thenewpress.com",
 bek:["Michelle Alexander: The New Jim Crow","Studs Terkel"],
 txt:"Gemeinnützig, gegründet als Gegengewicht zur Konzernverlagslandschaft. Trifft die amerikanische Öffentlichkeit tatsächlich."},

{id:"beacon", n:"Beacon Press", ort:"Boston", land:"US", jahr:1854, tier:"haus",
 s:["antifa","koloni","gesch"], url:"https://www.beacon.org",
 bek:["Howard Zinn: A People's History","James Baldwin","ReVisioning History"],
 txt:"Hat 1971 die Pentagon Papers gedruckt, als es sonst niemand wagte. Von den Unitarian Universalists getragen."},

{id:"sevenstories", n:"Seven Stories Press", ort:"New York", land:"US", jahr:1995, tier:"haus",
 s:["antifa","kunst","koloni"], url:"https://sevenstories.com",
 bek:["Noam Chomsky","Zensierte Bücher","Open Media-Reihe"],
 txt:"Nach den sieben Autor:innen benannt, die dem Verlag beim Start die Treue hielten. Druckt, was andere fallenlassen."},

{id:"orbooks", n:"OR Books", ort:"New York", land:"US", jahr:2009, tier:"untergrund",
 s:["technik","antifa","koloni"], url:"https://www.orbooks.com",
 bek:["Direktvertrieb ohne Amazon","Politische Interventionen"],
 txt:"Verkauft direkt, gedruckt auf Bestellung, ohne Zwischenhandel. Ein Verlagsmodell als politisches Statement."},

{id:"betweenlines", n:"Between the Lines", ort:"Toronto", land:"CA", jahr:1977, tier:"untergrund",
 s:["koloni","arbeit","oeko"], url:"https://btlbooks.com",
 bek:["Indigene Politik","Kanadische Arbeitsgeschichte"],
 txt:"Kollektiv geführt, ohne Eigentümer:in. Der wichtigste Ort für indigene und antikoloniale Politik aus Kanada."},

{id:"fernwood", n:"Fernwood Publishing", ort:"Halifax / Winnipeg", land:"CA", jahr:1991, tier:"untergrund",
 s:["arbeit","fem","koloni"], url:"https://fernwoodpublishing.ca",
 bek:["Kritische Sozialwissenschaft","Roseway-Imprint"],
 txt:"Klein, unabhängig, verlässlich links – die kanadische Antwort auf die Frage, wo kritische Sozialwissenschaft publiziert."},

{id:"daraja", n:"Daraja Press", ort:"Québec", land:"CA", jahr:2015, tier:"untergrund",
 s:["koloni","marx"], url:"https://darajapress.com",
 bek:["Panafrikanismus","Ubuntu-Reihe","Antikoloniale Theorie"],
 txt:"Von Firoze Manji gegründet. Bringt afrikanische und panafrikanische Stimmen in eine Debatte, die sie meist überhört."},

{id:"leftword", n:"LeftWord Books", ort:"Neu-Delhi", land:"IN", jahr:1999, tier:"untergrund",
 s:["marx","koloni","gesch"], url:"https://mayday.leftword.com",
 bek:["Vijay Prashad","Indische Linke","Trikont-Perspektiven"],
 txt:"Englischsprachiger Marxismus, der nicht aus London oder New York kommt. Verändert die Perspektive spürbar."},

{id:"pathfinder", n:"Pathfinder Press", ort:"New York", land:"US", jahr:1940, tier:"untergrund",
 s:["marx","gesch"], url:"https://www.pathfinderpress.com",
 bek:["Trotzki","Malcolm X: Reden","Kubanische Revolution"],
 txt:"Trotzkistische Traditionspflege in Reinform. Die Malcolm-X-Reden-Ausgaben sind ihr bleibender Verdienst."},

{id:"microcosm", n:"Microcosm Publishing", ort:"Portland, OR", land:"US", jahr:1996, tier:"untergrund",
 s:["anarch","fem","technik"], url:"https://microcosmpublishing.com",
 bek:["Zines","DIY-Handbücher","Fahrradpolitik"],
 txt:"Aus einer Zine-Distro entstanden. Praktische Anleitungen zum Selbermachen von so ziemlich allem, inklusive Selbstverlag."},

/* ---------- FRANKOPHON ---------- */
{id:"decouverte", n:"Éditions La Découverte", ort:"Paris", land:"FR", jahr:1983, tier:"kern",
 s:["theorie","koloni","oekonomie"], url:"https://www.editionsladecouverte.fr",
 bek:["Repères-Reihe","Zones-Imprint","Nachfolge von François Maspero"],
 txt:"Erbe des legendären Maspero-Verlags, der Frantz Fanon druckte. Heute das große Haus der französischen kritischen Sozialwissenschaft."},

{id:"lafabrique", n:"La Fabrique éditions", ort:"Paris", land:"FR", jahr:1998, tier:"kern",
 s:["theorie","anarch","koloni"], url:"https://lafabrique.fr",
 bek:["Comité invisible: L'insurrection qui vient","Jacques Rancière","Houria Bouteldja"],
 txt:"Éric Hazans Verlag. Dünne rote Bände, die in Frankreich regelmäßig Staatsanwaltschaften beschäftigt haben."},

{id:"socialessociales", n:"Éditions sociales", ort:"Paris", land:"FR", jahr:1927, tier:"kern",
 s:["marx","gesch","theorie"], url:"https://www.editionssociales.fr",
 bek:["Marx: Le Capital (neue Übersetzung)","Les Poings dans les poches"],
 txt:"Der historische Verlag der KPF, seit einigen Jahren mit einer neuen, jungen Generation wiederbelebt. Die Kapital-Neuübersetzung ist ein Ereignis."},

{id:"amsterdam", n:"Éditions Amsterdam", ort:"Paris", land:"FR", jahr:2003, tier:"haus",
 s:["theorie","fem","koloni"], url:"https://www.editionsamsterdam.fr",
 bek:["Kritische Theorie","Postkoloniale Studien","Queer Theory"],
 txt:"Bringt angelsächsische und deutsche Theorie nach Frankreich – und umgekehrt. Ein Übersetzungsverlag im besten Sinn."},

{id:"agone", n:"Éditions Agone", ort:"Marseille", land:"FR", jahr:1990, tier:"haus",
 s:["arbeit","theorie","gesch"], url:"https://agone.org",
 bek:["Contre-feux","Bourdieu-Umfeld","Noam Chomsky auf Französisch"],
 txt:"Marseille statt Paris, und das merkt man dem Programm an: Klassenanalyse ohne Pariser Salonton."},

{id:"syllepse", n:"Éditions Syllepse", ort:"Paris", land:"FR", jahr:1988, tier:"untergrund",
 s:["arbeit","marx","fem"], url:"https://www.syllepse.net",
 bek:["Gewerkschaftsgeschichte","Utopie critique","Internationalismus"],
 txt:"Enormer Ausstoß bei kleinster Struktur. Wenn irgendwo ein Streik dokumentiert wird, dann hier."},

{id:"libertalia", n:"Éditions Libertalia", ort:"Montreuil", land:"FR", jahr:2007, tier:"untergrund",
 s:["anarch","gesch","antifa"], url:"https://www.editionslibertalia.com",
 bek:["N'Autre école","Anarchistische Geschichte","Ceux d'en bas"],
 txt:"Benannt nach der Piratenrepublik. Bewegungsgeschichte, Schulkritik und Anarchismus, sehr sorgfältig gemacht."},

{id:"lechappee", n:"Éditions L'Échappée", ort:"Paris", land:"FR", jahr:2005, tier:"untergrund",
 s:["technik","oeko","anarch"], url:"https://www.lechappee.org",
 bek:["Pour en finir avec","Technikkritik","Versus-Reihe"],
 txt:"Das Zentrum der französischen Technikkritik. Wer wissen will, was gegen Digitalisierung zu sagen wäre, liest hier."},

{id:"divergences", n:"Éditions Divergences", ort:"Paris", land:"FR", jahr:2016, tier:"untergrund",
 s:["fem","anarch","oeko"], url:"https://www.editionsdivergences.com",
 bek:["Queere & feministische Theorie","Ökologie der Kämpfe"],
 txt:"Der jüngste Wurf der französischen radikalen Verlagsszene. Schmale Bücher, sehr präsent in aktuellen Debatten."},

{id:"lux", n:"Lux Éditeur", ort:"Montréal", land:"CA", jahr:2002, tier:"haus",
 s:["koloni","gesch","theorie"], url:"https://luxediteur.com",
 bek:["Instinct de liberté","Lettres libres","Amerikanische Linke auf Französisch"],
 txt:"Québec als Brücke zwischen anglo- und frankophoner Linker. Übersetzt Zinn, Chomsky und Klein, bevor Paris es tut."},

{id:"croquant", n:"Éditions du Croquant", ort:"Vulaines-sur-Seine", land:"FR", jahr:2003, tier:"untergrund",
 s:["arbeit","theorie","oekonomie"], url:"https://editions-croquant.org",
 bek:["Savoir/Agir","Bourdieu-Nachfolge","Soziologie der Herrschaft"],
 txt:"Verlängert die Soziologie Bourdieus in die Gegenwart. Unglamourös und außerordentlich nützlich."},

{id:"raisons", n:"Raisons d'agir", ort:"Paris", land:"FR", jahr:1996, tier:"untergrund",
 s:["theorie","arbeit"], url:"http://www.raisonsdagir-editions.org",
 bek:["Pierre Bourdieu: Sur la télévision","Kleine Interventionsschriften"],
 txt:"Von Bourdieu selbst gegründet: kurze, billige Bücher als Waffe in der öffentlichen Debatte. Das Konzept hält."},

{id:"nada", n:"Nada Éditions", ort:"Paris", land:"FR", jahr:2013, tier:"untergrund",
 s:["anarch","gesch","kunst"], url:"https://nada-editions.fr",
 bek:["Anarchistische Geschichte","Illustrierte Bände"],
 txt:"Schön gemachte Bücher über illegalistische Anarchist:innen, Aufstände und andere unerledigte Angelegenheiten."},

{id:"passagerclandestin", n:"Le Passager clandestin", ort:"Paris / Lyon", land:"FR", jahr:2007, tier:"untergrund",
 s:["oeko","theorie"], url:"https://lepassagerclandestin.fr",
 bek:["Les Précurseurs de la décroissance","Dyschroniques"],
 txt:"Die Bibliothek der Wachstumskritik: eine Reihe kleiner Bände über die Vorläufer:innen der décroissance."},

{id:"wildproject", n:"Éditions Wildproject", ort:"Marseille", land:"FR", jahr:2008, tier:"untergrund",
 s:["oeko","theorie","koloni"], url:"https://wildproject.org",
 bek:["Domaine sauvage","Politische Ökologie","Umweltethik"],
 txt:"Hat die angelsächsische environmental philosophy nach Frankreich gebracht. Ohne Wildproject keine französische Debatte über Ökologie und Kolonialismus."},

{id:"ladispute", n:"Éditions La Dispute", ort:"Paris", land:"FR", jahr:1996, tier:"untergrund",
 s:["fem","marx","arbeit"], url:"https://ladispute.fr",
 bek:["Le genre du monde","Marxistischer Feminismus"],
 txt:"Materialistischer Feminismus als Verlagsprogramm. In Frankreich eine eigene, sehr scharfe Tradition."},

{id:"commun", n:"Éditions du commun", ort:"Rennes", land:"FR", jahr:2015, tier:"untergrund",
 s:["arbeit","theorie","oeko"], url:"https://www.editionsducommun.org",
 bek:["Commons","Selbstorganisation","Pädagogik"],
 txt:"Genossenschaftlich organisiert, thematisch bei den Commons. Der Verlag ist selbst ein Beispiel für seinen Gegenstand."},

{id:"icibas", n:"Éditions Ici-bas", ort:"Lyon", land:"FR", jahr:2015, tier:"untergrund",
 s:["gesch","anarch","koloni"], url:"https://www.editionsicibas.fr",
 bek:["Les Réveilleurs de la nuit","Sozialgeschichte von unten"],
 txt:"Geschichte der Aufsässigen, sorgfältig recherchiert, in kleinen Auflagen. Lyoner Handarbeit."},

{id:"acl", n:"Atelier de création libertaire", ort:"Lyon", land:"FR", jahr:1979, tier:"untergrund",
 s:["anarch","gesch"], url:"https://www.atelierdecreationlibertaire.com",
 bek:["Anarchistische Theorie","Kolloquiumsbände"],
 txt:"Seit über vierzig Jahren ehrenamtlich gemacht. Der Beweis, dass ein Verlag keine Firma sein muss."},

{id:"delga", n:"Éditions Delga", ort:"Paris", land:"FR", jahr:2004, tier:"untergrund",
 s:["marx","theorie"], url:"https://www.editionsdelga.fr",
 bek:["Lukács auf Französisch","Klassische marxistische Texte"],
 txt:"Streitbar orthodox, gegen den Strich der Pariser Theoriemoden. Hat Lukács wieder verfügbar gemacht."},

{id:"atelier", n:"Les Éditions de l'Atelier", ort:"Ivry-sur-Seine", land:"FR", jahr:1929, tier:"haus",
 s:["arbeit","gesch"], url:"https://www.editionsatelier.com",
 bek:["Gewerkschaftsgeschichte","Le Maitron (Biografisches Lexikon)"],
 txt:"Aus der christlichen Arbeiterbewegung. Le Maitron, das biografische Lexikon der Arbeiterbewegung, ist ein Jahrhundertprojekt."},

{id:"eclat", n:"Éditions de l'Éclat", ort:"Paris", land:"FR", jahr:1985, tier:"untergrund",
 s:["theorie","kunst"], url:"https://www.lyber-eclat.net",
 bek:["Lyber (freie Volltexte)","Philosophie","Giorgio Agamben"],
 txt:"Hat schon 1999 das Konzept des lyber erfunden: Buch kaufen oder online frei lesen. Zwanzig Jahre vor allen anderen."},

{id:"rueechiquier", n:"Rue de l'échiquier", ort:"Paris", land:"FR", jahr:2008, tier:"haus",
 s:["oeko","theorie"], url:"https://www.ruedelechiquier.net",
 bek:["Ökologische Essays","Diagonales"],
 txt:"Ökologie als politische, nicht als Lifestyle-Frage. Schön gestaltet und breit gelesen."},

{id:"grevis", n:"Éditions Grevis", ort:"Nancy", land:"FR", jahr:2018, tier:"untergrund",
 s:["anarch","fem","gesch"], url:"https://grevis.org",
 bek:["Bewegungserzählungen","Feministische Geschichte"],
 txt:"Ganz junger, ganz kleiner Verlag aus Lothringen. Genau die Sorte, die man in dieser Buchhandlung findet und sonst nirgends."}

];
