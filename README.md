# Page Speed Tool

## Setup
Make sure [Node.js](https://nodejs.org/en/) is installed.

Install the dependencies.
```bash
npm i
```

Run the build script.
```bash
npm run build
```

Yay, you're done with setup.


## Configuration
Create the urls text file.
```bash
touch urls.txt
```

Edit the file to include urls.
* Delimited by comma, spaces, or line breaks.

Have an API key?
```bash
touch .env
```

.env file
```
API_KEY = yourApiKeyHere
```


## Running
Run the script. This will read the `urls.txt` file.
```bash
npm start
```