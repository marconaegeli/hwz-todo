# PLAN: Wie die App gebaut wird

Diese Datei füllt /plan aus docs/SPEC.md.

## Stack

Siehe docs/STACK.md. Keine Abweichungen.

## Ordner und Dateien

- `src/features/tasks/model.ts`: Typ Task und reine Funktionen addTask, toggleTask, removeTask.
- `src/lib/storage.ts`: localStorage lesen, schreiben und migrieren.
- `src/features/tasks/useTasks.ts`: React-Hook, verbindet model.ts mit storage.ts.
- `src/features/tasks/components/TaskList.tsx`: Liste der Karten mit Listen-Animation.
- `src/features/tasks/components/TaskCard.tsx`: eine Aufgabe mit Checkbox, Text und Löschknopf.
- `src/features/tasks/components/TaskInput.tsx`: Eingabefeld mit Plus-Knopf und Schütteln bei leerer Eingabe.
- `src/features/tasks/components/EmptyState.tsx`: leerer Zustand mit Look-Illustration.
- `src/components/ProgressRing.tsx`: Fortschrittsring für den Zähler.
- `src/lib/celebrate.ts`: Konfetti beim Abhaken, im Test ersetzbar.
- `src/lib/theme.ts`: Konfetti-Farben aus den CSS-Variablen lesen.
- `src/lib/useHotkey.ts`: «N» fokussiert die Eingabe.
- `src/App.tsx`: Rahmen mit Hero, Fortschrittsring, Eingabe und Liste.
- Je Datei ein passender Test daneben.

## Datenmodell

```ts
export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  done: boolean
  createdAt: number // Date.now()
}
```

Dazu localStorage `hwz-todo = { version: 1, tasks: Task[] }`. Bei kaputtem Inhalt liefert loadState eine leere Liste.

## Komponenten

- TaskInput: Eingabefeld mit Plus-Knopf, Enter fügt hinzu, leere Eingabe schüttelt (DESIGN.md, Rezept 2).
- TaskCard: Checkbox mit Federn und Konfetti, animiertes Durchstreichen, Löschen mit Toast «Rückgängig» (DESIGN.md, Rezept 3).
- TaskList: Liste mit Ein-/Ausgleit-Animation, neue Aufgaben oben (DESIGN.md, Rezept 4).
- EmptyState: Illustration des Looks und freundlicher Satz (DESIGN.md, Rezept 5).
- ProgressRing: zeigt erledigt/gesamt, federt bei Änderung (DESIGN.md, Rezept 1).
- App: Rahmen mit Hero im Look, Fortschrittsring und Datum (DESIGN.md, Rezept 1).

## Risiken

- Alte oder kaputte Daten im localStorage: loadState gibt bei ungültigem Inhalt eine leere Liste zurück und wirft keinen Fehler (docs/STACK.md, «Datenhaltung»).
- Konfetti im Test: Aufruf liegt in `src/lib/celebrate.ts`, damit er im Test ersetzt werden kann.
- Leereingabe-Trick (nur Leerzeichen): Model kürzt und trimmt den Titel, damit nichts Leeres gespeichert wird.
