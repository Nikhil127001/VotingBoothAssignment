const express = require('express');
const routes = express.Router();
const {verifyIsLoggedIn, verifyIsAdmin, verifyIsSuperAdmin} = require('../middleware/verifyAuthToken');

const {loginUser, getData,getAdminData,updateAdmin,updateData,updateUser,deleteAdmin,deleteUser,deleteData,createAdmin,createUser,getUserData} = require('../Controllers/userController');

routes.post('/login', loginUser)

// user routes
routes.use(verifyIsLoggedIn);
routes.get('/getData', getData);
routes.delete('/deleteData/:id', deleteData);
routes.put('/updateData/:id', updateData);

// admin routes
routes.use(verifyIsAdmin);
routes.post('/createUser', createUser);
routes.get('/getUserData', getUserData);
routes.put('/updateUser/:id', updateUser);
routes.delete('/deleteUser/:id', deleteUser);

//Super admin routes
routes.use(verifyIsSuperAdmin);
routes.post('/createAdmin', createAdmin);
routes.get('/getAdminData', getAdminData);
routes.put('/updateAdmin/:id', updateAdmin);
routes.delete('/deleteAdmin/:id', deleteAdmin);


module.exports = routes;
