# PLAN: Wie die App gebaut wird

Diese Datei füllt /plan aus docs/SPEC.md.

## Stack

Siehe docs/STACK.md. Keine Abweichungen.

## Ordner und Dateien

Neu oder geändert für das Swimlanes-Feature:

- `src/features/tasks/model.ts`: Typ Task mit `status` und `personId`, reine Funktionen changeStatus, assignPerson, moveTask.
- `src/features/tasks/model.test.ts`: Tests für Status-Wechsel, Personen-Zuordnung und Verschieben.
- `src/lib/storage.ts`: Schema-Version 2 mit Migration `migrateV1toV2` (status + personId null).
- `src/lib/storage.test.ts`: Test, dass Migration gespeicherte Aufgaben erhält.
- `src/features/tasks/components/Board.tsx`: Board als Swimlanes, eine Zeile pro Person plus «Niemand», je drei Spalten, mit Drag and Drop (dnd-kit).
- `src/features/tasks/components/Board.test.tsx`: Test, dass Karten in der richtigen Zeile und Spalte stehen und sich verschieben lassen.
- `src/features/tasks/components/PersonSelect.tsx`: Initialen-Badge, Klick wechselt die Person.
- `src/features/tasks/components/PersonSelect.test.tsx`: Test der Personen-Auswahl.
- `src/features/tasks/components/TaskCard.tsx`: zeigt zusätzlich Status-Wechsel und Personen-Badge.
- `src/App.tsx`: Liste durch das Swimlanes-Board ersetzen, Rahmen auf `max-w-6xl` (DESIGN.md, Rezept 1).
- Je Datei ein passender Test daneben.

## Datenmodell

```ts
export type Status = 'todo' | 'doing' | 'done'

export type Person = {
  id: string
  name: string // z. B. «Marco»
  initials: string // z. B. «MN»
}

export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  status: Status
  personId: string | null // null = «Niemand»
  createdAt: number // Date.now()
}
```

Eine feste Personenliste `PERSONS: Person[]` liegt im Modell und liefert die Zeilen. localStorage `hwz-todo = { version: 2, tasks: Task[] }`. Bei kaputtem Inhalt liefert loadState eine leere Liste.

Migration `migrateV1toV2` (docs/STACK.md, «Datenhaltung»): `done: true` → `status: 'done'`, `done: false` → `status: 'todo'`, dazu `personId: null`. Ältere Versionen werden beim Lesen automatisch migriert; gespeicherte Aufgaben gehen nie verloren (AGENTS.md, Regel 9).

## Komponenten

- PersonSelect: Initialen-Badge einer Person, Klick öffnet die Auswahl, Farben aus den Tokens (DESIGN.md, Rezepte 6 und 8).
- Board: eine Zeile pro Person plus «Niemand», je mit den Spalten Offen, In Arbeit, Erledigt, mit Drag and Drop per dnd-kit (DESIGN.md, Rezept 6). Karten gleiten beim Wechsel der Zeile oder Spalte mit `layout` (Rezept 4).
- TaskCard: zeigt das Personen-Badge, weiter nach Rezept 3. In Drag and Drop einziehbar (useSortable), DragOverlay zeigt die gezogene Karte (Rezept 6).
- App: zeigt Board statt Liste, Rahmen `max-w-6xl` (DESIGN.md, Rezept 1).

## Risiken

- Drag and Drop im Test: die Verschiebe-Logik liegt im Modell (moveTask) und wird als reine Funktion getestet; die Maus-Steuerung der Komponente nur so weit, wie jsdom es zulässt (DESIGN.md, Rezept 6).
- Fehlende Person auf Alt-Karten: Migration setzt `personId: null`, die Karten erscheinen in der Zeile «Niemand» (SPEC-Kriterium Alt-Speicherstand).
- Zuordnung über Typen sicher: `personId` ist `string | null`, kein undefinierter Zustand.
