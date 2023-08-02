const Restaurant = require('../model/restaurants');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })



module.exports.index = async (req, res) => {
    const restaurants = await Restaurant.find({})
    res.render('restaurants/index', { restaurants })
}

module.exports.renderNewForm = (req, res) => {
    res.render('restaurants/new')

}

module.exports.createRestaurants = async (req, res) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.restaurant.location,
        limit: 1
    }).send()

    const newRestaurant = Restaurant(req.body.restaurant)
    newRestaurant.geometry = geoData.body.features[0].geometry
    newRestaurant.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newRestaurant.author = req.user._id
    await newRestaurant.save()
    req.flash('success', "Successfully Added A New KidFriendlyRestaurant!")
    res.redirect(`/restaurants/${newRestaurant.id}`)
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id)
    if (!restaurant) {
        req.flash('error', 'Cannont find that restaurant!')
        return res.redirect('/restaurants')
    }

    res.render(`restaurants/edit`, { restaurant })
}

module.exports.updateRestaurant = async (req, res) => {
    const { id } = req.params
    console.log(req.body);
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, req.body.restaurant)
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    updatedRestaurant.image.push(...images)
    await updatedRestaurant.save()

    if (req.body.deleteImages) {
        for (const filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await updatedRestaurant.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }

    if (!updatedRestaurant) {
        req.flash('error', 'Cannont find that restaurant!')
        return res.redirect('/restaurants')
    }
    req.flash('success', "Successfully Updated Your KidFriendlyRestaurant!")
    res.redirect(`/restaurants/${updatedRestaurant.id}`)

}

module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id)
    if (!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'you do not have the permission to do that.')
        return res.redirect(`/restaurants/${id}`)
    }
    await Restaurant.findByIdAndDelete(id)
    req.flash('success', "Successfully Deleted Your KidFriendlyRestaurant.")
    res.redirect('/restaurants')
}

module.exports.showRestaurant = async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author')
        .populate('geometry.coordinates')
    if (!restaurant) {
        req.flash('error', 'Cannont find that restaurant!')
        return res.redirect('/restaurants')
    }
    res.render('restaurants/show', { restaurant })
}