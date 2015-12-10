
# Geolocation Profiler

GeoProfile is a social networking app designed specifically for information that is specific to your physical location. Looking for some buddies to play soccer with? Go to the nearest park and drop a cache with tag "#Soccer: looking for some buddies to play Saturday mornings 7~10am." You will be able to search other caches nearby that have the "#Soccer" tag registered to their profile. Once we get the messaging server implemented, you could shoot each other anonymous messages to coordinate a game.

Our goal is to build a social networking app that helps people be more physically aware of the people in their close proximity. Independent employment, dating, special interest get-togethers, study buddies, etc. All of these could potentially benefit from a geolocation targeted networking app. 

<img src="https://cloud.githubusercontent.com/assets/7663484/11719796/9bb0b4f0-9f19-11e5-8ce9-e80f18aa02c3.png" style="max-width: 800px" />

## Database Schema
The database contains 2 tables: Users and Profiles.
```
UserSchema = {
  username: {type: String, index: true, unique: true},
  password_hash: String,
};
```
The UserSchema has api for password encryption using SALT and bcypt hashing. On login, the user is given a token for persistent authentication.

```
ProfileSchema = {
  user: {type: ObjectId, ref: 'users'},
  username: String,
  caches : [{ lat : String, lon : String, nickname: String, placed : {type: Date, default: Date.now} }],
  tags : [{ tag: String, message: String }],
  joined: {type: Date, default: Date.now},
  lastActivity: {type: Date, default: Date.now},
};
```
The profile is plain JSON; nothing is encrypted. Caches is an array of size 0-5 that stores geoLocation latitude and longitude strings. The tags array is 0 to many, with each tag containing both a tag name and a required short message for display on other user's search results.


## Future Features
<ul>
  <li>Customizable proximity radius (per tag)</li>
  <li>Anonymous private messaging + Inbox (to contact tagAuthors for detailed communication)</li>
  <li>Responsive design for mobile devices</li>
  <li>Limitations on tag message length (keep things simple and quick)</li>
  <li>Tag suggestions (help user pick a similar tag with more hits)</li>
  <li>Mark search results as old, so they don't show up again in your feed</li>
  <li>Favorite search results</li>
  <li>Tag-combination searches (i.e. Only search people with multiple tags)</li>
  <li>Google maps showing cached locations in user profile</li>
  <li>Facebook/Twitter/Other social media logins + integration</li>
  <li>Means to filter out adult/inappropriate/spam content</li>
  <li>Report users for bad behavior</li>
</ul>

## Setup

GeoProfile is run in node.js; Built using ReactJS components and a MongoDB database.

First install mongodb, node.js, and ReactJS (from node package manager) on your host machine:
<br/>MongoDB: https://docs.mongodb.org/manual/installation/
<br/>Node.js: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server
<br/>Node Package Manager: https://www.npmjs.com/package/npm
<br/>ReactJS: http://reactjs.net/getting-started/download.html

Once all of the above are working, clone the repository. Open a terminal and navigate to the new repository location (i.e. home/360app), then run:

```
npm install
```

```
webpack
```
```
node server.js
```

This will start a server on localhost, which you can visit at http://localhost:3000/. Your database will be empty, since it's being hosted on your machine.
