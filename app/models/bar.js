var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BarSchema   = new Schema({
  name: String,
  loc: { type: [Number], index: '2dsphere'}
});

module.exports = mongoose.model('Bar', BarSchema);