# TASKS: Bauschritte

Diese Datei füllt /plan. /task arbeitet sie von oben nach unten ab und hakt jeden Task ab.
Ein Beispiel mit allen 6 Tasks von Bau 1 steht in docs/PROMPTS.md unter «Beispiel: die 6 Tasks von Bau 1».

Format je Task:

```text
[ ] N  Titel
- Ziel: Ein Satz, was danach sichtbar oder möglich ist.
- Dateien: Genau die Dateien, die geändert werden dürfen.
- Test zuerst: Welcher Test zuerst rot sein muss.
- Fertig wenn: Prüfbares Ergebnis plus «npm run check grün».
```

## Tasks

[x] 1  Projekt einrichten
- Ziel: Leerer App-Rahmen im gewählten Look Neon läuft unter http://localhost:5173/hwz-todo/.
- Dateien: alle aus docs/STACK.md, Abschnitt «Dateien für Task 1», plus src/components/ui/*.
- Test zuerst: src/App.test.tsx (kommt mit Task 1, siehe STACK.md).
- Fertig wenn: npm run check grün, Hero-Überschrift sichtbar.

[x] 2  Datenmodell und Store mit Tests
- Ziel: Aufgaben lassen sich anlegen, abhaken, löschen und im localStorage speichern, noch ohne Oberfläche.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts.
- Test zuerst: addTask ignoriert leeren Titel und kürzt auf 200 Zeichen; loadState gibt bei kaputtem JSON eine leere Liste zurück.
- Fertig wenn: alle Model- und Storage-Tests grün, Speicher übersteht Neuladen (SPEC «Neu laden»), npm run check grün.

[x] 3  Liste anzeigen
- Ziel: Gespeicherte Aufgaben erscheinen als TaskCards mit Listen-Animation.
- Dateien: src/features/tasks/components/TaskList.tsx, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/App.tsx.
- Test zuerst: TaskList zeigt zwei Aufgaben aus dem localStorage nach dem Rendern an.
- Fertig wenn: Aufgaben sichtbar (DESIGN.md, Rezepte 3, 4, 7), Text bricht um und läuft nicht hinaus (SPEC «Schmales Fenster»), npm run check grün.

[x] 4  Aufgabe hinzufügen
- Ziel: Neue Aufgabe per Enter oder Plus-Knopf, leere Eingabe schüttelt.
- Dateien: src/features/tasks/components/TaskInput.tsx, src/features/tasks/components/TaskInput.test.tsx, src/lib/useHotkey.ts, src/App.tsx.
- Test zuerst: Tippen + Enter zeigt die Aufgabe; Enter bei leerem Feld fügt nichts hinzu; «N» fokussiert das Feld.
- Fertig wenn: DESIGN.md, Rezept 2 erfüllt, leere Eingabe fügt nichts hinzu (SPEC «Leere Eingabe»), Titel wird auf 200 gekürzt (SPEC «200 Zeichen»), npm run check grün.

[x] 5  Abhaken und löschen
- Ziel: Abhaken mit Federn, Durchstreichen und Konfetti; Löschen mit Toast «Rückgängig».
- Dateien: src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/lib/celebrate.ts, src/lib/theme.ts.
- Test zuerst: Klick auf Checkbox setzt done und ruft celebrate auf; Löschen und «Rückgängig» stellt die Aufgabe wieder her.
- Fertig wenn: DESIGN.md, Rezept 3 erfüllt (SPEC «Abhaken», Toast «Rückgängig»), Zustand bleibt nach Neuladen (SPEC «Neu laden»), npm run check grün.

[x] 6  Zähler und leerer Zustand
- Ziel: Fortschrittsring zeigt erledigt/gesamt; ohne Aufgaben erscheint die Illustration des Looks Neon.
- Dateien: src/components/ProgressRing.tsx, src/components/ProgressRing.test.tsx, src/features/tasks/components/EmptyState.tsx, src/App.tsx.
- Test zuerst: Ring hat aria-label «1 von 2 erledigt»; leere Liste zeigt «Alles erledigt. Zeit für Kaffee.».
- Fertig wenn: DESIGN.md, Rezepte 1 und 5 erfüllt (SPEC «Leerer Zustand»), npm run check grün.

[x] 7  Migration auf Version 2 (atomarer Modell-Umbau)
- Ziel: Das Datenmodell wechselt von done auf status + personId. Gespeicherte Aufgaben der alten Version bleiben beim Öffnen erhalten und werden migriert. Die bestehende Liste funktioniert mit dem neuen Modell weiter (das Board folgt in späteren Tasks).
- Dateien: src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/features/tasks/components/TaskList.tsx, src/components/ProgressRing.tsx, src/components/ProgressRing.test.tsx, src/App.tsx.
- Test zuerst: migrateV1toV2 wandelt done: true zu status 'done', done: false zu 'todo', und setzt personId null mit echten Daten im Format von Version 1; die bestehende Liste zeigt Aufgaben weiter an (SPEC «Neu laden»).
- Fertig wenn: Migration hat eigenen Test (docs/STACK.md, «Datenhaltung»), gespeicherte Aufgaben bleiben erhalten (SPEC «Alt-Speicherstand»), Liste und Zähler funktionieren mit status weiter, npm run check grün.

[x] 8  Modell: Status, Person und Verschieben
- Ziel: Karten bekommen einen Status (Offen, In Arbeit, Erledigt), können einer Person zugeordnet werden und sich verschieben lassen; alles reine Funktionen.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/useTasks.ts.
- Test zuerst: changeStatus setzt den Status; assignPerson setzt oder entfernt personId; moveTask verschiebt eine Karte in eine Spalte oder Person und setzt die Reihenfolge.
- Fertig wenn: Status, Person und Verschieben funktionieren ohne Oberfläche (SPEC F1 «Person zuordnen»; DESIGN.md, Rezept 6 moveTask), npm run check grün.

[x] 9  Swimlanes-Board
- Ziel: Das Board zeigt eine Zeile pro Person plus «Niemand», jede mit den Spalten Offen, In Arbeit, Erledigt.
- Dateien: src/features/tasks/components/Board.tsx, src/features/tasks/components/Board.test.tsx, src/App.tsx.
- Test zuerst: Board zeigt Karten in der Zeile der zugeordneten Person und ohne Person in «Niemand».
- Fertig wenn: drei Spalten je Zeile sichtbar (DESIGN.md, Rezept 6), Karten stehen in der richtigen Zeile (SPEC F1 «Zeilenaufbau»), npm run check grün.

[x] 10  Person zuordnen
- Ziel: Jede Karte hat ein Initialen-Badge; Klick wählt die Person, die Karte gleitet in deren Zeile.
- Dateien: src/features/tasks/components/PersonSelect.tsx, src/features/tasks/components/PersonSelect.test.tsx, src/features/tasks/components/TaskCard.tsx, src/App.tsx.
- Test zuerst: Klick auf das Badge wählt eine Person, die Karte zeigt deren Initialen und wechselt die Zeile.
- Fertig wenn: DESIGN.md, Rezepte 3 und 8 erfüllt, Karte wechselt die Zeile (SPEC F1 «Person zuordnen»), npm run check grün.

[x] 11  Drag and Drop im Board
- Ziel: Karten lassen sich per Maus und Tastatur zwischen Spalten und Zeilen sowie innerhalb einer Spalte verschieben; die Zielspalte leuchtet beim Darüberziehen.
- Dateien: src/features/tasks/components/Board.tsx, src/features/tasks/components/Board.test.tsx, src/features/tasks/components/TaskCard.tsx, src/App.tsx.
- Test zuerst: moveTask (schon rot aus Task 8 oder hier ergänzt) verschiebt eine Karte in eine andere Spalte oder Person; jsdom-Test prüft soweit möglich die Maus-Steuerung.
- Fertig wenn: DESIGN.md, Rezept 6 erfüllt (dnd-kit, Zielspalte leuchtet, Konfetti in «Erledigt», Tastatur mit deutschen Ansagen), npm run check grün.
