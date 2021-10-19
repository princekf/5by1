# 5by1

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

```sh
yarn install
```

## Run the application

```sh
yarn start
yarn start:watch
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
yarn run build
```

To force a full build by cleaning up cached artifacts:

```sh
yarn run rebuild
```

## Fix code style and formatting issues

```sh
yarn run lint
```

To automatically fix such issues:

```sh
yarn run lint:fix
```

## Other useful commands

- `yarn run migrate`: Migrate database schemas for models
- `yarn run openapi-spec`: Generate OpenAPI spec into a file
- `yarn run docker:build`: Build a Docker image for this application
- `yarn run docker:run`: Run this application inside a Docker container

## Tests

```sh
yarn test
```

### Datasources

To add a new datasource, type in `yarn lb4 datasource [<name>]` from the
command-line of your application's root directory.

### Models

To add a new model, type in `yarn lb4 model [<name>]` from the
command-line of your application's root directory.

### Repositories

To add a new repository, type in `yarn lb4 repository [<name>]` from the
command-line of your application's root directory.
### Controllers

To add a new empty controller, type in `yarn lb4 controller [<name>]` from the
command-line of your application's root directory.
### Relations

To add a new empty controller, type in `yarn lb4 relation` from the
command-line of your application's root directory.