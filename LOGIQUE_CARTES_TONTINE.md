LOGIQUE D'AFFICHAGE DES CARTES TONTINE YANKAP
=====================================================

CONCEPT DE BASE
===============
- Une tontine = un groupe de discussion avec des super-pouvoirs financiers
- L'affichage montre le groupe, pas les messages individuels comme WhatsApp
- Les cartes représentent l'état du groupe et la position de l'utilisateur

BADGE DE NOTIFICATIONS
======================
- AVEC MESSAGES : Affiche le nombre de messages non lus (3, 7, 1, 12...)
- SANS MESSAGES : PAS DE BADGE DU TOUT (ne jamais afficher "0")
- INACTIVE : Pas de badge (car aucune activité)

GRILLE D'INFORMATIONS 2x2
==========================

Position 1 (Ligne 1, Colonne 1) - "VOUS"
------------------------------------------
Label : "- Vous" ou "> Vous"
  • "- Vous" : Utilisateur normal ou en attente
  • "> Vous" : Utilisateur bénéficie actuellement (SAUF pour carte Bloquée = toujours "- Vous")

Valeurs possibles (4 états) :
  • "-X tours" : L'utilisateur n'a pas encore bénéficié, il attend X tours
  • "✅" : L'utilisateur a déjà bénéficié de la tontine
  • "⬇️" : C'est le tour de l'utilisateur actuellement (il bénéficie maintenant)
  • "--" : Tontine en attente (aucun délai défini)

RÈGLES SPÉCIALES :
- CARTE BLOQUÉE : Premier "Vous" est TOUJOURS "- Vous" (jamais ">")
- CARTE EN ATTENTE : Valeur = "--" (pas de délai)

Position 2 (Ligne 2, Colonne 1) - QUI BÉNÉFICIE
------------------------------------------------
Label : 
  • "> Nom" : Quelqu'un d'autre bénéficie (ex: "> Marie", "> Paul")
  • "> Vous" : L'utilisateur bénéficie actuellement
  • "- Vous" : Pour carte Bloquée où l'utilisateur est le bénéficiaire
  • "En attente" : Aucun bénéficiaire défini
  • "Fini" : Tontine terminée

Valeur : 
  • "X/Y" : Position dans le cycle (ex: "8/12", "3/6")
  • "X/Y" : Pour carte Bloquée = nombre de personnes qui ont payé (ex: "7/10")

Position 3 (Ligne 1, Colonne 2) - MONTANT
------------------------------------------
Label : "FCFA"
Valeur : Montant de la tontine (ex: "50 000", "75 000")

Position 4 (Ligne 2, Colonne 2) - JOURS DE COTISATION ET DÉLAI
----------------------------------------------------------------
RÈGLES D'AFFICHAGE DU LABEL :
  • UN SEUL JOUR : 
    - Jour de la semaine : "Dimanche", "Samedi" (JAMAIS abrégé)
    - Date numérique : "Jour + Date" (ex: "Ven 15", "Lun 03")
  
  • PLUSIEURS JOURS : 
    - Maximum 2 dates affichées (actuelle + suivante)
    - Format : "Date précédente, Date actuelle" (ex: "Dim, Mer")
    - Date actuelle = en gras et soulignée
    - Date précédente = en opacité réduite
    - Si > 2 dates : les autres disparaissent, ne garder que actuelle + suivante
    - LOGIQUE : Date actuelle toujours en position finale (derrière)
  
  • PAR INTERVALLE : Intervalle entre crochets (ex: "[7.Jrs]", "[2.Sem]", "[1.M]")

VALEUR : Statut temporel avec codes spéciaux
  • "-X Jour" : En avance de X jours (format singulier)
  • "⚠️ +X Jours" : En retard de X jours (avec emoji, format pluriel)
  • "À jour" : À temps
  • "Suspendu" : Tontine bloquée
  • "--" : Tontine en attente (aucun délai défini)

ÉTATS ET STATUTS DE TONTINE
============================

1. ACTIF (Vert #28A745)
-----------------------
- Tontine en cours de fonctionnement normal
- Utilisateur peut avoir n'importe quel statut ("- X tours", "✅", "⬇️")
- Affichage normal de toutes les informations
- BOUTON COINS : Actif SEULEMENT si utilisateur pas encore à jour (statut ≠ "✅")

2. TERMINÉ (Gris #6C757D)
-------------------------
- Tous les cycles terminés
- Position 1 : "✅" pour l'utilisateur
- Position 2 : "Fini" + "X/X" (complet)
- Position 4 : Statut "À jour"
- BOUTON COINS : Désactivé (gris)

3. EN ATTENTE (Orange #FF8C00)
------------------------------
- Tontine créée mais pas encore démarrée
- Position 1 : "- Vous" + "--" (aucun délai)
- Position 2 : "En attente" + "0/X" (aucun bénéficiaire)
- Position 4 : Valeur "--" (aucun délai défini)
- BOUTON COINS : Désactivé (gris)

4. BLOQUÉ (Rouge #DC3545)
-------------------------
- Tontine suspendue à n'importe quel moment
- Position 1 : TOUJOURS "- Vous" (même si bénéficiaire)
- Position 2 : Si "Vous" bénéficiez = "> Vous" + nombre de payeurs
- Position 4 : "Suspendu" en valeur finale
- Garde l'état au moment du blocage
- BOUTON COINS : Désactivé (gris)

5. INACTIF (Gris #9E9E9E)
-------------------------
- Tontine complètement inactive/abandonnée
- TOUTES les positions = "--"
- Pas d'état d'avancement dans le header
- Pas de badge de notifications
- BOUTON COINS : Désactivé (gris)

LOGIQUE DU BOUTON COINS
=======================
ACTIF (vert) SEULEMENT SI :
- Statut tontine = "Actif" 
- ET utilisateur pas encore à jour (statut ≠ "✅")

DÉSACTIVÉ (gris) pour tous les autres cas :
- Tontine "Terminé", "En attente", "Bloqué", "Inactif"
- OU utilisateur déjà à jour ("✅")

EXEMPLES CONCRETS COMPLETS
===========================

TONTINE ACTIVE (utilisateur attend 3 tours, en retard)
Header: "Actif - 7/12 OK"
Badge: 3 messages
Position 1: "- Vous" | "-3 tours"
Position 2: "> Marie" | "8/12"
Position 3: "FCFA" | "50 000"
Position 4: "Dim, Mer" | "⚠️ +2 Jours"
Bouton: ACTIF (vert)

TONTINE TERMINÉE (utilisateur a bénéficié)
Header: "Terminé - 8/8 OK"
Badge: 7 messages
Position 1: "- Vous" | "✅"
Position 2: "Fini" | "8/8"
Position 3: "FCFA" | "75 000"
Position 4: "Dimanche" | "À jour"
Bouton: DÉSACTIVÉ (gris)

TONTINE EN ATTENTE (pas encore démarrée)
Header: "En attente - 0/6 OK"
Badge: 1 message
Position 1: "- Vous" | "--"
Position 2: "En attente" | "0/6"
Position 3: "FCFA" | "25 000"
Position 4: "[2.Sem]" | "--"
Bouton: DÉSACTIVÉ (gris)

TONTINE BLOQUÉE (utilisateur bénéficiaire quand bloquée)
Header: "Bloqué - 4/10 OK"
Badge: 12 messages
Position 1: "- Vous" | "⬇️"
Position 2: "> Vous" | "7/10" (7 personnes ont payé)
Position 3: "FCFA" | "100 000"
Position 4: "[7.Jrs]" | "Suspendu"
Bouton: DÉSACTIVÉ (gris)

TONTINE INACTIVE (complètement abandonnée)
Header: "Inactif" (pas d'état d'avancement)
Badge: Aucun
Position 1: "--" | "--"
Position 2: "--" | "--"
Position 3: "--" | "--"
Position 4: "--" | "--"
Bouton: DÉSACTIVÉ (gris)

TONTINE ACTIVE (date numérique, en avance)
Header: "Actif - 4/6 OK"
Badge: 2 messages
Position 1: "- Vous" | "-2 tours"
Position 2: "> Paul" | "4/6"
Position 3: "FCFA" | "40 000"
Position 4: "Ven 15" | "-8 Jour"
Bouton: ACTIF (vert)

RÈGLES IMPORTANTES FINALES
===========================
1. Badge à 0 = pas de badge du tout
2. Tontine inactive = tirets partout + AUCUN état d'avancement + aucun badge
3. Tontine bloquée garde l'état au moment du blocage + "Suspendu"
4. Carte bloquée : premier "Vous" = toujours "- Vous"
5. En attente : délai = "--", pas de bénéficiaire défini
6. Dates multiples : maximum 2 (précédente + actuelle), actuelle en gras/souligné
7. Retard = "⚠️ +X Jours", avance = "-X Jour"
8. Bouton coins actif = Actif + utilisateur pas à jour uniquement
