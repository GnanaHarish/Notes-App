const route = require("express").Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
},
    async function (accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            secondName: profile.name.familyName,
            profieImage: profile.photos[0].value
        }

        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            }
            else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (error) {
            console.log(error);
        }
    }


));


//Google Login Route
route.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

//Retrieve User data    
route.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-fail', successRedirect: '/dashboard' }),
);

//Logout
route.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.send("Error Logging Out");
        }
        else {
            req.session = null;
            res.redirect('/');
        }
    })
})

//Route if something goes wrong
route.get("/login-fail", async (req, res) => {
    res.render('loginFail');
})

//Presist user data after successfull authentication
passport.serializeUser((user, done) => {
    done(null, user.id);
})

//Retrive user data from session
passport.deserializeUser(async (id, done) => {
    await User.findById(id).then((foundUser) => {
        done(null, foundUser);
    })
})

module.exports = route;