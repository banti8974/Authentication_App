const express = require("express");
const router = express.Router(); 


const { login, signup } = require("../Controller/Auth");
const {auth,isStudent,isAdmin}=require("../middlewares/auth");



// Define routes
router.post("/login", login);
router.post("/signup", signup);


//testing protected routes for single middleware
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        msg:'Welcome to the Protected route for Students',
        });
})

//procted   Route for student  
router.get("/student",auth,isStudent,(req,res) =>{
    res.json({
        success:true,
        msg:'Welcome to the Protected route for Students',
        });
    
})
// procted for admin
router.get("/admin",auth,isAdmin,(req,res) => {
    res.json({
        success:true,
        msg:'Welcome to the Protected route for Admin',
        });
    });
// Export the router
module.exports = router;
