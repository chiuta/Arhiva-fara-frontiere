# Jurnal de modificări — Arhiva fără frontiere

Format: [SemVer](https://semver.org/lang/ro/) (MAJOR.MINOR.PATCH). Istoricul complet al versiunilor anterioare este în secțiunea „Istoric / Changelog” din [README.ro.md](README.ro.md).

## 2.1.0 — 2026-10-27

### Adăugat
- Filtru de licență (domeniu public/CC0, CC BY, BY-SA, BY-ND, BY-NC, BY-NC-SA, BY-NC-ND) pe câmpul `licenseurl`; licența declarată apare în fișa materialului.
- Casetă opțională „Wayback Machine”: verifică dacă o adresă web are o copie (`archive.org/wayback/available`), cu link către cea mai apropiată copie sau către calendarul web.archive.org. Răspunsurile cu scheme nesigure sunt respinse.
- Export favorite în CSV (cu neutralizarea formulelor) și Markdown.
- Chei de interfață noi în 8 limbi (traduceri automate pentru fr/it/es/pt/de/hu, neverificate de vorbitori nativi).
- Test nou `tests/v21.test.mjs` (25 de verificări, rețea simulată).

### Nu s-a implementat
- Căutare în conținutul arhivelor web (CDX/Wayback): în afara domeniului declarat al aplicației.
- Filtrul pe tip de media exista deja (`Tip de conținut`).

### De verificat
- Modelele `licenseurl:http*…*` și răspunsul CORS al `archive.org/wayback/available` nu au putut fi testate pe archive.org real (rețeaua nu era accesibilă); verifică manual după publicare.

## 2.0.0 — 2026-10-26

Versiunea anterioară; vezi README.ro.md.
