var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var timestamps   = require('mongoose-timestamp');

// setup request module to issue http requests to third party apis
var httpRequest    = require('request');

var barSchema    = new Schema({
  name          : String,
  address       : String,
  photoUrl      : String,
  avgPrice      : { type: Number, min: 1, max: 5 },
  location      : { type: [Number], index: '2dsphere'},
  google        : {
    place_id    : { type: String, index: true },
    price_level : Number,
    rating      : Number,
    reference   : String
  }
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


// class methods ======================

barSchema.statics.fetchBarsFromGoogle = function(latLng, radius) {
  var Bar = this;
  var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+
            (latLng || '37.790523241426946,-122.42061138153076') + '&radius=' +
            (radius || '80') + '&types=bar&key=' + process.env.GOOGLE_API_KEY;
  httpRequest(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var barsArray = JSON.parse(body).results;
      for (var i = barsArray.length - 1; i >= 0; i--) {
        Bar.saveBar(barsArray[i]);
      }
    }
  })
};

barSchema.statics.saveBar = function(googlePlace) {
  var Bar = this;
    Bar.findOne({ 'google.place_id': googlePlace.place_id },
    function(error, bar) {
      if (!bar) {
        var newBar = new Bar();
        newBar.updateFieldsFromGooglePlace(googlePlace);
        newBar.save(function(err) {
          if (err)
            console.log(err);
        });
      }
  });
};

// instance methods ======================

barSchema.methods.updateFieldsFromGooglePlace = function(googlePlace) {
  var location            = googlePlace.geometry.location;
  this.location           = [location.lng, location.lat];
  this.name               = googlePlace.name;
  this.address            = googlePlace.vicinity;
  this.google.place_id    = googlePlace.place_id;
  this.google.rating      = googlePlace.rating;
  this.google.reference   = googlePlace.reference;
  if (googlePlace.price_level)
    this.avgPrice         = googlePlace.price_level;
  if (googlePlace.photos && googlePlace.photos.length > 0)
    this.getPhotoUrlFromGoogleRef(googlePlace.photos[0].photo_reference);
};

barSchema.methods.getPhotoUrlFromGoogleRef = function(photoRef) {
  var bar = this;
  var url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800' +
            '&photoreference=' + photoRef +
            '&key=' + process.env.GOOGLE_API_KEY;
  httpRequest(url, function (error, response, body) {
    if (!error)
      bar.photoUrl = response.request.uri.href;
      bar.save();
  });
};


// the timestamps module gives us createdAt and updateAt
barSchema.plugin(timestamps);

module.exports = mongoose.model('Bar', barSchema);