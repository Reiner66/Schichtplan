# SchichtPlan PWA – Setup Anleitung

## Dateien im Paket
```
schichtplan/
├── index.html      ← Die App
├── manifest.json   ← PWA-Konfiguration
├── sw.js           ← Service Worker (Offline)
├── icon.png        ← Hüttenfuchs App-Icon
└── README.md       ← Diese Datei
```

---

## 🏠 Lokaler Server (zu Hause)

### Option A – Python (einfachste Methode, kein Install nötig)
```bash
# In den schichtplan/ Ordner wechseln
cd schichtplan

# Server starten
python3 -m http.server 8080
```
→ App öffnen: **http://localhost:8080**  
→ Im Heimnetz vom Handy erreichbar unter: **http://192.168.x.x:8080**  
  (IP-Adresse des PCs herausfinden: `ipconfig` (Windows) / `ifconfig` (Mac/Linux))

### Option B – Node.js (npx serve)
```bash
npx serve schichtplan -p 8080
```

### Option C – Raspberry Pi (dauerhaft laufen lassen)
```bash
# Nginx installieren
sudo apt install nginx

# Dateien kopieren
sudo cp -r schichtplan/* /var/www/html/

# Nginx starten
sudo systemctl start nginx
sudo systemctl enable nginx
```
→ Erreichbar unter der lokalen IP des Pi, z.B. **http://192.168.1.100**

---

## 📱 Als App auf dem Handy installieren

### Android (Chrome)
1. App im Browser öffnen (http://192.168.x.x:8080)
2. Chrome-Menü (⋮) → **"Zum Startbildschirm hinzufügen"**
3. Name bestätigen → **Installieren**
4. App erscheint auf dem Homescreen wie eine native App ✓

### iPhone / iPad (Safari)
1. App in **Safari** öffnen
2. Teilen-Button (□↑) → **"Zum Home-Bildschirm"**
3. Name bestätigen → **Hinzufügen**
4. App erscheint auf dem Homescreen ✓

> ⚠️ iPhone: Nur Safari unterstützt PWA-Installation, nicht Chrome!

---

## 🌐 GitHub Pages (kostenlos, überall erreichbar)

### Einmalige Einrichtung
```bash
# 1. GitHub-Account anlegen (falls noch nicht vorhanden)
#    https://github.com/join

# 2. Neues Repository erstellen
#    https://github.com/new
#    Name: schichtplan
#    Sichtbarkeit: Public (für kostenlose Pages)

# 3. Dateien hochladen
git init
git add .
git commit -m "SchichtPlan PWA"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/schichtplan.git
git push -u origin main

# 4. GitHub Pages aktivieren:
#    Repository → Settings → Pages
#    Source: "Deploy from branch" → main → / (root)
#    → Speichern

# 5. Nach ~2 Minuten erreichbar unter:
#    https://DEIN-USERNAME.github.io/schichtplan/
```

### Updates einspielen
```bash
git add .
git commit -m "Update"
git push
```
→ GitHub Pages aktualisiert sich automatisch innerhalb von ~1 Minute.

---

## 🔒 HTTPS (wichtig für PWA!)

- **GitHub Pages**: automatisch HTTPS ✓
- **Lokaler Server**: funktioniert ohne HTTPS auf `localhost` ✓
- **Heimnetz mit IP**: Service Worker läuft nur auf `localhost` oder HTTPS!  
  → Für Heimnetz-HTTPS: kostenloses SSL mit [Caddy](https://caddyserver.com/) möglich

---

## 🔄 Offline-Funktion

Nach dem ersten Öffnen mit Internet-Verbindung:
- App & alle Daten werden gecacht
- Danach **vollständig offline nutzbar**
- Daten werden im Browser gespeichert (localStorage)
- Kein Server nötig nach erstem Laden

---

## 💾 Datensicherung

Die App speichert alle Daten im **Browser-LocalStorage**.  
Tipp: Daten sichern über Browser DevTools → Application → LocalStorage  
Schlüssel: `spv5`

---

*SchichtPlan – CGM Hüttenfuchs Edition*  
[cgm.de](https://cgm.de/)
