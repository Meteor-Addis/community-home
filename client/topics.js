
Topics = new Mongo.Collection("topics");
TopicVotes = new Mongo.Collection("topicVotes");

if (Meteor.isClient) {
	Meteor.subscribe("topics");
	Meteor.subscribe("topicVotes");

	Template.topics.events({
		"submit .new-topic": function (event) {
			var title = event.target.title.value;
			var description = event.target.description.value;

			Meteor.call("addTopic", title, description);

			return false;
		},

		"click .topic-vote-btn": function () {

			if (Meteor.userId() != this.owner) {
				if (TopicVotes.find({voter: Meteor.userId(), topic: this._id}).count() > 0) {

					Meteor.call("removeVoteForTopic", this._id);
				} else {

					Meteor.call("voteForTopic", this._id);
				}
			}
		},

		"click .topic-delete-btn": function () {

			Meteor.call("deleteTopic", this._id);
		}
	});

	Template.topics.helpers({
   topics: function () {
	   return Topics.find({}, {sort: {votes: -1}});
   },

   isOwner: function () {
     return this.owner === Meteor.userId();
   },

   hasVoted: function () {
     var r = TopicVotes.find({voter: Meteor.userId(), topic: this._id}).count() != 0;
	   console.log("false: " + r);

	   return r;
   }
 });
}