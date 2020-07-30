import express, { Application } from "express";
import loadServer from "./loaders";

async function initServer() {
    const app: Application = express();
    const server = await loadServer({ app });
    return server;
}

export default initServer;
