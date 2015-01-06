var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

var postSchema  = new Schema({
  _user         : { type: Schema.Types.ObjectId, ref: 'User', required: true},
  _bar          : { type: Schema.Types.ObjectId, ref: 'Bar', required: true},
  content       : { type: String, required: true},
  author        : String,
  points					: { type: Number, default: 0}
});


postSchema.methods.upvote = function() {
	this.points = (this.points + 1);
};

postSchema.methods.downvote = function() {
	this.points = (this.points - 1);
};


// the timestamps module gives us createdAt and updateAt
postSchema.plugin(timestamps);

module.exports = mongoose.model('Post', postSchema);