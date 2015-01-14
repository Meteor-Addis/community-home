Meteor.methods({

	addEvent: function (title, description, date) {

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Events.insert({
			title: title,
			description: description,
			createdAt: new Date(),
			rsvps: 0,
			date: date,
			owner: Meteor.userId()
		});
	},

	deleteEvent: function (eventId) {

		// todo: delete event
	},

	rsvpEvent: function (eventId) {

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		EventRsvps.insert({
			user: Meteor.userId(),
			event: eventId,
			createdAt: new Date()
		});

		Events.update(eventId, {$set: {rsvps: EventRsvps.find({event: eventId}).count()}});
	},

	removeEventRsvp: function (eventId) {

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		EventRsvps.remove({user: Meteor.userId(), event: eventId});

		Events.update(eventId, {$set: {rsvps: TopicVotes.find({event: eventId}).count()}});
	}
});