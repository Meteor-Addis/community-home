
if (Meteor.isClient) {
	Meteor.subscribe("topics");
	Meteor.subscribe("topicVotes");

	Template.topics.events({
		"submit .new-topic": function (event) {
			var title = event.target.title.value;
			var description = event.target.description.value;

			if (title == "" || description == "") {
				alert("The form contains invalid values!");

				return false;
			}

			Meteor.call("addTopic", title, description);

			// reset the form
			event.target.text.value = "";
			event.target.description.value = "";

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
		},

		"click .topic-edit-btn": function () {

			// todo: edit the topic
		},

		"click .new-topic-form-switch": function () {
			$('.new-topic').slideToggle()
		},

		"click .topic-presented-btn": function () {

			Meteor.call("setTopicPresented", this._id, true);
		},

		"click .topic-not-presented-btn": function () {

			Meteor.call("setTopicPresented", this._id, false);
		}
	});


	Template.topics.helpers({
	   topics: function () {
		   return Topics.find({presented: {$ne: true}}, {sort: {votes: -1, createdAt: -1}});
	   },

	   suggested: function () {
		   return Topics.find({}, {sort: {votes: -1, createdAt: -1}});
	   },

	   presented: function () {
		   return Topics.find({presented: {$ne: false}}, {sort: {votes: -1, createdAt: -1}});
	   },

		noSuggested: function () {
			return Topics.find({}, {sort: {votes: -1}}).count() == 0;
		},

		noPresented: function () {
			return Topics.find({presented: {$ne: false}}, {sort: {votes: -1, createdAt: -1}}).count() == 0;
		}
 });

	Template.home.helpers({
   topics: function () {
	   return Topics.find({}, {sort: {votes: -1, createdAt: -1}, limit: 3});
   },

		getName: function () {
			var user = Users.findOne(this.owner);

			return user.profile.name;
		}
 });

	Template.topic.helpers({

   isOwner: function () {
     return this.owner === Meteor.userId();
   },

		getName: function () {
			var user = Users.findOne(this.owner);

			return user.profile.name;
		},

   hasVoted: function () {
     var r = TopicVotes.find({voter: Meteor.userId(), topic: this._id}).count() > 0;

	   return r;
   }
 });
}