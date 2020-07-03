import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import axios from "axios";
import expressRateLimit from "express-rate-limit";
import createMailgun from "mailgun-js";
import config from ".";

export const jwt = Object.freeze({
    sign: jsonwebtoken.sign,
    verify: jsonwebtoken.verify,
    decode: jsonwebtoken.decode,
});

export const bcrypt = Object.freeze({
    compare: bcryptjs.compare,
    compareSync: bcryptjs.compareSync,
    hash: bcryptjs.hash,
    hashSync: bcryptjs.hashSync,
    generateSalt: bcryptjs.genSalt,
});

export const fetch = Object.freeze({
    get: axios.get,
    post: axios.post,
    put: axios.put,
    patch: axios.patch,
    delete: axios.delete,
});

const rateLimit = (
    options?: expressRateLimit.Options | undefined
): expressRateLimit.RateLimit => expressRateLimit(options);

export const rateLimiter = rateLimit;

if (!config.mailgunApiKey) {
    throw new Error(
        `Mailgun api key in config returned ${config.mailgunApiKey}`
    );
}

export const mailgun = createMailgun({
    apiKey: config.mailgunApiKey,
    domain: config.clientDomain,
});
