# Roadtrip Asie — Contexte projet

Site vitrine d'un voyage en Asie (roadtrip de 3 mois, semestre d'échange, budget ~4,2 k€). 100% statique, aucun build, aucune dépendance à installer : il suffit d'ouvrir `index.html` (ou de l'héberger sur GitHub Pages / Netlify).

Langue du site : **français**. Style : épuré, typographie serif élégante (Cormorant Garamond) + sans-serif (Manrope), fond crème `#f7f4ee`, palette de couleurs par pays.

---

## Structure des fichiers

```
Trip/
├── index.html          # Toutes les pages du site (landing + 3 couches animées)
├── css/
│   └── style.css       # Tout le CSS (variables de thème, animations, responsive)
├── js/
│   ├── data.js         # LES DONNÉES DU VOYAGE (13 étapes) — c'est ici qu'on édite
│   └── main.js         # Toute la logique JS (navigation, carte, carrousel, galerie, budget…)
└── photos/             # (à créer) emplacement prévu pour les vraies photos de l'utilisateur
```

---

## Architecture : système de "couches" (single-page)

Le site est un SPA maison : chaque vue est une section plein écran `position: fixed` qui entre/sort par **glissement horizontal** (transition `transform 0.9s cubic-bezier(0.77,0,0.18,1)`).

- `.hero` (#hero, z-index 2) : landing, toujours visible par défaut. Classe `.exit` → glisse vers la **gauche** (`translateX(-100%)`).
- `.layer` (z-index 1) : vue plein écran générique. Classe `.enter` → glisse depuis la **droite** (`translateX(100%)` → 0). Toutes les couches portent les variables CSS de thème (`--bg`, `--fg`, `--muted`, `--faint`, `--line`, `--line-strong`, `--btn-bg`, `--ring`).
- `.page` (#page, z-index 1) : la page voyage — carte **et** narration sur **une seule page scrollable**. Elle porte aussi les variables de thème (le mode nuit l'affecte, sauf les tuiles de la carte).

### Les 3 couches (dans l'ordre du DOM)
1. `#page` — carte Leaflet (62vh) + narration chronologique (13 sections d'étapes + bilan) + footer, le tout en scroll vertical continu
2. `#galerie` — galerie masonry + filtres + lightbox
3. `#budget` — graphiques SVG

### Navigation (JS `openLayer` / `goHome`)
- **Menu landing** (`.hero-menu`, pleine largeur, en haut comme un header) : "Galerie" et "Budget" à **droite** (`.hero-menu-right`), `top: 2.4rem` (1.4rem mobile) → `openLayer(nom)` ; la page voyage s'ouvre via "Let's go", la molette ou `↓`
- **"Let's go"** (#btn-go) → `openLayer('page')`
- **"← Retour / ← Accueil"** (`.btn-back[data-home]`) → `goHome()` (revient à la landing). Sur `#page` il n'y a pas de boutons : on revient à l'accueil via `Esc` ou `↑` (clavier)
- Scroll vers le bas sur la **landing** (molette/tactile) → ouvre la page voyage (`openLayer('page')`, glissement horizontal)
- **Aucun feuilletage entre carte et narration** : sur `#page`, la molette / le tactile scrollent naturellement la page (carte en haut, récit en dessous)
- Clavier : `↓`/`PageDown`/`Espace` = avancer (sur `#page` : scroll ; sur landing : ouvre la page), `↑`/`PageUp` = reculer (remonte le scroll, puis retour accueil si tout en haut), `Esc` = retour accueil (ignoré si focus sur un bouton ; gestion lightbox prioritaire)

`openLayer` gère aussi : remise à zéro du scroll, `aria-hidden`, visibilité du nav à points (visible quand `#page` est ouverte) et du bouton ↓.

---

## Les données : `js/data.js`

Tableau `steps` (13 entrées). Schéma :

```js
{
    name: 'Singapour',              // nom affiché
    country: 'Singapour',           // DOIT correspondre à une clé de countryColors
    lat: 1.3521, lng: 103.8198,     // coordonnées GPS du pin
    number: 1,                      // numéro d'ordre (aussi id="step-N")
    duration: '6 jours',            // chaîne affichée ; parseInt() extrait le nombre
    budget: '220 €',                // chaîne affichée ; parseInt() extrait le montant
    note: '…',                      // sous-titre du popup carte
    story: ['paragraphe 1', 'paragraphe 2'],  // récit de l'étape
}
```

- **Ajouter/éditer une étape = uniquement modifier `data.js`** : les pins, popups, sections de narration, galerie, graphiques budget et compteurs du bilan se mettent à jour automatiquement.
- Les jours/budgets numériques sont dérivés par `parseInt()` des chaînes (ex. `'6 jours'` → 6). Garder ce format.

### Couleurs par pays (`countryColors` dans main.js)

| Pays | Code | Couleur |
|---|---|---|
| Malaisie | `#3d9970` | vert |
| Thaïlande | `#f2b705` | ambre |
| Indonésie | `#e07a3f` | orange |
| Chine | `#c0392b` | rouge |
| Corée du Sud | `#4a90d9` | bleu |
| Taïwan | `#9b59b6` | violet |
| Vietnam | `#16a085` | turquoise |
| Cambodge | `#a98467` | brun |
| Émirats Arabes Unis | `#b8860b` | doré |

Ces couleurs sont utilisées partout : pins, badges, points de navigation, graphiques, liste des pays.

---

## Fonctionnalités par vue

### Landing (hero)
- **Carrousel** de 6 photos Wikimedia Commons (`heroPhotos` dans main.js), rotation toutes les 6 s en fondu croisé (1,2 s)
- **Adaptation titre** : analyse de la luminosité de la photo (canvas) → classe `hero--dark` si photo sombre (titre blanc + fondu noir en haut), sinon titre sombre + fondu blanc
- Menu de navigation + bouton "Let's go"

### Page voyage (#page : carte + narration)
- Leaflet 1.9.4 via CDN unpkg, tuiles OpenStreetMap (attribution requise)
- `fitBounds` sur toutes les étapes, zoom molette désactivé jusqu'au 1er clic sur la carte
- Pins numérotés (`.pin`, 26 px, couleur du pays), popup à droite du pin : mini-photo + durée + budget + note
- **En-tête "Mon trip"** (hiérarchie typographique) : eyebrow "Le voyage" (petites capitales espacées), titre serif, description, **ligne de stats calculées** (#page-stats remplie par JS : km/pays/jours/budget, chiffres serif + libellés, séparés par filets verticaux), et **diviseur ornemental** (ligne — losange — ligne)
- Carte **réduite à 62vh** (56vh mobile) dans un `.map-wrap` en flex centré — **la narration suit immédiatement en dessous** : la page entière défile verticalement (`.page` est la zone de scroll)
- **Narration** (`.story-content`, générée depuis `data.js`) : 13 sections en layout alterné (photo/texte), lettrine serif sur le 1er paragraphe, photo large 21:9 sous chaque section, puis **bilan** (`buildBilan()`) et footer
- **Suivi visuel** : `#story-nav` (direct enfant de `<body>`, fixe à gauche, centré verticalement) — 13 points aux couleurs des pays (`.story-dot`, sans fond ni contour), actif agrandi, clic = scroll fluide vers l'étape. Visible seulement quand `#page` est ouverte **et** que la carte a totalement quitté l'écran (masqués dès que la carte reparaît), suit le scroll de `#page`
- **Bilan** (`buildBilan()` dans main.js) : compteurs (km/pays/jours/budget), top 3 moments forts, pays traversés, records du voyage (cartes avec indicateurs visuels), citation, galerie 6 photos

### Galerie (#galerie)
- 39 photos : 3 par étape (seeds picsum `trip-N-a/b/c` avec ratios 4:3, 21:9, 3:4 pour le masonry `columns`)
- Filtres par pays (pastilles `.filter`), clic photo → **lightbox** (navigation ←/→, compteur, clavier, Esc, clic dehors)

### Budget (#budget)
- 4 stats (total, €/jour, moyenne/étape, étape max) — tout calculé depuis `data.js`
- **Graphiques SVG générés en JS** (aucune librairie) : barres par étape (couleurs pays, tooltip `<title>`, valeurs) + courbe cumulée (aire + points)
- **Détail par étape** (barres proportionnelles au €/jour + total + €/jour), tri implicite par ordre d'apparition

---

## Photos

- **Toutes les photos sont des vraies photos** issues de Wikimedia Commons (hotlinkables, libres) : le mapping `seed → fichier Commons` est dans `photoFiles` (main.js), le helper `photo(seed, w, h)` génère une URL `Special:FilePath/...?width=…` (redimensionnée à la volée).
- **Carrousel hero** : `heroPhotos` (main.js) — 6 photos phares du trip (Bromo, Phi Phi, Mutianyu, Séoul, Dubaï, Angkor).
- **Étapes / galerie / popups / bilan** : graines `trip-N-a/b/c` et `bilan-1…6` (toujours via `photo()`).
- Si une photo ne se charge pas (fichier supprimé sur Commons), le helper retombe sur `picsum.photos/seed/<seed>/<w>/<h>`.
- Pour mettre les vraies photos de l'utilisateur : déposer les fichiers dans `photos/` et remplacer l'entrée dans `photoFiles` (ou les appels `photo(...)`) par un chemin local.

---

## Mode nuit & variables CSS

Toutes les couleurs de contenu passent par des variables définies sur `.layer` et `.page` (et surchargées par `body.theme-dark .layer, body.theme-dark .page`). **Ne pas remettre de couleurs en dur dans les styles des couches** (sauf cas volontaire : `.hero`, tuiles et popups Leaflet). Le mode nuit affecte toute la page voyage (carte comprise) mais pas la landing ni les tuiles de la carte.

---

## Dépendances (CDN, dans index.html)

- Leaflet `1.9.4` (CSS + JS) : `https://unpkg.com/leaflet@1.9.4/dist/leaflet(.css/.js)`
- Google Fonts : `Cormorant Garamond` (300/400/italique) + `Manrope` (300/400/500)

---

## Idées d'améliorations non implémentées

1. **Page "Itinéraire"** : timeline verticale (dates, trajets, km entre étapes), clic → saut dans la narration
2. **Page "Rencontres"** : gens croisés sur la route, anecdotes
3. **Page "Food diary"** : plats goûtés avec photos et notes
4. **Trajet dessiné sur la carte** : polyligne reliant les pins (Leaflet), colorée par pays
5. **Animations au scroll** dans la narration (IntersectionObserver, fade-in)
6. **Métadonnées** pour le partage (Open Graph / Twitter Cards)
7. **Réelles photos de l'utilisateur** (remplacer les photos Commons)

---

## Commandes utiles

- **Tester** : ouvrir `index.html` dans un navigateur (aucune installation)
- **Vérifier** qu'aucune URL d'image ne casse : les fichiers Commons ont été validés via l'API ; si un fichier est supprimé sur Commons, le helper `photo()` retombe sur picsum
- Hébergement conseillé : GitHub Pages (dépôt git) ou Netlify (glisser-déposer du dossier)
