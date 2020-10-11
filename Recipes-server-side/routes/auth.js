var express = require('express');
var router = express.Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
require("dotenv").config();
var DButils = require('../DB/DButils');
//**
var Countries = ["Australia", "Bolivia", "China", "Denemark", "Israel", "Latvia",
    "Monaco", "August", "Norway", "Panama", "Switzerland", "USA"];
const secret = 'projectSecret';


router.post("/Register", async (req, res, next) => {
    try {
        // parameters exists
        if(!(req.body.username && req.body.password &&req.body.firstName && req.body.lastName && req.body.country && req.body.email)){
            throw { status: 400, message: "Some details are missing" };
        }
        // valid parameters
        if(!validPassword(req.body.password)){
            throw { status: 406, message: "Password must contain at least one digit , at least one special character and the length between 5 and 10" };
        }
        if(!validUsername(req.body.username)){
            throw { status: 406, message: "Username must contain only English Letters and the length between 3 and 8" };
        }

        // username exists
        const users = await DButils.execQuery("SELECT username FROM dbo.users");

        if (users.find((x) => x.Username === req.body.username))
            throw { status: 409, message: "Username already taken" };

        // add the new username
        let hash_password = bcrypt.hashSync(
            req.body.password,
            parseInt(process.env.bcrypt_saltRounds)
        );
        await DButils.execQuery(
            `INSERT INTO dbo.Users (Username, UserPassword,FirstName,LastName,Country,Email,ImageURL) VALUES ('${req.body.username}', '${hash_password}','${req.body.firstName}','${req.body.lastName}','${req.body.country}','${req.body.email}','${req.body.image}')`
        );
        res.status(201).send("User created");
    } catch (error) {
        next(error);
    }
});
router.get("/userInformation", async (req, res, next) => {
    try {

        const user = (
            await DButils.execQuery(
                `SELECT * FROM dbo.Users WHERE Username = '${req.query.username}'`
            )
        );
        res.status(200).send( createUserProfile(user));
    } catch (error) {
        next(error);
    }
});
router.post("/Login", async (req, res, next) => {
    try {
        // check that username exists
        // before: if (!db.users.find((x) => x.name === req.body.name))
        //   throw new Error("password or Name is not correct");
        // after:
        const users = await DButils.execQuery("SELECT Username FROM dbo.Users");

        if (!users.find((x) => x.Username === req.body.username))
            throw { status: 401, message: "Username or Password incorrect" };

        // check that the password is correct
        // before: var user = db.users.find((x) => x.name === req.body.name);
        // after:
        const user = (
            await DButils.execQuery(
                `SELECT * FROM dbo.Users WHERE Username = '${req.body.username}'`
            )
        )[0];
        // user = user[0];
        console.log(user);

        let hash_password = bcrypt.hashSync(
            req.body.password,
            parseInt(process.env.bcrypt_saltRounds)

        );
        if (!bcrypt.compareSync(req.body.password,user.UserPassword)) {
            throw { status: 401, message: "Username or Password incorrect" };
        }

        // Set cookie
        req.session.user_id = user.user_id;
        // res.cookie("cookieName", "cookieValue", cookies_options); // options is optional

        // return cookie
        res.status(200).send("login succeeded");
    } catch (error) {
        next(error);
    }
});

// router.post("/Logout", function (req, res) {
//     req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
//     res.send({ success: true, message: "logout succeeded" });
// });

function validUsername(username){
    if(username.length>=3 && username.length<=8 && /^[a-zA-Z]+$/.test(username)){
        return true;
    }
    return false;

};

function validPassword(password){
    if(password.length>=5 && password.length<=10 && /\d/.test(password)){
        let splChars = "*|,\":<>[]{}`\';()@&$#%";
        for (let i = 0; i < password.length; i++) {
            if (splChars.indexOf(password.charAt(i)) != -1) {
                return true;
            }
        }
    }
    return false;
};


function validCountry(country){
    for(let i = 0; i < Countries.length; i++) {
        if (Countries[i] === country) {
            return true;
        }
    }
    return false;

}
function createUserProfile(user){
    let User={};
    let username="username",firstName="firstName",lastName="lastName",country="country",email="email",image="image";
    User[username]= user[0].Username;
    User[firstName]= user[0].FirstName;
    User[lastName]= user[0].LastName;
    User [country]= user[0].Country;
    User[email]= user[0].Email;
    User[image]= user[0].ImageURL;

    return User;
}
module.exports = router;