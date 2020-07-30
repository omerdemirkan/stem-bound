import routes from "../api/api.routes";
import { Application, Request, Response } from "express";

export default function routesLoader(app: Application) {
    app.use("/api", routes);

    app.all("/*", function (req: Request, res: Response) {
        res.send(
            "Invalid route. Check out the api documentation: https://github.com/omerdemirkan/stem-bound-api"
        );
    });
}
