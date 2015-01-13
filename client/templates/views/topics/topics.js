Meteor.subscribe("topics");
Meteor.subscribe("topicVotes");

Template.topics.events({
	"submit .new-topic": function (evt, tmpl) {
		var topic_title = tmpl.$('#title').val();
		var	topic_description = tmpl.$('#description').val();

		var topic_param = {
			title: topic_title,
			description: topic_description
		};

		Meteor.call("addNewTopic", topic_param, function(error, result) {
			if(error) {
				return alert(error.reason);
			}
			if(result) {
				tmpl.$('#title').val('');
				tmpl.$('#description').val('');
			}
		});
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