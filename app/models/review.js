var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var reviewSchema    = new Schema({
  _author    : { type: Schema.Types.ObjectId, ref: 'User', required: true},
  _bar       : { type: Schema.Types.ObjectId, ref: 'Bar', required: true},
  crowdLevel : { type: Number, min: 1, max: 4, required: true },
  noiseLevel : { type: Number, min: 1, max: 4, required: true },
  avgAge     : { type: Number, min: 1, max: 4, required: true },
  ggRatio    : { type: Number, min: 0, max: 100, required: true },
  createdAt  : { type: Date, default: Date.now, expires: '30m'}
});

reviewSchema.post('save', function (review) {
  // review.constructor.getReviewsAvg(review);
});

reviewSchema.statics.getReviewsAvg = function(review) {
  return this.aggregate([
    { $match: { _bar: review._bar } },
      { $group: {
          _id       : "$_bar",
          AvgAge    : { $avg: '$avgAge'},
          CrowdLevel: { $avg: '$crowdLevel'},
          NoiseLevel: { $avg: '$noiseLevel'},
          GgRatio   : { $avg: '$ggRatio'},
          reviewsCount: { $sum: 1 }
      }}
  ], function (err, results) {
      if (err) {
        return err;
      } else {
        return results;
      }
  });
}

module.exports = mongoose.model('Review', reviewSchema);