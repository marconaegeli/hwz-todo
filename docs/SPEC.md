# SPEC: Was die App können muss

Diese Datei füllt /spec. Ein ausgefülltes Beispiel steht in docs/PROMPTS.md unter «Beispiel einer SPEC».

## Ziel

Eine ToDo-App für mich, mit der ich Aufgaben anlegen, abhaken und löschen kann – sie macht Freude und ist schnell.

## Muss

- Aufgabe mit Titel anlegen (Enter oder Plus-Knopf).
- Aufgabe abhaken und wieder öffnen.
- Aufgabe löschen, mit «Rückgängig».
- Zähler «erledigt/gesamt» als Fortschrittsring.
- Leerer Zustand mit einer freundlichen Illustration des Looks.

## Look

Neon

## Nicht

- Kein Login, kein Server. Die Daten bleiben im Browser.
- Keine Termine, Erinnerungen oder Prioritäten in Bau 1.
- Keine Mehrbenutzer-Verwaltung.

## Fertig, wenn

1. Leere Eingabe
   - Gegeben: Das Eingabefeld ist leer oder enthält nur Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Es kommt keine Aufgabe dazu und das Feld schüttelt sich kurz.
2. 200 Zeichen
   - Gegeben: Ich tippe einen Titel mit mehr als 200 Zeichen ohne Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Die Aufgabe hat höchstens 200 Zeichen und der Text bricht in der Karte um, nichts läuft hinaus.
3. Neu laden
   - Gegeben: Ich habe Aufgaben angelegt und einige abgehakt.
   - Wenn: Ich die Seite neu lade.
   - Dann: Alle Aufgaben und ihr Zustand sind noch da.
4. Abhaken
   - Gegeben: Eine Aufgabe ist offen.
   - Wenn: Ich sie abhake.
   - Dann: Der Text wird animiert durchgestrichen, Konfetti erscheint und der Zähler steigt; nochmal klicken macht es rückgängig.
5. Schmales Fenster
   - Gegeben: Das Fenster ist 360 px breit.
   - Wenn: Ich die App benutze, auch mit einem 200-Zeichen-Titel.
   - Dann: Alles ist lesbar und bedienbar, ohne seitliches Scrollen.
6. Leerer Zustand
   - Gegeben: Es sind keine Aufgaben da.
   - Wenn: Ich die App öffne.
   - Dann: Sie zeigt die Illustration des Looks und einen freundlichen Satz.
