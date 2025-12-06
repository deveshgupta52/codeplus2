
const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  isGlobal: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: function() {
      return this.isGlobal;
    }
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Discussion', discussionSchema);
