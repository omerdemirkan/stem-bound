import { Storage } from "@google-cloud/storage";
import { UploadedFile } from "express-fileupload";
import { injectable } from "inversify";
import config from "../config";
import { IStorageService } from "../types";

@injectable()
export default class StorageService implements IStorageService {
    private storage = new Storage({
        keyFilename: require.resolve("../../env/gcp-storage.json"),
        projectId: config.projectId,
    });

    private assetsBucket = this.storage.bucket(config.assetsBucketName);

    saveFileToBucket(file: UploadedFile): Promise<string> {
        return new Promise((resolve, reject) => {
            const { name, data } = file;

            const blob = this.assetsBucket.file(name.replace(/ /g, "_"));
            const blobStream = blob.createWriteStream({
                resumable: false,
            });
            blobStream
                .on("finish", () =>
                    resolve(
                        `https://storage.googleapis.com/${this.assetsBucket.name}/${blob.name}`
                    )
                )
                .on("error", (e) =>
                    reject(
                        `Unable to upload image, something went wrong: \n${e.message}`
                    )
                )
                .end(data);
        });
    }
}
