// setup Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var findOrCreate = require('mongoose-findorcreate')

var User = require('./user.js');

// Item schema
var itemSchema = new Schema({
	user: {type: ObjectId, ref: 'users'},
	lat: String,
	lon: String,
	created: {type: Date, default: Date.now},
});

// ensure schemas use virtual IDs
geoSchema.set('toJSON', {
	virtuals: true
});

geoSchema.methods.distanceTo = function(dest) {
	//Add a toRad() method to number types, if none exists
	if (typeof(Number.prototype.toRad) == "undefined") {
		Number.prototype.toRad = function() {
			return this * Math.PI / 180;
		};
	}

	//Haversine formula for finding distance
	var R = 6371000; //mean radius of Earth in meters
	var phi1 = this.lat.toRad();
	var phi2 = dest.lat.toRad();
	var deltaPhi = (dest.lat - this.lat).toRad();
	var deltaLambda = (dest.lon - this.lon).toRad();
	var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
		Math.cos(phi1) * Math.cos(phi2) *
		Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;

	return d;
};

// add findorCreate
geoSchema.plugin(findOrCreate);

// create item (TODO: make table if necessary)
var Geolocation = mongoose.model('geolocation', geoSchema);

module.exports = Geolocation;
