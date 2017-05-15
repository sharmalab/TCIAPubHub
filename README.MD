# TCIA PubHub Public

Public Facing TCIA Pubhub

## Requirements

* Node.js
* Bindaas + MongoDB
* Webpack

## Installation:


* git clone the repo
* Copy config.js.example to config.js
  * Set EZID username etc, bindaas api key and other parameters

* Edit `config.js` and set bindaas host etc.

* `<sudo> npm install`
* you may need to install webpack alone if it fails (``<sudo> npm install webpack`)
* `node bin/www` (Run with nohup etc.)
* Runs on `localhost:3003` by default

## Developers:

* `webpack --watch` to watch and transpile JSX to js
