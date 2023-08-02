const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utilites/catcAsync')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleawre')
const reviews = require('../controllers/reviews')



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview)


module.exports = router;