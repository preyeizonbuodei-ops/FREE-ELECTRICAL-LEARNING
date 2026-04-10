const bcrypt = require('bcrypt')

exports.DoHash = async (value, saltValue) => {
    try {
        const hashed = await bcrypt.hash(value, saltValue);
        return hashed;
    } catch (error) {
        console.log(error)
    }

}

exports.ComparePassword = async (password, existingUserPassword) => {
    try {
        const Compare = await bcrypt.compare(password, existingUserPassword)
        return Compare;
    } catch (error) {
        console.log(error)
    }

}