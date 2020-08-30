import config, { storage } from "../config";

const bucket = storage.bucket(config.assetsBucketName);

export function saveFileToBucket(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const { name, arrayBuffer } = file;

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
            .end(arrayBuffer);
    });
}
