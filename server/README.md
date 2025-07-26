# Server

## Usage
1. Execute `npm install` in the server directory
2. Use `npm run start` to run a node demon watching for changes and restarting the server if neccessary

`npm run build` can be used to create a production build in the build/ directory

## Entry point
The main entrypoint is [src/index.ts](src/index.ts). When changing this make sure to update [nodemon.json](nodemon.json) to call the correct file.