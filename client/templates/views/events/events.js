
if (Meteor.isClient) {
	Meteor.subscribe("events");
	Meteor.subscribe("eventRsvps");

	Template.events.events({
		"submit .new-event": function (event) {
			var t = event.target;

			var title = t.title.value;
			var description = t.description.value;

			var year = t.year.value;
			var month = t.month.value;
			var day = t.day.value;
			var hour = t.hour.value;
			var minute = t.minute.value;
			var ampm = t.ampm.value;

			var date = year + "-" + month + "-" + day + " " + hour + ":" + minute + " " + ampm;
			var datetime = Date.parse(date);

			if (
				title == "" || description == "" || year == "" || month == "" || day == "" ||
				hour == "" || minute == "" || ampm == ""
			) {

				alert("The form contains invalid values!");

				return false;
			}

			Meteor.call("addEvent", title, description, datetime);

			// reset the form
			$('.new-event')[0].reset();

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

	Template.viewEvent.helpers({

	   attendees: function () {
		   var x = EventRsvps.find({event: this._id});

		 return x;
   }
 	});

	Template.home.helpers({
	   events: function () {
		   return Events.find({date: {$gt: new Date().getTime()}}, {sort: {date: 1}, limit: 3});
	   }
 	});
}