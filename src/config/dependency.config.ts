import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import axios from "axios";
import expressRateLimit from "express-rate-limit";

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
