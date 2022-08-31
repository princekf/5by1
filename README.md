# Simple ERP application built with the following technologies #

* Server - Loopback 4
* Database - MongoDB
* UI - Angular 11
* UX - Material

### Repo details.
* It contains 3 projects, ui, server and shared.
* Version : 1.0.25

### How do I get set up locally? ###

* Clone repo 
* `yarn install:all`
* `yarn build:shared`
* `yarn install:all`
* `yarn start`
* some times there will be errors with shared imports in ui or server project then do `yarn upgrade @shared` (in ui and server fodlers)

### How do I install the application ? ###
* Fill the `.env` files in `server` app.
* Start the server app. `yarn start:server`
* Access the API doc : eg `http://localhost:9000/api/api-docs/`
* Go to `http://localhost:9000/api/api-docs/#/UserController/UserController.install`
* Use `INSTALL_APP_SECRET` from `.env` file and execute the above API.
* Start the UI app. `yarn start:ui`
* Open `http://localhost:4300` in browser.
* Use the super admin credentials which were provided in `.env` file.
* From `Settings` menu, create a company and start the operations.

### Start MongoDB
* In MAC : `sudo brew services start mongodb-community@4.4`
