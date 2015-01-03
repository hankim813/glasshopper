var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var reviewSchema    = new Schema({
  _author    : { type: Schema.Types.ObjectId, ref: 'User'},
  _bar       : { type: Schema.Types.ObjectId, ref: 'Bar'},
  crowdLevel : { type: Number, min: 1, max: 4, required: true },
  noiseLevel : { type: Number, min: 1, max: 4, required: true },
  avgAge     : { type: Number, min: 1, max: 4, required: true },
  ggRatio    : { type: Number, min: 0, max: 100, required: true },
  createdAt  : { type: Date, default: Date.now, expires: '30m'}
});


module.exports = mongoose.model('Review', reviewSchema);