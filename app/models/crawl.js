var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

var crawlSchema  = new Schema({
  _leader        : { type: Schema.Types.ObjectId, ref: 'User'},
  _checkins      : [{ type: Schema.Types.ObjectId, ref: 'Checkin'}],
  open					 : { type: Boolean, default: true },
  name					 : String
});

// the timestamps module gives us createdAt and updateAt
crawlSchema.plugin(timestamps);

module.exports = mongoose.model('Crawl', crawlSchema);