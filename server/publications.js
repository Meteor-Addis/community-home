/**
 * Created by Hilawi on 1/12/15.
 */

Meteor.publish("topics", function () {
    return Topics.find({}, {sort: {votes: -1}});
});


Meteor.publish("topic-votes", function () {
    return TopicVotes.find();
});


Meteor.publish("users", function() {
    return Meteor.users.find({}, {fields: {profile: 1} });
});