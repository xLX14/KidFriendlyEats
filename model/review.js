const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Restaurant = require('./restaurants')

const reviewSchema = new Schema({
    body: String,
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review