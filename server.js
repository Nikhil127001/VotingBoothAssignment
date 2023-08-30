const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const apiRoutes = require('./Routes/apiRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port  = 3000;
require('./Database/db');
require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended : true}))

app.use('/', apiRoutes);

app.use((err,req,res,next)=>{
    res.json({
        message: err.message
    })
})
app.listen(port,()=>{
    console.log(`Starting server on port ${port}` );
})