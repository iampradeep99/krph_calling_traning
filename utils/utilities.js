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
        const result = formattedName +'-'+ randomPart;
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

     generateRandomPassword(length = 12) {
        const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const digits = '0123456789';
        const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
        
        const allChars = upperCaseChars + lowerCaseChars + digits + specialChars;
        
        let password = '';
        
        // Ensure the password contains at least one character from each set
        password += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
        password += lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length));
        password += digits.charAt(Math.floor(Math.random() * digits.length));
        password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        
        // Fill the rest of the password with random characters from all sets
        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }
    
        // Shuffle the password to ensure randomness
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        return password;
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
      }
}

module.exports = CommonMethods;
