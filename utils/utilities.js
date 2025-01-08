const jwt = require('jsonwebtoken');
const zlib = require('zlib');

class CommonMethods {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        console.log(this.name);
    }

    generateRandomAlphanumeric() {
        const characters = '0123456789';
        let randomPart = '';
        const charactersLength = characters.length;

        for (let i = 0; i < this.length; i++) {
            randomPart += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        const formattedName = this.name.toUpperCase(); // Convert name to uppercase
        const result = formattedName + randomPart;
        return result;
    }

    async GZip(payload) {
        let data = '';
        const stringify = JSON.stringify(payload);
        const buffer = await zlib.gzipSync(stringify);
        data = buffer.toString('base64');
        return data;
    }

    async unGZip(data) {
        const buffer = Buffer.from(data, 'base64');

        const uncompressedBuffer = await new Promise((resolve, reject) => {
            zlib.gunzip(buffer, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const jsonString = uncompressedBuffer.toString('utf-8');
        const originalPayload = JSON.parse(jsonString);

        return originalPayload;
    }

    generateToken(payload) {
       

        return jwt.sign(payload, process.env.JWTSECRETKEY, { expiresIn: process.env.EXPIRYTIME });
    }
}

module.exports = CommonMethods;
