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
