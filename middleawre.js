const { restaurantSchema, reviewSchema } = require('./schemas')
const ExpreesError = require('./utilites/ExpreesError')
const Review = require('./model/review')
const Restaurant = require('./model/restaurants')



const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must login.')
        return res.redirect('/login')
    }
    next()
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const validateRestaurants = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpreesError(msg, 400)
    }
    else {
        next();
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id)
    if (!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'you do not have the permission to do that.')
        return res.redirect(`/restaurants/${id}`)
    }
    next()
}


const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not have the permission to do that.')
        return res.redirect(`/restaurants/${id}`)
    }
    next()
}


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpreesError(msg, 400)
    }
    else {
        next();
    }
}

module.exports = { isLoggedIn, storeReturnTo, isAuthor, validateRestaurants, validateReview, isReviewAuthor }