const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload /w_200')
})
ImageSchema.virtual('show').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_300,w_500')
})


const opts = { toJSON: { virtuals: true } }

const restaurantSchema = new Schema({
    name: String,
    minimumprice: Number,
    image: [ImageSchema],
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: "string"
    ,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.ObjectId,
            ref: "Review"
        }
    ]

}, opts)


restaurantSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/restaurants/${this.id}">${this.name}</a></strong>
     <p>${this.description}</p>`

})



restaurantSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }

        })
    }
})





const Restaurant = mongoose.model("Restaurant", restaurantSchema)


module.exports = Restaurant