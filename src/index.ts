import config from "./config";
import initServer from "./server";

initServer().then((app) =>
    app.listen(config.port, () => {
        console.log("Server listening on port " + config.port);
    })
);
