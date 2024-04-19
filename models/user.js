const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: true
    },
    email : {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    mobile : {
        type: Number,
        trim: true,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['admin', 'user']
    },
    isVerified : {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt : {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt : {
        type: Date,
        required: true,
        default: Date.now()
    }
})

userSchema.pre('save',  async function (next) {
    try{
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    }catch(err){
        next(err);
    }
})

userSchema.methods.comparePassword = async function (password) {
    try{
        const result = await bcrypt.compare(password, this.password);
        return result;
    }catch(err){
        throw err;
    }
}



module.exports = mongoose.model('User', userSchema);