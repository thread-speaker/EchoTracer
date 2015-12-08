// setup Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var findOrCreate = require('mongoose-findorcreate')

var User = require('./user.js');

// Profile schema
var profileSchema = new Schema({
  user: {type: ObjectId, ref: 'users'},
  caches : [{ lat : String, lon : String, nickname: String, placed : {type: Date, default: Date.now} }],
  tags : [{ tag: String, message: String }],
  joined: {type: Date, default: Date.now},
  lastActivity: {type: Date, default: Date.now},
});

// ensure schemas use virtual IDs
profileSchema.set('toJSON', {
  virtuals: true
});

// add findorCreate
profileSchema.plugin(findOrCreate);

// create profile
var Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;
