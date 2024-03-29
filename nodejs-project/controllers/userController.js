const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) =>{
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    
    const userAvailable = await User.findOne({ email });
    if(userAvailable){
        res.status(400);
        throw new Error("User with same email already registered!");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
    });
    if(!user){
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.status(201).json({_id: user._id, email: user.email});
});

//@desc Login user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({ email });
    
    //compare password with hash password
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user._id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "1h" }
        );
        res.status(200).json({accessToken})
    }
    else{
        res.status(401);
        throw new Error("Wrong email or password.");
    }
});

//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) =>{
    res.json(req.user);
});

//@desc Current user info
//@route POST /api/users/renew-token
//@access private
const renewTokenUser = asyncHandler(async (req, res) =>{
    const accessToken = jwt.sign({
        user:{
            username: req.user.username,
            email: req.user.email,
            id: req.user._id,
        },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: "1h" }
    );
    res.status(200).json({accessToken})
});


module.exports = { registerUser, loginUser, currentUser, renewTokenUser }