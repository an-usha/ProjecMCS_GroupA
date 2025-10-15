const express=require('express');

const router=express.Router();
const {adLoginUser,logoutUser}=require('../controller/authController');

//for active directory login

router.post('/adlogin', adLoginUser);
router.post('/logout', logoutUser);

module.exports=router;