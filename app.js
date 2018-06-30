const flash = require("connect-flash");
const session = require("express-session");
const path = require('path')
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const app = express();

const {ensureAuthenticated} = require('./helper/auth');

// DB Config
const db = require('./config/database');
config = {
PORT: process.env.PORT || 5000,
MONGODB: db.mongoURI,
}

// For getting all stories
require('./models/Story');
const Story = mongoose.model('stories');


// Load Routes
const stories = require('./routers/stories');
const users = require('./routers/users');

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to mongoose
mongoose.connect(config.MONGODB).then(
  function success() {
    console.log('Database connection success');
    app.listen(config.PORT, function () {
      console.log('Server is running at PORT ' + config.PORT.toString());
    });
  },
  function error(error) {
    console.log('Database connection failed'); 
    console.log(error);
    process.exit(-1);
  }
);


// Using Method Override
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// FLash Middleware
app.use(flash());

// Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/stories', stories);
app.use('/users', users);


// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// For Home Page
app.get('/home',ensureAuthenticated, (req, res) => {
  const title = "Stories";
  Story.find()
    .sort({date: 'desc'})
    .then(stories => {    
        res.render('homepage',{
          stories: stories,
          title: title
        });
    });
});


//For Index Page
app.get('/', (req, res) => {
    const title = "Welcome";
    res.render('index', {
      title: title
    });
});

// For About Page
app.get('/about', (req, res) => {
  const title = "About";
  res.render('about', {
    title: title
  });
})


