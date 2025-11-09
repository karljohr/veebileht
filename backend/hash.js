import bcrypt from 'bcrypt'

async function hashPassword(userPassword) {
    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(userPassword, salt)
    return passwordHash
}

async function comparePassword(userPassword, passwordHash) {
    const result = await bcrypt.compare(userPassword, passwordHash);
    return result;
}

export default { hashPassword, comparePassword };