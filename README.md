
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://i.ibb.co/9NVgz45/435-4356261-tupac-shakur-transparent-cartoons-2pac-emoji-hd-png-removebg-preview.png" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  *** If you can't find something to live for, you best find something to die for ***
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
## Running the app

Now its time to install the packages.
```bash
yarn
```

Before running the application, you have to make an `.env` file using the given `.env.example` file.

```bash
# Run development
yarn start

# watch mode
yarn start:dev

# production mode
npm run start:prod
````