const mongoose = require('mongoose');
const Review =  require('./review')


const homeSchema  = new mongoose.Schema(
    {
    bodycontent : {
        type : String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ]

}
);

const Home = mongoose.model('home', homeSchema);

module.exports = Home;
