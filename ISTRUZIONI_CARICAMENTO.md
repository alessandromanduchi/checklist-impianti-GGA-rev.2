# 📦 ISTRUZIONI CARICAMENTO - Checklist Impianti GGA

Guida completa per caricare l'applicazione su GitHub.

---

## ✅ TUTTO È GIÀ PRONTO!

I file sono **già configurati** per il tuo repository:
- Repository: `alessandromanduchi/checklist-impianti-GGA-rev.2`
- URL finale: https://alessandromanduchi.github.io/checklist-impianti-GGA-rev.2/

**Non devi modificare nulla!** Basta caricare i file.

---

## 🚀 METODO 1: Caricamento via Git (Consigliato)

### Passo 1: Estrai i file

```bash
# Estrai l'archivio ZIP
unzip checklist-impianti-GGA-ready.zip -d checklist-impianti-GGA-rev.2

# Entra nella cartella
cd checklist-impianti-GGA-rev.2
```

### Passo 2: Carica su GitHub

```bash
# Inizializza repository Git
git init

# Aggiungi tutti i file
git add .

# Primo commit
git commit -m "Initial commit: NicheSafe v1.0.0 - Checklist Impianti GGA"

# Collega al repository remoto
git remote add origin https://github.com/alessandromanduchi/checklist-impianti-GGA-rev.2.git

# Carica i file
git branch -M main
git push -u origin main
```

✅ **File caricati!**

### Passo 3: Abilita GitHub Pages

1. Vai su: https://github.com/alessandromanduchi/checklist-impianti-GGA-rev.2/settings/pages

2. Sotto "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)

3. Clicca **"Save"**

⏳ Attendi 2-3 minuti...

✅ **App online su**: https://alessandromanduchi.github.io/checklist-impianti-GGA-rev.2/

---

## 🌐 METODO 2: Caricamento via Web (Alternativo)

Se preferisci usare l'interfaccia web di GitHub:

### Passo 1: Estrai i file
Estrai `checklist-impianti-GGA-ready.zip` sul tuo computer

### Passo 2: Vai su GitHub
https://github.com/alessandromanduchi/checklist-impianti-GGA-rev.2

### Passo 3: Carica i file
1. Clicca "Add file" → "Upload files"
2. Trascina TUTTI i file e cartelle estratti
3. **Importante**: Includi anche le cartelle nascoste:
   - `.github` (cartella workflows)
   - `.gitignore`
4. Scrivi commit message: "Initial commit: NicheSafe v1.0.0"
5. Clicca "Commit changes"

### Passo 4: Abilita GitHub Pages
Come sopra (vai su Settings > Pages)

---

## 📋 ELENCO FILE DA CARICARE

Assicurati che questi file siano tutti caricati:

### File Principali (obbligatori)
```
✅ index.html
✅ styles.css
✅ app.js
✅ niches-data.js
✅ manifest.json
✅ service-worker.js
```

### Documentazione
```
✅ README.md
✅ QUICK_START.md
✅ CHANGELOG.md
✅ CONTRIBUTING.md
✅ LICENSE
✅ package.json
```

### Cartelle
```
✅ icons/ (8 file PNG)
✅ screenshots/ (con README.md)
✅ .github/workflows/ (con deploy.yml)
```

### File Configurazione
```
✅ .gitignore
✅ generate-icons.py
```

---

## ✅ VERIFICA FINALE

Dopo il caricamento, verifica:

1. **Repository**: https://github.com/alessandromanduchi/checklist-impianti-GGA-rev.2
   - [ ] Tutti i file visibili
   - [ ] Cartella `.github` presente
   - [ ] Cartella `icons` presente

2. **GitHub Pages**: https://github.com/alessandromanduchi/checklist-impianti-GGA-rev.2/settings/pages
   - [ ] GitHub Pages abilitato
   - [ ] Branch: main
   - [ ] Stato: "Your site is live at..."

3. **App Online**: https://alessandromanduchi.github.io/checklist-impianti-GGA-rev.2/
   - [ ] Pagina si carica correttamente
   - [ ] Lista 282 nicchie visibile
   - [ ] Bottone ⚠️ presente in basso a destra
   - [ ] Console senza errori (F12)

---

## 🔧 TROUBLESHOOTING

### Errore: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/alessandromanduchi/checklist-impianti-GGA-rev.2.git
```

### Errore: "permission denied"
Devi autenticarti. Usa GitHub CLI o crea un token:
```bash
# Con GitHub CLI (consigliato)
gh auth login

# Oppure usa HTTPS con token
# Vai su: Settings > Developer settings > Personal access tokens
```

### GitHub Pages non funziona
- Attendi 5 minuti
- Controlla che il branch sia "main" (non "master")
- Verifica che la cartella sia "/" non "/docs"
- Prova a disabilitare e riabilitare GitHub Pages

### L'app mostra errore 404
- Verifica l'URL: deve finire con `/checklist-impianti-GGA-rev.2/`
- Controlla che `index.html` sia nella root
- Attendi qualche minuto per il deploy

### Service Worker errori
- Normale in localhost
- Funziona solo con HTTPS (GitHub Pages ✅)

---

## 📱 INSTALLAZIONE PWA

Dopo che l'app è online:

### Android (Chrome)
1. Apri https://alessandromanduchi.github.io/checklist-impianti-GGA-rev.2/
2. Menu (⋮) → "Installa app"

### iOS (Safari)
1. Apri l'URL in Safari
2. Condividi → "Aggiungi a Home"

---

## 🎯 RIEPILOGO RAPIDO

```bash
# 1. Estrai
unzip checklist-impianti-GGA-ready.zip -d checklist-impianti-GGA-rev.2
cd checklist-impianti-GGA-rev.2

# 2. Git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/alessandromanduchi/checklist-impianti-GGA-rev.2.git
git push -u origin main

# 3. Abilita Pages
# Vai su Settings > Pages > Branch: main > Save

# 4. Apri app
# https://alessandromanduchi.github.io/checklist-impianti-GGA-rev.2/
```

---

## 📞 SUPPORTO

Se hai problemi:

1. Controlla questa guida
2. Leggi `QUICK_START.md`
3. Apri issue: https://github.com/alessandromanduchi/checklist-impianti-GGA-rev.2/issues

---

## ✨ DATI APPLICAZIONE

- **282 nicchie** con apprestamenti tecnologici
- **138 Idranti VVF** - Verifiche complete
- **114 Colonnine TEM** - Verifiche complete
- **76 Quadri VVF** - Verifiche complete
- **740 nicchie totali** - Per selezione progressiva km
- **Funzionamento offline** - Service Worker
- **Report PDF** - Generazione automatica

---

**Versione**: 1.0.0
**Repository**: alessandromanduchi/checklist-impianti-GGA-rev.2
**Autore**: Alessandro Manduchi

**Buon lavoro! 🚀**
