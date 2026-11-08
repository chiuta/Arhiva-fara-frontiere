# Jurnal de modificări — Arhiva fără frontiere

Format: [SemVer](https://semver.org/lang/ro/) (MAJOR.MINOR.PATCH). Istoricul complet al versiunilor anterioare este în secțiunea „Istoric / Changelog” din [README.ro.md](README.ro.md).

## 2.2.7 — 2026-11-08

- Nou: notă sub rezultate că unele fișe pot fi doar de împrumut/cu acces restricționat pe archive.org (aplicația nu poate filtra după disponibilitate) — 8 limbi.

## 2.2.4 — 2026-11-03

Etapa 4: jurnal de teren geolocalizat comun (plicul geo/journal, export GeoJSON/GPX), cu atlas în Arhiva fără frontiere

## 2.2.3 — 2026-11-03

Accesibilitate: meniul „Trimite către…” / „Primește…” stă într-un reper ARIA (regula axe «region»); secțiunea seifului folosește h2. Cod comun din hub.

## 2.2.2 — 2026-11-03

Plic FFF (.fff.json) v1: butonul „Trimite către…” (aplicații, fișier, clipboard, cod QR, alte file) și „Primește…”. Cod comun din hub: tools/fff-envelope.js (injectat, nu copiat de mână). Favoritele se trimit ca citation/csl; se primesc citări cu adrese archive.org.

## 2.2.0 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.2.0 — 2026-10-27

Anterior: v2.1.0.

### Adăugat
- Filtru pe tip de media aplicat rezultatelor deja încărcate (și favoritelor): chip-uri cu număr sub caseta de căutare, fără cerere nouă; se resetează la o căutare nouă sau la schimbarea între rezultate și favorite; păstrat la schimbarea limbii. Selectorul „Tip de conținut” (filtru pe server) există neschimbat din versiunile anterioare.
- Chei noi (`facetAria`, `facetAll`, `mtOther`) în 8 limbi (fr/it/es/pt/de/hu automate, neverificate de vorbitori nativi).
- Test nou `tests/v22.test.mjs` (13 verificări, rețea simulată).

### Nu s-a implementat
- Căutare în conținutul arhivelor web (CDX/Wayback): în afara domeniului declarat al aplicației.
- Verificarea modelelor `licenseurl:` și a CORS-ului Wayback pe archive.org real (fără acces la rețea în mediul de lucru): rămâne de făcut manual.

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
