var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

var crawlSchema  = new Schema({
  _leader        : { type: Schema.Types.ObjectId, ref: 'User'},
  _participants  : [{ type: Schema.Types.ObjectId, ref: 'User'}],
  _bars          : [{ type: Schema.Types.ObjectId, ref: 'Bar'}],
  _photos        : [{ type: Schema.Types.ObjectId, ref: 'Photo'}]
});

// the timestamps module gives us createdAt and updateAt
crawlSchema.plugin(timestamps);

module.exports = mongoose.model('Crawl', crawlSchema);