var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');
var bcrypt       = require('bcrypt-nodejs');

var userSchema   = new Schema({
  name             : String,
  local            : {
      email        : { type: String, unique: true },
      password     : String,
  },
  facebook         : {
      id           : String,
      token        : String,
      gender       : String,
      email        : { type: String, index: {unique: true, sparse: true} },
      name         : String
  },
  searchRadius     : { type: Number, max: 20, default: 2 }, 
  profilePhotoUrl  : { type: String, default: 'img/profile.png' }, //points to dummy file on client
  points           : Number
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// the timestamps module gives us createdAt and updateAt
userSchema.plugin(timestamps);

module.exports = mongoose.model('User', userSchema);