const express=require("express");
const router=express.Router();


router.get("/",(req,res)=>{
    res.send("Welcome to Demo Application");
    });

module.exports = router;