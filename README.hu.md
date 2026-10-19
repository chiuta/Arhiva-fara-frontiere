# Arhiva fără frontiere — Internet Archive-böngésző

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

**Verzió:** 1.1.0 · **Utolsó frissítés:** 2026-10-14

Egyetlen HTML-fájl az Internet Archive (archive.org) gyűjteményeinek, szerzőinek és nyilvános feltöltéseinek kereséséhez és böngészéséhez, 7 nyelven.

**Élő verzió:** https://chiuta.github.io/Arhiva-fara-frontiere/

![Képernyőkép](screenshot.png)

*(A képernyőkép helyben szimulált mintaadatokat használ, nem az archive.org valódi találatait.)*

## Mi ez

Nem hivatalos webes kliens az Internet Archive nyilvános API-jához: beírsz egy gyűjteményt, feltöltőt, szerzőt vagy témát (vagy beillesztesz egy `archive.org/details/...` hivatkozást), és a találatokat kártyákként látod, ahol lehetséges, az alkalmazáson belüli előnézettel. Nem áll kapcsolatban az Internet Archive-val. Nem webarchívumokban (Wayback Machine, Arquivo.pt stb.) kereső eszköz: csak az archive.org `advancedsearch.php` és `metadata` végpontjait kérdezi le.

## Funkciók

A kódban ellenőrizve:
- Keresés gyűjtemény, feltöltő, szerző, téma vagy „Auto” szerint (gyűjtemény OR feltöltő OR szerző); a `@` előtag és az `archive.org/details|metadata|download|embed/...` hivatkozások felismerhetők.
- Szűrők: tartalomtípus (videó, hang, szövegek, képek, szoftver, etree, adatok, webarchívumok, gyűjtemények), rendezés (véletlenszerű is), oldalanként 24/48/96 találat, nyelv, évtartomány; „Továbbiak betöltése” (kb. 10 000 találatos felső korlát).
- Részletkártya: leírás (egyszerű szöveggé alakítva), témák, szülőgyűjtemények, az első 25 fájl letöltési hivatkozással, „Megnyitás az archive.org-on” hivatkozás.
- Beágyazott előnézet (iframe `archive.org/embed/...`) videóhoz, hanghoz, szövegekhez, szoftverhez, etree-hez; a „képek” típusnál a legnagyobb kép.
- A kedvencek helyben, a böngészőben tárolódnak (localStorage, kulcs: `arhiva-ff-favorite-v1`), JSON-exporttal/-importtal.
- Az utolsó 8 sikeres keresést a keresőmező javasolja (helyben, a böngészőben; „Legutóbbi keresések törlése” gomb).
- Hálózati hiba esetén megjelenik a „Ugyanez a keresés az archive.org-on →” hivatkozás a hivatalos keresőre.
- Egyértelmű üzenet, ha offline vagy (felesleges hálózati kérés nélkül); a kedvencek továbbra is megtekinthetők.
- Gyorsbillentyű: a `/` a keresőmezőre viszi a fókuszt.
- Felület románul, angolul, franciául, olaszul, spanyolul, portugálul, németül (`?lang=xx` vagy a böngésző nyelve).
- Billentyűzet: fókuszálható kártyák (Enter/Szóköz), az Esc bezárja az ablakot, a fókusz az ablakban marad.

## Használati útmutató

1. Írj a keresőmezőbe egy gyűjteményt (pl. `prelinger`), egy `@feltöltő`-t, egy szerzőt, vagy illessz be egy archive.org-hivatkozást.
2. Válaszd ki a módot (Auto / Gyűjtemény / Feltöltő / Szerző / Téma) és szükség esetén a szűrőket.
3. Nyomd meg a „Keresés” gombot; a „Továbbiak betöltése” gombbal a következő oldal töltődik be.
4. Egy kártyára kattintva megjelennek a részletek és az előnézet; az Esc bezárja az ablakot.
5. A kedvenceket a ☆ jellel jelöld meg; a „Kedvencek exportálása” JSON-fájlba menti őket, a „Kedvencek importálása” újra betölti.

## Adatvédelem és hálózat

- Az egyetlen kapcsolatba lépő külső gazda: `archive.org` (és aldomainjei, átirányításokon keresztül). A keresések, a metaadatok, az indexképek, a képek, a beágyazott lejátszó és a letöltések közvetlen kérések az Internet Archive felé: ők megkapják az IP-címedet, a böngésződet, hogy mire keresel és mit nyitsz meg, és a lejátszóban sütiket állíthatnak be. Az alkalmazásnak nincs saját szervere, analitikája és fiókja, de a „nincs követés” az Internet Archive oldalán nem garantálható; lásd az adatvédelmi szabályzatukat.
- Helyi tárolás: a kedvencek listája (minimális metaadatok: azonosító, cím, típus, szerző, dátum; kulcs: `arhiva-ff-favorite-v1`) és az utolsó 8 keresés (kulcs: `arhiva-ff-recente-v1`) a `localStorage`-ban, az eszközödön; semmi nem kerül elküldésre sehová. A kedvencek kiürítésével, a „Legutóbbi keresések törlése” gombbal vagy a webhelyadatokból törölheted őket. Ha a tárolás blokkolt, a kedvencek csak a memóriában maradnak.
- Böngészőengedélyek: egyet sem kér.
- Biztonság: az archive.org-tól kapott szövegek szövegként jelennek meg (nem HTML-ként); a leírásokat `DOMParser` alakítja át; a CSP-szabályzat a hálózatot az archive.org-ra korlátozza, és a szkriptet csak hash alapján engedi (a szkriptekhez nincs `unsafe-inline`); az előnézeti keret `sandbox` attribútumú. A kedvencek importja ellenőrzött.

## Korlátok és figyelmeztetések

- A tartalom az Internet Archive-é és a feltöltőké; a szerzői jogok a jogtulajdonosokat illetik. Újrafelhasználás előtt ellenőrizd az egyes anyagok jogi státuszát.
- Ha az archive.org nem elérhető, vagy korlátozza a kéréseket, az alkalmazás hibaüzenetet mutat (a kérések 20 másodperc után lejárnak).
- A beágyazott előnézet az Internet Archive lejátszójától függ, és a böngésző vagy a sütibeállítások blokkolhatják; ebben a tárolóban nem tesztelték valódi hálózattal.
- Az API felső korlátja a keresést nagyjából az első 10 000 találatra korlátozza.

## Helyi / offline futtatás

Töltsd le az `index.html` fájlt, és nyisd meg egy böngészőben. Internet nélkül nem működik (minden adat az archive.org-ról érkezik).

## Licenc

MIT — lásd a [LICENSE](LICENSE) fájlt.

## Előzmények / Changelog

### 1.1.0 — 2026-10-14
- Biztonsági mentés és adatcímkézés (fff-kit).

### 1.0.0 — 2026-10-12
- A verzió és az utolsó frissítés dátuma megjelenik az alkalmazásban (lábléc, 7 nyelven).

### 2026. október 11. (7. kör)
- Javítva: a lábléc szövege (7 nyelven) azt állította, hogy az alkalmazás nem ment semmit a böngészőben, holott a kedvencek a `localStorage`-ban vannak.
- Új: legutóbbi keresések javaslatokkal és törléssel; hivatkozás az archive.org hivatalos keresőjére, ha a kérés sikertelen (7 nyelvre lefordítva).

### 2026. október 11. (6. kör)
- Új: a kedvencek a `localStorage`-ban maradnak; külön üzenet 7 nyelven, ha offline vagy; `/` gyorsbillentyű a kereséshez.
- Biztonság: CSP hash alapú `script-src`-vel (a szkriptekhez nincs `'unsafe-inline'`).

### 2026. október 11.
- Javítva: a „Továbbiak betöltése” gomb már nem jelenik meg az üres állapotban (a hidden attribútumot a CSS felülírta).
- Javítva: az „év -tól / év -ig” mezők már nem csonkulnak keskeny képernyőn (megnövelt szélesség, új sorba törés).
- Ellenőrizve: 0 axe-core szabálysértés 1280 és 360 px mellett, nincs konzolhiba.

## Szerző

Alexio — Alexandru-Ionuț Chiuță, elérhetőség: alexio@trom.tf

## Összefoglaló

Nem hivatalos, egyfájlos böngésző az Internet Archive nyilvános kereső- és metaadat-API-jaihoz (7 felületi nyelv): keresés gyűjtemény, feltöltő, alkotó vagy téma szerint, szűrők, az elemek előnézete beágyazott lejátszóban, a kedvencek exportálása JSON-ként. Csak az archive.org-gal létesít kapcsolatot (amely látja az IP-címedet és a lekérdezéseidet); helyben csak a kedvencek listáját tárolja (localStorage), és nincs analitikája. Nem webarchívumokban (Wayback) kereső eszköz. Licenc: MIT (lásd LICENSE).
