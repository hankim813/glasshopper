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

reviewSchema.post('save', function (review) {
  // review.constructor.getReviewsAvg(review);
});

reviewSchema.statics.getReviewsAvg = function(review) {
  this.aggregate([
      { $match: { _bar: review._bar } },
      { $group: {
          _id       : '$_bar',
          avgAge    : { $avg: '$avgAge'},
          crowdLevel: { $avg: '$crowdLevel'},
          noiseLevel: { $avg: '$noiseLevel'},
          ggRatio   : { $avg: '$ggRatio'},
      }}
  ], function (err, results) {
      if (err) {
        console.error(err);
      } else {
        // I must be missing something, for some reason
        // I was not able to get the return value.
        console.log(results);
        return results;
      }
  });
}

module.exports = mongoose.model('Review', reviewSchema);