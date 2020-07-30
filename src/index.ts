import config, { logger } from "./config";
import initServer from "./server";

initServer().then((server) =>
    server.listen(config.port, () => {
        logger.info("Server listening on port " + config.port);
    })
);
