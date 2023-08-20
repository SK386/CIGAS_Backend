<div align=center>
  <h1>CIGAS Backend</h1>
</div>
<div align=center>
  <img src="https://img.shields.io/badge/node.js%20-%23339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-%233178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Express.js-brown?style=for-the-badge&logo=express&logoColor=white">
</div>

## About
This repository has the CIGAS repository backend code.

## Installation and setup
Start by installing [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io).

Next, [click here to download the repo](https://github.com/SK386/CIGAS_Backend/archive/refs/heads/master.zip), or use the following command to clone it:
```sh
git clone https://github.com/SK386/CIGAS_Backend.git
```

To install dependencies, open a terminal in the project root, and run this command:
```sh
pnpm install
```

This will create a `node_modules` directory and link the packages there.

## Development
To run the API locally, open a terminal in the project root and run the following:

```sh
pnpm dev
```
To open the API, go to http://127.0.0.1:${PORT_ENV_VAR} in your browser.

## Production
To build for production, run this command in the project root:

```sh
pnpm build
```

To start the server, run this command:

```sh
pnpm start
```
