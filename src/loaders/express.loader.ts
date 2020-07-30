import express, { Application } from "express";
import cors from "cors";
import config from "../config";

export default function expressLoader(app: Application) {
    app.set("trust proxy", 1);
    app.set("trust proxy", "loopback, 0.0.0.0");
    app.use(express.json());
    app.use(
        cors({
            credentials: true,
            origin: config.clientOrigin,
        })
    );
}
