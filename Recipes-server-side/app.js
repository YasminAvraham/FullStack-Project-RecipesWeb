require("dotenv").config();
var createError = require('http-errors');
//add express
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session=require("client-sessions");
const DButils = require("./DB/DButils");
var cors = require('cors');

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
    session({
        cookieName: "session", // the cookie key name
        secret: process.env.COOKIE_SECRET, // the encryption key
        duration: 20 * 60 * 1000, // expired after 20 sec
        activeDuration: 0 // if expiresIn < activeDuration,
        //the session will be extended by activeDuration milliseconds
/*        cookie: {
            httpOnly: false
        }*/
    })
);


const corsConfig = {
    origin: true,
    credentials: true
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

var port = process.env.PORT || "3000";


var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var recipeRouter = require('./routes/recipe');



//#region cookie middleware
app.use(function (req, res, next) {
    try {
        if (req.session && req.session.user_id) {
            DButils.execQuery("SELECT user_id FROM users")
                .then((users) => {
                    if (users.find((x) => x.user_id === req.session.user_id)) {
                        req.user_id = req.session.user_id;
                    }
                    next();
                })
                .catch((error) => next());
        } else {
            next();
        }
    }catch (e) {
        console.log(e);
    }
});
//#endregion

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => res.send("welcome"));

//check if the server run(alive)
app.get('/alive',(req,res) => {
  res.send("alive! the server work");
});



app.use('/auth',authRouter);
app.use('/users', usersRouter);
app.use('/recipe', recipeRouter);


app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send({ message: err.message, success: false });
});

const server = app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
});

process.on("SIGINT", function () {
    if (server) {
        server.close(() => console.log("server closed"));
    }
    process.exit();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
