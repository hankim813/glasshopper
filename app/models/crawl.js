var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

var crawlSchema  = new Schema({
  _leader        : { type: Schema.Types.ObjectId, ref: 'User'},
  // _participants  : [{ type: Schema.Types.ObjectId, ref: 'User'}],
  _checkins      : [{ type: Schema.Types.ObjectId, ref: 'Checkin'}],
  // _photos        : [{ type: Schema.Types.ObjectId, ref: 'Photo'}]
  open					 : { type: Boolean, default: true }
});

// the timestamps module gives us createdAt and updateAt
crawlSchema.plugin(timestamps);

module.exports = mongoose.model('Crawl', crawlSchema);