const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

const userSchema = new Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/,"invalid email"]
      },
      thoughts: [{type: Schema.Types.ObjectId, ref:"thought"}],
      friends: [{type: Schema.Types.ObjectId, ref:"user"}]
    },
    {
      toJSON: {
        virtuals: true,
      },
      id: false
    }
  );
  
  const User = model('user', userSchema);
  
  module.exports = User;
  