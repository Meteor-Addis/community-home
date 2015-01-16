
Meteor.publish("events", function () {
	return Events.find({}, {sort: {createdAt: -1}});
});

Meteor.publish("eventRsvps", function () {
	return EventRsvps.find({}, {sort: {createdAt: -1}});
});

Meteor.publish('getRsvpr', function(userId) {
  return Meteor.users.findOne(userId);
});