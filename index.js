require('dotenv').config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');


const connectDB = require('./server/config/db');
const notesRoute = require("./server/routes/notesRoute");
const dashboardRoute = require("./server/routes/dashboardRoute");
const authRoute = require('./server/routes/authRoute');

const app = express();
const port = process.env.PORT || 5000

app.use(session({
    secret: 'One Piece is Best',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO
    }),
    unset: 'destroy'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

//static file
app.use(express.static('public'));

//Connection to DB
connectDB()

//Template Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//Routes
app.use('/', authRoute);
app.use('/', notesRoute);
app.use('/', dashboardRoute);


//Handle 404 Error
app.get('*', (req, res) => {
    res.status(404).render("404");
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})