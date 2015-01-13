Meteor.methods({
	deleteUser: function (id) {
		if (Meteor.userId() == id) {
			// delete associated topics
			Topics.remove({owner: id});

			TopicVotes.remove({voter: id});

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
			votes: 0,
			presented: false
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
	},

	setTopicPresented: function (topicId, presented) {

		var topic = Topics.findOne(topicId);

		if (!Meteor.userId() || Meteor.userId() !== topic.owner) {
			throw new Meteor.Error("not-authorized");
	}

		Topics.update(topicId, {$set: {presented: presented}});
	}
});