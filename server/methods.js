Topics = new Mongo.Collection("topics");
TopicVotes = new Mongo.Collection("topicVotes");

Meteor.methods({
	deleteUser: function (id) {
		if (Meteor.userId() == id) {
			Meteor.users.remove({_id: id});
			return true;
		}

		else {
			return "Account delete failed";
		}
	},

	addTopic: function (title, description) {

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Topics.insert({
			title: title,
			description: description,
			createdAt: new Date(),
			owner: Meteor.userId(),
			name: Meteor.user().name,
			votes: 0
		});
	},

	voteForTopic: function (topicId) {

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		TopicVotes.insert({
			voter: Meteor.userId(),
			topic: topicId,
			createdAt: new Date()
		});

		Topics.update(topicId, {$set: {votes: TopicVotes.find({topic: topicId}).count()}});
	},

	removeVoteForTopic: function (topicId) {

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		TopicVotes.remove({voter: Meteor.userId(), topic: topicId});

		Topics.update(topicId, {$set: {votes: TopicVotes.find({topic: topicId}).count()}});
	},

	deleteTopic: function (topicId) {

		var topic = Topics.findOne(topicId);

		if (!Meteor.userId() || Meteor.userId() !== topic.owner) {
			throw new Meteor.Error("not-authorized");
		}

		Topics.remove(topicId);
	}
});