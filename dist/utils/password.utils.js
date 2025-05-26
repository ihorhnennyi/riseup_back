"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassword = generateRandomPassword;
function generateRandomPassword() {
    const length = 12;
    const charset = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*'
    };
    let password = '';
    password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
    password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
    password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
    password += charset.special.charAt(Math.floor(Math.random() * charset.special.length));
    const allChars = Object.values(charset).join('');
    for (let i = password.length; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    return password.split('').sort(() => Math.random() - 0.5).join('');
}
//# sourceMappingURL=password.utils.js.map