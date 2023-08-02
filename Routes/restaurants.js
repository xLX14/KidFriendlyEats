const express = require('express')
const router = express.Router()
const catchAsync = require('../utilites/catcAsync')
const { isLoggedIn, isAuthor, validateRestaurants } = require('../middleawre')
const restaurants = require('../controllers/restaurants')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(restaurants.index))
    .post(isLoggedIn, upload.array('image'), validateRestaurants, catchAsync(restaurants.createRestaurants))

router.get('/new', isLoggedIn, restaurants.renderNewForm)

router.route('/:id')
    .get(catchAsync(restaurants.showRestaurant))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateRestaurants, catchAsync(restaurants.updateRestaurant))
    .delete(isLoggedIn, isAuthor, catchAsync(restaurants.deleteRestaurant))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurants.renderEditForm))


module.exports = router;