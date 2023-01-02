const { Thought, User } = require('../models');

const thoughtController = {

    createThought({ params, body}, res) {
        console.log(body);
        Thought.create(body)
            .then((body) => {
              console.log('here');
              console.log(body);
                return User.findOneAndUpdate(
                    { _id: body.userId},
                    { $push: { thoughts: body._id } },
                    { new: true }
                );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                  res.status(404).json({ message: 'could not find Thought with this id!' });
                  return;
                }
                console.log(dbThoughtData);
                res.json(dbThoughtData);
              })
              .catch(err => res.json(err));
    },

    getAllThoughts(req, res) {
      Thought.find({})
          .populate({
              path: 'reactions',
              select: '-__v'
          })
          .select('-__v')
          .sort({ _id: -1 })
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
          console.log(err);
          res.sendStatus(400);
    });
  },
  
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body} },
        { new: true, runValidators: true}
    )
    .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'could not find Thought with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
},

    removeReaction({ params }, res ) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: {_id: params.reactionId} } },
            { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    },

    removeThought({ params, body }, res ) {
      Thought.findOneAndDelete({ _id: params.thoughtId})
      .then(deletedReaction => {
          if (!deletedReaction) {
            return res.status(404).json({ message: 'could not find Reaction with this id!' });
          }
          return User.findOneAndUpdate(
              { _id: body.userId },
              { $pull: { thoughts: params.thoughtId } },
              { new: true }
          );
  })
  .then(res.json({message: 'Thought succesfully deleted!'}))
    .catch(err => res.json(err));
  },
};

module.exports = thoughtController;