# Setup

Running: `npm run dev`

# Design

- Technische Rahmenbedingungen:
    - Muss innerhalb von Portuna funktionieren
    - Minimales externes JS
    - JS nur als inline script oder von CDN
    - Kein bundeling oder minifizieren.

- Design Rahmenbedingungen
    - Viele Fachberatungsstellen
    - Mobilfreundlich

- Probleme und Lösungen:
  - Mobil am Besten: Liste
    - Aber: langweilig und schon da.
    - <== Karte
      - Nicht mobil-freundlich; aber layout ist sowieso schon fixed width
      - Zu viel Whitespace:
        - <== Liste auf rechter Seite
          - Zu lang!
          - <== Nur aktuell ausgewählte FBS zu sehen.


# TODOs

- Compile
- Minimize D3 dependencies
- Only load script when D3 there
- Hardcode json
- JS, no TS
