Analyse de la Structure du Projet

Voici l'analyse complète du projet CSDMP Dashboard :

---

## 📝 Journal d'Évolution

### 2026-03-27 - Conversion vers thème clair

**Changement majeur :** Conversion de l'ensemble de l'application d'un thème sombre vers un thème clair

**Fichiers modifiés :**

1. **app/globals.css**
   - Background : `#0A1F0D` → `#f8fafc`
   - Sidebar : `#0A1F0D` → `#f1f5f9` (gris clair)
   - Sidebar texte : `#E8F5E8` → `#475569`
   - Cartes : `#1A2F1A` → `#ffffff`
   - Textes : `#E8F5E8` → `#0f172a`
   - Scrollbar adaptée au thème clair

2. **app/index.css**
   - Couleurs médicales mises à jour pour thème clair

3. **components/app-sidebar.tsx**
   - Fond : `bg-medical-bg/95` → `bg-sidebar`
   - Bordures : `border-white/5` → `border-sidebar-border`

4. **components/ui/sidebar.tsx**
   - Éléments sélectionnés : fond `bg-white` + texte `text-vital-green`
   - Éléments non sélectionnés : texte gris
   - Modification de `sidebarMenuButtonVariants` et `SidebarMenuSubButton`

5. **app/login/page.tsx**
   - Background clair, formulaire avec fond blanc
   - Couleurs de textes adaptées

6. **app/page.tsx**
   - Navbar, Hero section, LoginModal en thème clair

7. **components/main-navbar.tsx**
   - Fond gris clair, menu actif en vert/blanc

8. **components/with-sidebar-layout-wrapper.tsx**
   - Background blanc, suppression overlay `.noise`
   - Ajout `overflow-y-auto` pour le scroll

9. **features/patients/components/patient-form.tsx**
   - Background blanc, pleine largeur sur desktop
   - Tous les formulaires : `bg-white border border-border`

10. **components/UI.tsx**
    - GlassCard : fond blanc avec bordure
    - Button : couleurs adaptées
    - Badge : couleurs claires

**Palette finale :**
| Élément | Couleur |
|---------|---------|
| Background principal | `#f8fafc` |
| Sidebar | `#f1f5f9` |
| Cartes/Contenu | `#ffffff` |
| Texte principal | `#0f172a` |
| Texte secondaire | `#64748b` |
| Primaire (vert) | `#00D4AA` |
| Bordures | `#e2e8f0` |
| Éléments actifs | Fond blanc + texte vert |

---

### 2026-03-27 - Refonte page ajout patient

**Composant mis à jour :**
- `features/patients/components/patient-form.tsx` - Refonte complète avec design Stitch
- `features/patients/components/patient-information-form.tsx` - Section Identité avec labels uppercase
- `features/patients/components/patient-additional-info-form.tsx` - Sections Contact, Santé, Urgence

**Design implémenté (4 sections) :**
1. **01. Identité** - Nom, Prénom, Date de naissance, Sexe, Localisation
2. **02. Contact** - Ville de résidence, Quartier, Téléphone
3. **03. Informations de santé** - Groupe sanguin (grille 8 boutons), Lieu de naissance, NPI
4. **04. Contact d'urgence** - Nom et téléphone (section accentuée en rouge)

**Ajouts :**
- Navigation mobile Bottom Nav (Accueil, Patients, Analyses, Factures)
- Header fixe avec bouton retour
- Bouton d'action fixe en bas avec ombre
- Navigation desktop cachée sur mobile

---

### 2026-03-27 - Correction layout page ajout patient (with-sidebar)

**Problème :** Le titre "Ajouter un patient" se mélangeait avec la sidebar et la navbar car le composant `PatientForm` avait son propre header intégré qui entrait en conflit avec le layout `(with-sidebar)`.

**Solution :**
- Ajout d'une prop `showHeader?: boolean` au composant `PatientForm` pour contrôler l'affichage du header intégré
- Quand `showHeader={false}`, le header intégré est masqué et le contenu utilise `pt-6` au lieu de `pt-20`
- La page `app/(with-sidebar)/patients/add/page.tsx` passe désormais `showHeader={false}` pour utiliser le header du layout sidebar
- Modification de `components/with-sidebar-layout-wrapper.tsx` : suppression du padding `p-6` sur le `main` pour laisser le contenu prendre tout l'espace disponible

**Fichiers modifiés :**
- `features/patients/components/patient-form.tsx` - Ajout prop `showHeader`
- `app/(with-sidebar)/patients/add/page.tsx` - Passage de `showHeader={false}`
- `components/with-sidebar-layout-wrapper.tsx` - Suppression padding sur `main`

---

### 2026-03-27 - Ajout système de titre de page dynamique (with-sidebar)

**Problème :** Le titre n'apparaissait pas dans le header du layout sidebar car il n'y avait pas de mécanisme pour définir un titre par page.

**Solution :** Création d'un contexte React (`PageTitleContext`) permettant aux pages de définir dynamiquement le titre affiché dans le header du layout.

**Composants créés :**
- `components/page-title-provider.tsx` - Context + Provider + hook `usePageTitle` + composant `SetPageTitle`

**Fichiers modifiés :**
- `components/with-sidebar-layout-wrapper.tsx` - Intègre `PageTitleProvider` et affiche le titre dynamique
- `app/(with-sidebar)/patients/add/page.tsx` - Utilise `<SetPageTitle title="Ajouter un patient" />`

---

### 2026-03-27 - Implémentation tableau de bord famille

**Composants créés :**
- `PatientCard` - Carte patient avec photo, statut, département
- `TimelineEvent` - Timeline des activités récentes

**Design implémenté :**
- Quick Actions Bento (Ajouter patient, Test labo)
- Grille patients avec statuts colorés
- Graphique de suivi hebdomadaire
- Timeline verticale des activités

---

### 2026-03-27 - Création pages inscription

**Fichiers créés :**
- `app/register/page.tsx` - Page d'inscription
- `app/api/auth/register/route.ts` - Route API
- `features/core/auth/services/auth-client.service.ts` - Méthode register()

**Fonctionnalités :**
- Formulaire 5 champs (Health ID, Nom, Email, Mdp, Confirmation)
- Validation mots de passe
- Connexion automatique après inscription

---

### 2026-03-26 - Analyse initiale des composants Stitch

**Composants Stitch identifiés dans `app/patient/` :**

1. **01-reglement-facture** - Page de paiement avec sélection mode de paiement (cash, mobile money, carte)
2. **02-gestion-patients** - Liste des patients avec cartes et actions rapides
3. **03-analyses-labo** - Résultats de laboratoire avec filtres et métriques
4. **04-facturation-paiements** - Historique factures avec export PDF
5. **05-ajouter-patient** - Formulaire d'ajout patient en 4 sections
6. **06-tableau-bord-famille** - Dashboard famille avec statut patients
7. **07-inscription** - Page de création de compte
8. **08-connexion** - Page de connexion (NPI + mot de passe)

**État actuel :**
- `app/patient/page.tsx` : Dashboard patient partiellement implémenté
- `components/patient/bottom-nav.tsx` : Bottom navigation implémentée
- `components/UI.tsx` : Composants GlassCard, Button, Badge (style medical)

**À faire :**
- [x] Implémenter page règlement facture (`/factures/[id]/payer`)
- [x] Refondre page gestion patients (`/patients`) - thème clair appliqué
- [x] Implémenter page analyses labo (`/analyses`) - thème clair appliqué
- [x] Implémenter page factures (`/factures`) - thème clair appliqué
- [x] Refondre page ajout patient
- [x] Implémenter tableau de bord famille
- [x] Créer pages inscription

---

📁 Architecture Technique

Stack:

- Framework: Next.js 16.1.6 (App Router)
- UI: React 19 + Tailwind CSS v4 + shadcn/ui
- State: TanStack Query + React Hook Form + Zod
- Charts: Recharts
- Animations: Motion (Framer Motion fork)  


🎨 Système de Design Actuel

Thème médical personnalisé:

- Couleur primaire: #00D4AA (Vital Green)
- Background: #0A1F0D (Medical BG)
- Police: Geist Sans + Geist Mono
- Composants: Glass morphism, effets de lueur  


📂 Structure des Dossiers

app/  
 ├── (with-sidebar)/ # Pages avec layout sidebar  
 │ ├── patients/ # ✅ Existe déjà  
 │ ├── billing/ # ✅ Existe déjà  
 │ ├── lab-results/ # ✅ Existe déjà  
 │ └── ...  
 ├── dashboard/ # Tableau de bord  
 ├── login/ # Page de connexion  
 └── patient/ # 🆕 Nouvelles interfaces Stitch

🎯 Écart entre Stitch et Implementation Actuelle

┌───────────────────────┬────────────┬────────────────────────────────────┐  
 │ Écran Stitch │ État │ Actions requises │  
 │ │ actuel │ │  
 ├───────────────────────┼────────────┼────────────────────────────────────┤  
 │ Connexion │ ✅ │ Adapter le style Stitch │  
 │ │ Existant │ (mobile-first) │  
 ├───────────────────────┼────────────┼────────────────────────────────────┤  
 │ Inscription │ ❌ │ Créer /register │  
 │ │ Manquant │ │  
 ├───────────────────────┼────────────┼────────────────────────────────────┤  
 │ Tableau de Bord │ ⚠️ Partiel │ Ajouter widgets famille │  
 │ Famille │ │ │  
 ├───────────────────────┼────────────┼────────────────────────────────────┤  
 │ Ajouter un Patient │ ✅ │ Refondre UI selon Stitch │  
 │ │ Existant │ │  
 ├───────────────────────┼────────────┼────────────────────────────────────┤  
 │ Gestion des Patients │ ✅ │ Améliorer cartes patients │
│ │ Existant │ │  
 ├───────────────────────┼────────────┼────────────────────────────────────┤
│ Analyses de Labo │ ✅ │ Intégrer section "Dernières │  
 │ │ Existant │ analyses" │  
 ├───────────────────────┼────────────┼────────────────────────────────────┤  
 │ Facturation │ ✅ │ Créer page /billing/:id/pay │  
 │ │ Existant │ │
├───────────────────────┼────────────┼────────────────────────────────────┤  
 │ Règlement de Facture │ ❌ │ Créer modal/page de paiement │  
 │ │ Manquant │ │  
 └───────────────────────┴────────────┴────────────────────────────────────┘

📱 Points Clés pour la Responsivité

1. Mobile-first: Les designs Stitch sont 780px de large (mobile/tablette)
2. Bottom Navigation: Navigation fixe en bas pour mobile (comme Stitch)
3. Cartes patients: Layout empilé sur mobile, grid sur desktop
4. Formulaires: Champs pleine largeur, boutons d'action fixes en bas  


🚀 Plan d'Implémentation Recommandé

Souhaitez-vous que je commence par :

1. Créer le composant de navigation mobile (Bottom Nav) pour la responsivité
2. Refondre la page "Gestion des Patients" avec les cartes Stitch
3. Créer la page "Règlement de Facture" manquante
4. Améliorer la page "Ajouter un Patient" avec le design Stitch  


Quelle priorité voulez-vous que je traite en premier ?
