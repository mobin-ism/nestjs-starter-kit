<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/NestJS.svg" width="200" alt="Nest Logo" />
</p>


## Update Packages

We are gonna install an `npm` package globally for updating our `package.json` file with the latest version of used package in the starter kit. Install a package called <a href="https://www.npmjs.com/package/npm-check-updates" target="blank">`npm-check-updates`</a>

```bash
npm install -g npm-check-updates
```

Then run the inspector that will inspect the package versions.

```bash
ncu -u
```

Now you will see the package.json file has been updated with the latest package versions.

## Creating Environment

Before running the application, you have to make an `.env` file using the given `.env.example` file.

## Installing Dependencies

```bash
yarn
```

## Running the app

```bash
# Run development
yarn start

# watch mode
yarn start:dev

# production mode
npm run start:prod
```

## Seed Superadmin data

```bash
yarn seed:run
```

Now you can login to the starter kit with superadmin@example.com and 123456 as password.
