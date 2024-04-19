const mongoose = require('mongoose');
const genres = require('../utils/genres');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author"
      },
    publishDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["public", "draft"],
    },
    type: {
        type: String,
        required: true
    },
    genres: {
        type: [String],
        required: true,
        enum: genres
    },
    cast: [
        {
            author: mongoose.Schema.Types.ObjectId, ref: "Author",
            roleAs: String,
            leadAuthor: Boolean,
        }
    ],
    writers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author"
        }
    ],
    thumbnail: {
        type: Object,
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        required: true
    },
    pdf: {
        type: Object,
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
},
    { timestamps: true }
)

module.exports = mongoose.model("Blog", blogSchema);