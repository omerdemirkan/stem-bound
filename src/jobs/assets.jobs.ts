import config, { storage } from "../config";
import { UploadedFile } from "express-fileupload";

const bucket = storage.bucket(config.assetsBucketName);

export function saveFileToBucket(file: UploadedFile): Promise<string> {
    return new Promise((resolve, reject) => {
        const { name, data } = file;

        const blob = bucket.file(name.replace(/ /g, "_"));
        const blobStream = blob.createWriteStream({
            resumable: false,
        });
        blobStream
            .on("finish", () => {
                resolve(
                    `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                );
            })
            .on("error", () => {
                reject(`Unable to upload image, something went wrong`);
            })
            .end(data);
    });
}
