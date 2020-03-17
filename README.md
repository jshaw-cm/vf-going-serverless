# vf-going-serverless

## TLDR

Copy and paste this line.

- `npm i && npm run build && npm run sls -- deploy --stage <stage>`

## Table of Contents

- [Prerequisites](#prereqs)
- [Getting Started](#getting_started)
- [Usage](#usage)

This is a serverless application that deploys a Lambda, DynamoDB, and S3 bucket.  Upon deploy, a file will be synced to the S3 bucket, and a custom serverless plugin will invoke the lambda which will read the file from S3 and store the contents of the file in dynamodb.

## Prerequisites <a name = "prereqs"></a>

- [nodejs](https://nodejs.org/en/)

## Getting Started <a name = "getting_started"></a>

### Structure

- `vf-going-serverless`: This is the root of the serverless project.
- `vf-going-serverless/app`: This is the lambda applicatin.
- `upload`: This directory will be synced to the S3 bucket after the deployment of the serverless application.
- `vf-going-serverless/plugin/invoke-after-deploy`: This is the plugin for invoking the lambda after the serverless deployment.
- `.vscode`: Settings for vscode (lint on save). Tasks settings.

## Usage <a name = "usage"></a>

### Install dependencies

```bash
$ vf-going-serverless
npm i
```

This will install dependencies in:

- `vf-going-serverless` 
- `vf-going-serverless/app`
- `vf-going-serverless/plugin/invoke-after-deploy`

### Build

```bash
$ vf-going-serverless
npm run build
```

This will lint and build:

- `vf-going-serverless/app`
- `vf-going-serverless/plugin/invoke-after-deploy`

### Setup environment

Setup your access key and secret:

```bash
export AWS_ACCESS_KEY_ID=<your-access-key>
export AWS_SECRET_ACCESS_KEY=<your-secret>
```

### Deploy

```bash
$ vf-going-serverless
npm run sls -- deploy --stage <stage>
```

## Some extra stuff

- [jest](https://jestjs.io/) for unit testing.
- [eslint](https://eslint.org/) for linting typescript.
- [husky](https://github.com/typicode/husky) to test and lint before pushing code.
- [prettier](https://prettier.io/) for formatting code.
