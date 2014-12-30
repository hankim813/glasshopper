var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

var photoSchema  = new Schema({
  _user          : { type: Schema.Types.ObjectId, ref: 'User'},
  _bar           : { type: Schema.Types.ObjectId, ref: 'Bar'},
  urlSrc         : String,
  caption        : String
});

// the timestamps module gives us createdAt and updateAt
photoSchema.plugin(timestamps);

module.exports = mongoose.model('Photo', photoSchema);