const mongoose = require('mongoose');

const User = mongoose.Schema({
    
        name: {
            type: String,
            required : true
        },
        password : {
            type : String,
            required: true
        },

        boothSt : {
            type : String,
            default : 0,
            require: true
        },
        boothEd : {
            type : String,
            default : 0,
            require: true
        },
        isAdmin : {
            type : Boolean,
            default: false
        },
        isSuperAdmin : {
            type : Boolean,
            default: false
        }
})


const Users = mongoose.model('users',User);

module.exports = Users;