import config, { logger } from "./config";
import initServer from "./server";

initServer().then((app) =>
    app.listen(config.port, () => {
        logger.info("Server listening on port " + config.port);
    })
);
