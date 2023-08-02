
const mongoose = require('mongoose');
const Restaurant = require('../model/restaurants')
const path = require('path');
const restaurantsWithImage = require('./restaurants');


main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/kidFriendlyEats');
    console.log("DB connected");
}

const seedDB = async () => {
    await Restaurant.deleteMany({})
    for (const restaurant of restaurantsWithImage) {
        const restaurantInfo = new Restaurant(restaurant)
        try {
            await restaurantInfo.save()

        } catch (error) {
            console.log(error);
        }
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})



