const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailVerificationTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    expires: 600,
    default: Date.now(),
  },
});

emailVerificationTokenSchema.pre("save", async function (next) {
    try{
        if(this.isModified('token')){
            this.token = await bcrypt.hash(this.token, 10);
        }
        next();
    }catch(err){
        next(err);
    }
})

emailVerificationTokenSchema.methods.compareToken = async function (token) {
  try{
    const result = await bcrypt.compare(token, this.token);
    return result;
  }catch(err){
    throw err;
  }
}

module.exports = mongoose.model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);
