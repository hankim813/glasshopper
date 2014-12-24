var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

var BarSchema    = new Schema({
  name    : String,
  address : String,
  photoUrl: String,
  avgPrice: { type: Number, min: 1, max: 5 },
  location: { type: [Number], index: '2dsphere'}
  // happyHour: same as opening_hours
  // currentEvents: "Whatever"
  // "opening_hours" : {
  //  "open_now" : true,
  //  "periods" : [
  //     {
  //        "close" : {
  //           "day" : 1,
  //           "time" : "0000"
  //        },
  //        "open" : {
  //           "day" : 0,
  //           "time" : "1200"
  //        }
  //     },
});

// the timestamps module gives us createdAt and updateAt
BarSchema.plugin(timestamps);

module.exports = mongoose.model('Bar', BarSchema);