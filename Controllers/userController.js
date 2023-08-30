const mongoose = require('mongoose');
const User = require("../Models/User");
const BoothDatas = require("../Models/Data");
const generateAuthToken = require('../utils/generateAuthToken');
const { verify } = require("jsonwebtoken");
require('dotenv').config();

const loginUser = async(req,res,next) =>{
    const {name , password} = req.body ;
    
    try{
        if(!name || !password){
            return res.status(400).send("All inputs are required");
        }
        const user = await User.findOne({name});

        if(user && user.password == password){
            const cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              };
              const token = generateAuthToken(
                user._id,
                user.name,
                user.boothSt,
                user.boothEd,
                user.isAdmin,
                user.isSuperAdmin
              );
              
                return res
                .cookie(
                  'access_token',
                  token,
                  cookieParams
                )
                .json({
                  success: "user logged in",
                });
           
        }else{
         const err = new Error('invalid credentials');
         next (err);
        }
    }catch(err){
        next(err);
    }
    
}

// user routes
const getData = async(req,res,next) =>{
        try{
            const userData = await verify(req.cookies.access_token,process.env.JWT_SECRET_KEY);
            const {boothSt,boothEd} = userData;

            if(!userData){
                const err =  new Error('login required');
                next(err);
            }
            const data = await BoothDatas.find({
                "Polling Booth Number" : {$gte : boothSt, $lte: boothEd}
            });

            res.json({
                message : "fetched success",
                Data : data

            })
        }catch(err){

        }
}

const deleteData = async(req,res,next) =>{
        const DataID = req.params.id;
        console.log(DataID);
        try{
            const data =  BoothDatas.findOne({DataID});
            console.log(data);
            if(!data){
                const err = new Error('data not found');
                next(err);
            }

           const deleted = await BoothDatas.findByIdAndDelete(DataID);

            res.json({
                message: 'deleted Successfully',
                deleted : deleted
            })
        }catch(err){
            next(err);
        }
}
const updateData = async(req,res,next) =>{
    const DataId = req.params.id;
    console.log(DataId);
    const DData = req.body;
    try{
        let data = await BoothDatas.findById(DataId);
        
        if(!data){
            const err = new Error('no data found')
            return next(err);
        }else{

            data["Polling Booth Number"] = DData["Polling Booth Number"] || data["Polling Booth Number"] ;
            data["Polling Booth Name"] = DData["Polling Booth Name"] || data["Polling Booth Name"] ;
            data["Parent Constituency"] = DData["Parent Constituency"] || data["Parent Constituency"] ;
            data["Winner- 2014"] = DData["Winner- 2014"] || data["Winner- 2014"] ;
            data["Margin (%)"] = DData["Margin (%)"] || data["Margin (%)"] ;
            data["Margin"] = DData["Margin"] || data["Margin"] ;
            data["Total Voters"] = DData["Total Voters"] || data["Total Voters"] ;
            data["BJP - Votes"] = DData["BJP - Votes"] || data["BJP - Votes"] ;
            data["BJP- % vote"] = DData["BJP- % vote"] || data["BJP- % vote"] ;
            data["INC- Votes"] = DData["INC- Votes"] || data["INC- Votes"] ;
            data["INC- % votes"] = DData["INC- % votes"] || data["INC- % votes"] ;
            console.log(data);
            await data.save();
         res.json({
            message: "Data updated successfully"
         });
        }
    }catch(err){
        next(err);
    }
}

// admin routes
const getUserData = async(req, res, next) => {
     try{
        const users = await User.find({
            $and: [
                { isAdmin: false },
                { isSuperAdmin: false }
            ]
        });
     
     res.json({
        message : 'fetched successfully',
        usersData : users
     })
     }catch(err){
        next(err);
     }

}
const updateUser = async(req, res, next) => {
        const userId  = req.params.id;
        const {name, password,boothSt,boothEd} = req.body;
        try{
            const user = await User.findById(userId);
        if(!user){
            const err = new Error('user not exists');
            next(err);
        }

        user.name = name || user.name;
        user.password = password || user.password;
        user.boothSt = boothSt || user.boothSt;
        user.boothEd = boothEd || user.boothEd;

        await user.save();

        res.json({
            message : "updated successfully",
            users : user
        })
        }catch(err){
            next(err);
        }
}


const deleteUser = async(req, res, next) => {
   const userId = req.params.id;

   try{
    const deleted = await User.findByIdAndDelete(userId);

    if(!deleted){
        const err = new Error("User doesn't exists");
    }

    res.json({message : "deleted successfully"})
   }catch(err){
        next(err);
   }

}


const createUser = async(req, res, next) => {
    const { name, password, boothSt, boothEd } = req.body;
    try {
        if (!name || !password || !boothSt || !boothEd) {
            throw new Error("all fields required")
        }

        const user = await User.create({name : name , password : password, boothSt : boothSt , boothEd : boothEd})

        await user.save()

        res.json({
            message : 'user created successfully',
            user : user
        })
    } catch (err) {
        next(err);
    }
}

// Super Admin routes

const createAdmin = async(req,res,next) =>{
    try{
        const {name , password} = req.body;

        if (!name || !password ) {
            throw new Error("all fields required")
        }

        const user = await User.create({name : name , password : password, isAdmin : true})

        await user.save()

        res.json({
            message : 'Admin created successfully',
            user : user
        })

        
    }catch(err){

    }
}
const getAdminData = async(req,res,next) =>{
      try{
          const admins = await User.find({
            $and: [
                { isAdmin: true },
                { isSuperAdmin: false }
            ]
        });
          res.json({
            admins : admins
          })
      }catch(err){
        next(err)
      }
}
const updateAdmin = async(req,res,next) =>{
       try{
        const {name , password, isAdmin} = req.body;

       const adminId = req.params.id;

       const admin = await User.findById(adminId);

       if(!admin){
            const err = new Error('Admin not exists');
            next(err);
       }else{

       admin.name = name || admin.name;
       admin.password = password || admin.password;
       admin.isAdmin = isAdmin || admin.isAdmin;

       await admin.save();

       res.json({
        message: "Admin updated successfully",
        admin : admin
       })}
       }catch(err){
        next(err);
       }
}
const deleteAdmin = async(req,res,next) =>{

    try{
        const adminId = req.params.id;

        const Exists =  await User.findById(adminId);
        if(!Exists){
            const err = new Error('Admin not exist');
            next(err);
        }else{
         await User.findByIdAndDelete(adminId);
        res.json({
            message : "Admin deleted Successfully",
        })}
    }catch(err){
        next(err);
    }



}


module.exports = { loginUser, getData,getAdminData,updateAdmin,updateData,updateUser,deleteAdmin,deleteUser,deleteData,createAdmin,getUserData, createUser};