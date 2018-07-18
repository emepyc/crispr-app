This project contains the web application code for the Crispr / Cas9 project


## Installation

- Clone this repo:

```bash
$ git clone https://github.com/emepyc/crispr-app
$ cd crispr-app 
```

- Install all dependencies:

```shell
$ yarn install
```

- Build the SCSS source files

```
$ yarn run build-css
# To watch for changes in SCSS files, run...
$ yarn run watch-css 
```

- Start the application

```
$ yarn start
```

This will start a new web application on `https://localhost:3000`
This web application expects a [crispr / cas-9 API](https://docs.google.com/document/d/1-PNpwzvO4tgWuh2M2qC5eBdjGzFTQkcyFk5HYSTbdh4/edit) instance available at `http://crispr.io:5000`. This value can be changed using the environmental variable `REACT_APP_API_BASEURL` or just creating an `.env.local` file in the root directory with the value of `REACT_APP_API_BASEURL`:

```
$ cat > .env.local
REACT_APP_API_BASEURL=http://crispr.io:5000
^D
``` 
