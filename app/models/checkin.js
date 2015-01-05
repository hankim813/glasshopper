var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

var checkinSchema    = new Schema({
  _user         : { type: Schema.Types.ObjectId, ref: 'User'},
  _bar          : { type: Schema.Types.ObjectId, ref: 'Bar'},
});

checkinSchema.plugin(timestamps);

module.exports = mongoose.model('Checkin', checkinSchema);
