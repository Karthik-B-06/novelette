const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StorySchema = new Schema({
  title:  {
    type: String,
    required: true },

  author: {
      type: String,
      required: true },
    user :{
        type: String,
        required: true
    },
  story:   {
      type: String,
      required: true },

  comments: [{ body: String, date: Date }],
    
  date: { type: Date, default: Date.now },
    
  hidden: Boolean,
    
  meta: {
      votes: { type: Number, default: 0} 
    }
});

mongoose.model('stories', StorySchema);