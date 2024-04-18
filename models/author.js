const mongoose = require("mongoose");

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    about: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    avatar: {
        type: Object,
        url: String,
        public_id: String,
    },
},
    { timestamps: true }
)

authorSchema.index({name: 'text'})

module.exports = mongoose.model('Author', authorSchema)