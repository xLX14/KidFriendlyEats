if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()

}

console.log(process.env.SECRET)
console.log(process.env.API_KEY)

const express = require('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const Joi = require('joi');
const { restaurantSchema, reviewSchema } = require('./schemas')
var methodOverride = require('method-override')
const ExpreesError = require('./utilites/ExpreesError')
const Restaurant = require('./model/restaurants');
const Review = require("./model/review")
const User = require('./model/user')
const helmet = require('helmet')


const restaurantsRoutes = require('./Routes/restaurants')
const reviewsRoutes = require('./Routes/reviews')
const usersRoutes = require('./Routes/user')




const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://fastly.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://fastly.jsdelivr.net",

];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/de88k3zcr/",
                "https://images.unsplash.com/",
                "https://media.gettyimages.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



const passport = require('passport');
const LocalStrategy = require('passport-local');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/kidFriendlyEats'

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
})


main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log("DB connected");
}
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true })) //to acess the req.body
app.use(methodOverride('_method'))
app.use(mongoSanitize());


const sessionConfig = {
    store,
    name: 'notSession',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,  Only in production
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(
    helmet({ contentSecurityPolicy: false })
);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// _________________________________________________________________________
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use("/", usersRoutes)
app.use('/restaurants', restaurantsRoutes)
app.use('/restaurants/:id/reviews', reviewsRoutes)


app.get('/', (req, res) => {
    res.render('home');
});


app.all('*', (req, res, next) => {
    next(new ExpreesError('Page Not Found', 404))
})





app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) { err.message = "Somthing went wrong..." }
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log(`Listening on port 3000`)
})