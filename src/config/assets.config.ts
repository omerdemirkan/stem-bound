import { Storage } from "@google-cloud/storage";
import path from "path";
import config from ".";

export const storage = new Storage({
    keyFilename: path.join(__dirname, "../../env/gcp-storage.json"),
    projectId: config.projectId,
});
