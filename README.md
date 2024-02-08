<div align="center">

# Volunteer Management Platform Frontend

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

---

French version of this : [README.fr.md](README.fr.md)
<a href="README.fr.md"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/1200px-Flag_of_France.svg.png" width="20" height="15" alt="French version"></a>

---

### **Description**

This is a volunteer management platform frontend for the Games Week event in Montpellier. 

---

[Installation and Execution](#installation) •
[Documentation](#documentation) •
[Contributions](#contributions)

**Please read the the thourough [Documentation](Documentation.pdf) provided.**
</div>


## Main Features

- Volunteers can consult the inscriptions planning and decide which activity they want to participate in, consult the different games available, message the responsible of the activities and manage their profile.
- Admins can manage the inscriptions, festivals, activities, and import new games through a CSV file.
- Highly secure with regards to the latest security standards, including GDPR compliance.


## Table of Contents

- [Installation](#installation)
  - [Pre-requisites](#pre-requisites)
  - [Runnung the project](#running-the-project)
- [Documentation](#documentation)
  - [Folder structure](#folder-structure)
- [Contributions](#contributions)
  - [Authors](#authors)
  - [Version control](#version-control)

# Installation
<sup>[(Back to top)](#table-of-contents)</sup>

## Pre-requisites
<sup>[(Back to top)](#table-of-contents)</sup>

You need Node.js installed on your machine.

## Running the project
<sup>[(Back to top)](#table-of-contents)</sup>

To run the project, execute the following command:

```bash
npm start
```

# Documentation
<sup>[(Back to top)](#table-of-contents)</sup>

A thourough documentation is provided in the [Documentation](Documentation.pdf) file.


## Folder structure
<sup>[(Back to top)](#table-of-contents)</sup>

The project is structured as follows:
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
<sup>[(Back to top)](#table-of-contents)</sup>

## Authors
<sup>[(Back to top)](#table-of-contents)</sup>

- [**Alexandre Deloire**](https://github.com/alexdeloire)
- [**Remi Jorge**](https://github.com/RemiJorge)

## Version control
<sup>[(Back to top)](#table-of-contents)</sup>

Git is used for version control.