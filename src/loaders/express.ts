import express, { Application } from "express";

export default function (app: Application) {
    app.use(express.json());
}