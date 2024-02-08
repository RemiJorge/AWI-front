<div align="center">

# Application de Gestion des Bénévoles

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Licence Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />Ce travail est sous licence <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution - Pas d'Utilisation Commerciale - Partage dans les Mêmes Conditions 4.0 International</a>.

---

Version anglaise de ce document : [README.md](README.md)
<a href="README.md"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1280px-Flag_of_the_United_Kingdom_%283-5%29.svg.png" width="20" height="15" alt="English version"></a>

---

### **Description**

Ce projet est une plateforme de gestion des bénévoles pour le Festival Du Jeu à Montpellier.

---

[Installation et Exécution](#installation) •
[Documentation](#documentation) •
[Contributions](#contributions)

**Veuillez lire attentivement la [Documentation](Documentation.pdf) fournie.**
</div>


## Fonctionnalités

- Les bénévoles peuvent consulter la planification des inscriptions et décider à quelles activités ils souhaitent participer, examiner les différents jeux disponibles, contacter les référents des activités et gérer leur profil.
- Les administrateurs peuvent gérer les inscriptions, les festivals, les activités et importer de nouveaux jeux via un fichier CSV.
- Très sécurisé selon les dernières normes de sécurité, y compris la conformité au RGPD (Règlement Général sur la Protection des Données).


## Table des matières

- [Installation](#installation)
  - [Prérequis](#prérequis)
  - [Lancement](#lancement)
- [Documentation](#documentation)
  - [Structure du projet](#structure-du-projet)
- [Contributions](#contributions)
  - [Auteurs](#auteurs)
  - [Contrôle des versions](#contrôle-des-versions)

# Installation
<sup>[(Retour en haut)](#table-des-matières)</sup>

## Prérequis
<sup>[(Retour en haut)](#table-des-matières)</sup>

Il est nécessaire d'avoir installé Node.js sur votre machine.

## Lancement
<sup>[(Retour en haut)](#table-des-matières)</sup>

Pour lancer le projet, exécutez la commande suivante :

```bash
npm start
```


# Documentation
<sup>[(Retour en haut)](#table-des-matières)</sup>

Une documentation complète est fournie dans le fichier [Documentation](Documentation.pdf).


## Structure du projet
<sup>[(Retour en haut)](#table-des-matières)</sup>

Voici la structure du projet :

```bash
.
├── Documentation.pdf
├── LICENSE.txt
├── package.json
├── package-lock.json
├── README.fr.md
├── README.md
└── src
    ├── api
    │   └── axios.js
    ├── App.js
    ├── components
    │   ├── Layout.js
    │   ├── MessageUser.js
    │   ├── Missing.js
    │   ├── NavBar.js
    │   ├── PersistLogin.js
    │   ├── Register.js
    │   ├── RequireAuth.js
    │   └── Unauthorized.js
    ├── context
    │   └── AuthProvider.js
    ├── hooks
    │   ├── useAuth.js
    │   ├── useAxiosPrivate.js
    │   ├── useLogout.js
    │   └── useRefreshToken.js
    ├── index.css
    ├── index.js
    ├── styles
    │   ├── admin.css
    │   ├── festival-info.css
    │   └── poste-referent.css
    └── views
        ├── Admin.js
        ├── ChangePassword.js
        ├── ContactEveryone.js
        ├── Contact.js
        ├── ContactMesBenevoles.js
        ├── ContactReferent.js
        ├── FestivalInfo.js
        ├── Flexible.js
        ├── Game.js
        ├── GameList.js
        ├── Home.js
        ├── JobPlanning.js
        ├── LinkPage.js
        ├── Login.js
        ├── Messages.js
        ├── OtherUserProfile.js
        ├── PosteReferent.js
        ├── Profile.js
        ├── Register.js
        ├── RGPD.js
        └── UsersSearch.js
```

# Contributions
<sup>[(Retour en haut)](#table-des-matières)</sup>

## Auteurs
<sup>[(Retour en haut)](#table-des-matières)</sup>

- [**Alexandre Deloire**](https://github.com/alexdeloire)
- [**Remi Jorge**](https://github.com/RemiJorge)

## Contrôle des versions
<sup>[(Retour en haut)](#table-des-matières)</sup>

Git est utilisé pour le contrôle des versions.
