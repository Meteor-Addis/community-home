
Meteor.publish("topics", function () {
	return Topics.find({}, {sort: {votes: -1}});
});

Meteor.publish("topicVotes", function () {
	return TopicVotes.find({});
});