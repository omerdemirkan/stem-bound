import jsonwebtoken, { SignOptions } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import axios from 'axios';
import expressRateLimit from 'express-rate-limit';

export const jwt = {
    sign: jsonwebtoken.sign,
    verify: jsonwebtoken.verify,
    decode: jsonwebtoken.decode
}

export const bcrypt = {
    compare: bcryptjs.compare,
    compareSync: bcryptjs.compareSync,
    hash: bcryptjs.hash,
    hashSync: bcryptjs.hashSync,
    generateSalt: bcryptjs.genSalt
}

export const fetch = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    patch: axios.patch,
    delete: axios.delete
}

const rateLimit = (...params: any) => expressRateLimit(...params);

export const rateLimiter = rateLimit

