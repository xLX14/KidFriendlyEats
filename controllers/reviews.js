const Review = require('../model/review');
const Restaurant = require('../model/restaurants');



module.exports.createReview = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user
    restaurant.reviews.push(review);
    await review.save()
    await restaurant.save()
    req.flash('success', "A New Review Was Added!")
    res.redirect(`/restaurants/${restaurant.id}`)
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully Deleted Your Review.")
    res.redirect(`/restaurants/${id}`);
}