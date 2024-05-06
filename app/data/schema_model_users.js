const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type : String, 
    unique : true,
    required : true,
    lowercase : true
  },
  password: {
    type : String,
    required: true
  },
  name: {
    type: String,
    required: true 
  },
  surname: String
});

userSchema.statics.findByEmail =  async function(email) {
  const user = await this.findOne({
      email: {$eq:email}
  })
  return user;
};

userSchema.statics.findById =  async function(id) {
  const user = await this.findOne({
      _id: {$eq:id}
  })
  return user;
};

const Users = mongoose.model('users', userSchema);

module.exports = Users;
