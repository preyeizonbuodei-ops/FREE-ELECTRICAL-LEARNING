const joi = require('joi')

exports.validateUserRegister = joi.object({

    username: joi.string()
        .required()
        .min(4),
        


    email: joi.string()
        .required()
        .email({ tlds: { allow: ['com', 'org'] } })
        .pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)),



    department: joi.string()
        .required(),

    matricnumber: joi.string()
        .required()
        .pattern(new RegExp(/^FUO\/\d{2}\/(EEE|MCE|CVE|CME|PEG)\/\d{5}$/)),

    level: joi.number()
        .valid(100, 200, 300, 400, 500),
    
    phonenumber: joi.string()
        .required()

}),

exports.validateAdmin = joi.object({

    username: joi.string()
        .required(),

    adminkey: joi.string()
        .required(),

})