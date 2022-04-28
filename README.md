# Simple ERP application built with the following technologies #

* Server - Loopback 4
* Database - MongoDB
* UI - Angular 11
* UX - Material

### Repo details.
* It contains 3 projects, ui, server and shared.
* Version : 1.0.9

### How do I get set up locally? ###

* Clone repo 
* `yarn install:all`
* `yarn build:shared`
* `yarn install:all`
* `yarn start`
* some times there will be errors with shared imports in ui or server project then do `yarn upgrade @shared` (in ui and server fodlers)
