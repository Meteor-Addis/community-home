
if (Meteor.isClient) {
	Meteor.subscribe("events");
	Meteor.subscribe("eventRsvps");

	Template.events.events({
		"submit .new-event": function (event) {
			var title = event.target.title.value;
			var description = event.target.description.value;
			var date = new Date(event.target.date.value + " " + event.target.time.value).getTime();


			Meteor.call("addEvent", title, description, date);

			return false;
		},

		"click .event-delete-btn": function () {

			// todo: delete event
		},

		"click .event-edit-btn": function () {

			// todo: edit the event
		},

		"click .new-event-form-switch": function () {
			$('.new-event').slideToggle()
		},

		"click .event-presented-btn": function () {

			Meteor.call("setEventPresented", this._id, true);
		},

		"click .event-not-presented-btn": function () {

			Meteor.call("setEventPresented", this._id, false);
		},

		"click .event-rsvp-btn": function () {

			if (EventRsvps.find({user: Meteor.userId(), event: this._id}).count() > 0) {

				Meteor.call("removeEventRsvp", this._id);
			} else {
				console.log("this._id", this._id);

				Meteor.call("rsvpEvent", this._id);
			}
		}
	});


	Template.events.helpers({
   events: function () {
	   return Events.find({presented: {$ne: true}}, {sort: {createdAt: -1}});
   },

   suggested: function () {
	   return Events.find({}, {sort: {createdAt: -1}});
   }
 });

	Template.home.helpers({
   events: function () {
	   return Events.find({}, {sort: {createdAt: -1}, limit: 3});
   },

		getName: function () {
			var user = Users.findOne(this.owner);

			return user.profile.name;
		}
 });

	Template.event.helpers({

   isOwner: function () {
     return this.owner === Meteor.userId();
   },

		getName: function () {
			var user = Users.findOne(this.owner);

			return user.profile.name;
		},

   hasRsvpd: function () {

	   return EventRsvps.find({user: Meteor.userId(), event: this._id}).count() > 0;
   },

   someRsvps: function () {

	   return EventRsvps.find({event: this._id}).count() > 0;
   }
 });
}