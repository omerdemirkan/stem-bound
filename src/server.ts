import express, { Application } from "express";
import loaders from "./loaders";

async function initServer() {
    const server: Application = express();
    await loaders({ app: server });
    return server;
}

export default initServer;
