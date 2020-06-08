import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
    throw new Error('!!! env file not found !!!')
}

export default {
    port: process.env.PORT
}