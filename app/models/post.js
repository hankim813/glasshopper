var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

var postSchema  = new Schema({
  _user         : { type: Schema.Types.ObjectId, ref: 'User'},
  _bar          : { type: Schema.Types.ObjectId, ref: 'Bar'},
  content       : String,
  author      : String
});

// the timestamps module gives us createdAt and updateAt
postSchema.plugin(timestamps);

module.exports = mongoose.model('Post', postSchema);