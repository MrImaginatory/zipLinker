import { customAlphabet } from 'nanoid';

const generateNanoId = () => {
    const randomAlphaNumeric = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
    return randomAlphaNumeric();
}

export { generateNanoId }