db.getSiblingDB('mongoose-app')

db.createUser({
  user: "username",
  pwd: "password",
  roles: [{
    role: "readWrite",
    db: "mongoose-app"
  }]
})