## Le site Web nosgestesclimat.fr

## C'est quoi ?

Un simulateur d'empreinte climat individuelle de consommation à l'année, utilisant le modèle [nosgestesclimat](https://github.com/datagir/nosgestesclimat).

Pour contribuer au modèle et données sous-jacentes (calculs, textes, questions, suggestions de saisie), rendez-vous [ici](https://github.com/datagir/nosgestesclimat/blob/master/CONTRIBUTING.md).

Pour tout ce qui touche à l'interface (style d'un bouton, graphique de résultat, code javascript, etc.) c'est ici dans les [_issues_](https://github.com/datagir/nosgestesclimat-site/issues).

> 🇬🇧 Most of the documentation (including issues and the wiki) is written in french, please raise an [issue](https://github.com/datagir/nosgestesclimat-site/issues/new) if you are interested and do not speak French.

## Et techniquement ?

C'est un un _fork_ d'un outil de vulgarisation de l'empreinte climat [futur.eco](https://futur.eco), lui-même forké d'un simulateur public de cotisations sociales [mon-entreprise.fr](https://mon-entreprise.fr), qui permet de coder en français des règles de calculs, dans le langage [publi.codes](https://publi.codes). De ces règles de calcul, des simulateurs (pour l'utilisateur lambda) et des pages de documentation qui expliquent le calcul (pour l'expert ou le curieux) sont générés automatiquement.

Le code est en Javascript / Typescript / React / styled-components / Webpack, Yjs, entre autres.

### 🇬🇧Installation

The footprint model is stored in the [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) `nosgestesclimat/` pointing to the corresponding GitHub [repository](https://github.com/datagir/nosgestesclimat).

Consequently, to fetch all the data you need to provide the `--recursive` flag when cloning this repository or if it's already cloned you need to run `git submodule update --init --recursive`.

The model YAML files will then be loaded locally (no installation needed, they are loaded by webpack), and your changes to these files will refresh the UI instantly.

> The production version fetches the JSON compiled YAML rules deployed by datagir/nosgestesclimat.

Then run this command in this repo :

`yarn && yarn start`

If you want to run the automatic localisation, which depdends on a Netlify Edge function, you must run `netlify dev`.

## Réutilisations de ce code

-   [L'Empreinte Carbone de vos activités à Centrale Nantes](https://github.com/SustainabilityCN/nosgestesclimat-site-ECN)
-   [Mon Match Carbone](https://github.com/pascalbes/monmatchcarbone-site)
-   [Mon Empreinte Pro](https://github.com/WeCount-io/nosgestesclimat-WC-site)

Attention, même si la licence MIT vous permet de réutiliser ce code à votre guise, vous ne pouvez pas réutiliser la marque Nos Gestes Climat. [Veuillez lire notre guide de personnalisation](https://github.com/datagir/nosgestesclimat-site/blob/master/PERSONNALISATION.md)
