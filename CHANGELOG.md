# Jurnal de modificări — Arhiva fără frontiere

Format: [SemVer](https://semver.org/lang/ro/) (MAJOR.MINOR.PATCH). Istoricul complet al versiunilor anterioare este în secțiunea „Istoric / Changelog” din [README.ro.md](README.ro.md).

## 2.3.3 — 2026-11-19

- La 320 px: lista de sortare nu mai provoacă derulare orizontală în spaniolă și portugheză, iar câmpul de căutare nu mai iese din cardul său în nicio limbă (constatat de bateria adversarială din 19 noiembrie 2026, verificat înainte/după)
- Metadate: numele aplicației din `app.json` și din `fff-info` era un fragment de cod (un `<title>` dintr-un șablon SVG al scriptului, luat în locul titlului paginii); acum este titlul real (constatat la scanarea tuturor fișierelor app.json din depozite, 19 noiembrie 2026; kit fff 1.8.1 corectează citirea titlului)

## 2.3.2 — 2026-11-17

- Compatibilitate cu browsere mai vechi (Chrome/Edge 55+, Firefox 52+, Safari 10.1+/iOS 10.3+): kitul 1.8.0 aduce stratul de compatibilitate (rezerve pentru API-urile care lipsesc în motoarele vechi), iar sintaxa JavaScript mai nouă decât ES2017 a fost înlocuită cu forme echivalente acolo unde exista; expresiile regulate noi și `import()` trec prin rezerve. Fără modificări de funcționalitate intenționate. Verificat cu parser ES2017 și într-un motor vechi simulat, nu pe dispozitive reale.

## 2.3.1 — 2026-11-15

- Nou: butoane de distribuire pe rețele sociale (vertical, pe marginea din stânga; fără scripturi externe, doar linkuri deschise la clic); bara de zoom cu lupă și „potrivire ecran” revine pe marginea din dreapta, centrată pe verticală; corectat afișarea suprapusă la zoom mare (panourile cu înălțimi în vh/vw nu mai ies din ecran).

## 2.3.0 — 2026-11-15

- Nou: accesibilitate pe toate ecranele — butonul „Aa” (mărimea textului, contrast ridicat, fără animații, text lizibil, linkuri subliniate, citire cu voce), săgeata „Înapoi sus” și „Sari la conținut”; fereastra se potrivește mereu ecranului; zoom-ul cu lupă și „potrivire ecran” stau acum pe marginea din stânga (fff-kit 1.6.0).

## 2.2.12 — 2026-11-15

- Nou: texturi fractale hiper-detaliate (fff-texturi 1.1.2) — fundalul și suprafețele mari (carduri, panouri, antete, butoane; filele și dialogurile ascunse la încărcare, când se deschid) primesc un material generat local (WebGL2, fără rețea și fără imagini), care se repetă fără cusătură; culorile aplicației rămân ale ei. Se oprește din dialogul „Transparență” sau cu `?notex=1`.

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
