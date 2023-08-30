const mongoose = require('mongoose');

const BoothData = mongoose.Schema({
    
        "Polling Booth Number" : {
            type: Number,
            required : true
        },
        "Polling Booth Name" : {
            type : String,
            required: true
        },

        "Parent Constituency" : {
            type : String,
            require: true
        },
        "Winner- 2014" : {
            type : String,
            require: true
        },
        "Margin (%)" : {
            type : Number,
            require : true
        },
        "Margin" : {
            type : Number,
            require : true
        },
        "Total Voters" : {
            type : Number,
            require : true
        },
        "BJP - Votes" : {
            type : Number,
            require : true
        },
        "INC- Votes" : {
            type : Number,
            require : true
        },
        "INC- % votes" : {
            type : Number,
            require : true
        }
})


const BoothDatas = mongoose.model('BoothDatas',BoothData);

module.exports = BoothDatas;