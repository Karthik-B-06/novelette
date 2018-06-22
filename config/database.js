if(process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://novelette-user:Hello,World@1@ds215961.mlab.com:15961/novelette-prod'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://127.0.0.1:27017/novelette-app'
  }
}