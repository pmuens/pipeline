# Pipeline

Runs your CI / CD pipeline in local containers. Stores the results and lets you inspect builds and logs.

## `.pipeline.yml`

Example `.pipeline.yml` config file.

The `commands` of the `test` step will be run in a container for every defined `image`.

```yml
pipeline:
  - name: test
    images:
      - node:latest
      - node:9.3
      - node:6
    commands:
      - rm -rf node_modules
      - npm install
      - npm test
```

## Run Pipeline in pipeline

1. `yarn install`
1. `yarn run build`
1. `./bin/pipeline run`

## Development

### Without Docker

1. `yarn install`
1. `yarn run build` (or `yarn run watch`)
1. `yarn test`

### With Docker

1. `docker-compose run pipline bash`
1. `yarn install`
1. `yarn run build` (or `yarn run watch`)
1. `yarn test`
