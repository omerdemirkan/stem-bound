import express, { Application } from "express";

export default function (app: Application) {
    app.set('trust proxy', 1);
    app.use(express.json());
}