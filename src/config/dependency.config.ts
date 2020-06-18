import jsonwebtoken, { SignOptions } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs'

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

