const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  options: [
    {
      optionText: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  targetLocation: {
    type: String,
    required: true,
  },
  voters: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('poll', PollSchema);
