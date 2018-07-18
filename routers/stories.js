const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const {ensureAuthenticated} = require('../helper/auth');
const uuidv1 = require('uuid/v1');

module.exports = (router);

//Load Story Model
require('../models/Story');
const Story = mongoose.model('stories');

// Story Index Page
router.get('/', ensureAuthenticated, (req, res)=>{
  Story.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(stories => {    
        res.render('stories/index',{
          stories: stories
        });
    });
});

// Like Story
router.put('/like/:id', (req, res) => {
  console.log(req.param.id)
  Story.findOne({
    _id : req.param.id
  })
  .then(story => {
    console.log(story);
    story.meta.votes++;
    story.save()
      .then(story => {
        req.flash('success_msg', 'Liked');
        res.redirect('/stories');
      });
  })
});
// Unlike Story
router.put('/unlike/:id', (req, res) => {
  Story.findOne({
    _id : req.param.id
  })
  .then(story => {
    story.meta.votes--;
    story.save()
      .then(story => {
        req.flash('success_msg', 'UnLiked');
        res.redirect('/stories');
      });
  })
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});
// Edit Story Form
router.get('/edit/:id', (req, res) => {
  Story.findOne({
    _id : req.params.id
    })
    .then(story => {
      if(story.user != req.user.id) {
        req.flash('error_msg','Not Authorised');
        res.redirect('/stories');
      } else {
        res.render('stories/edit',{
          story: story
        }); 
      }
      
    })
});

// Edit Form Process
router.put('/:id', (req, res)=> {
  Story.findOne
  ({_id : req.params.id})
  .then(story => {
    story.title = req.body.title,
    story.author = req.body.author,
    story.story = req.body.story

    story.save()
      .then(story => {
        req.flash('success_msg', 'Story Updated');
        res.redirect('/stories');
      });
  })
});

// Delete Story
router.delete('/:id', (req, res) => {
  Story.remove({
    _id: req.params.id
  })
  .then(()=>{
    req.flash('success_msg', 'Story Removed');
    res.redirect('/stories');
  })
});



// Process Story Form
router.post('/addStory', ensureAuthenticated, (req, res) => {
  const errors = [];
  if(!req.body.title) 
    errors.push('Please Enter A Title');
  if(!req.body.author) 
    errors.push('Please Enter Author Name');
  if(!req.body.story) 
    errors.push('Please Type in your Story');
  if(errors.length > 0) {
    res.render('stories/add', {
      errors: errors,
      title: req.body.title,
      author: req.body.author,
      story: req.body.story
    });
  }  else {
    const newStory = {
      id: uuidv1(),
      title: req.body.title,
      author: req.body.author,
      story: req.body.story,
      user: req.user._id
    }
    new Story(newStory)
        .save()
        .then(story => {
          req.flash('success_msg', 'Story Added');
          res.redirect('/stories');
        });
  }
  
});