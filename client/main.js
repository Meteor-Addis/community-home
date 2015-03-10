Users = Meteor.users;

// Client Logic

if (Meteor.isClient) {
	Meteor.subscribe("users");

	Template.members.helpers({
		allUsers: function () {
			return Users.find({}, {sort: {"profile.name": 1}});
		},
		facebookProfile: function () {
			return this.services.facebook.id;
		},
		githubProfile: function () {
			return this.profile.html_url;
		},
		meetupProfile: function () {
			return this.profile.link;
		}
	});

	Template.footer.helpers({
		now: function() {
			new Date();
		}
	});

	Template.settings.events({
		"click .deleteAccount": function (event) {
			event.preventDefault();

			var id = Meteor.userId();

			Meteor.call('deleteUser', id);

			Router.go('/index');

		}
	});

	Template.login.events({
		"click #facebook-login": function (event) {
			Meteor.loginWithFacebook({}, function (err) {
				if (err) {
					throw new Meteor.Error("Facebook login failed");
				}
			});
		},

		"click #github-login": function (event) {
			Meteor.loginWithGithub({
					requestPermissions: ['user', 'public_repo']
				},
				function (err) {
					if (err) {
						throw new Meteor.Error("Github login failed");
					}
				});
		},

		"click #meetup-login": function (event) {
			Meteor.loginWithMeetup({}, function (err) {
				if (err) {
					console.log(err);
					throw new Meteor.Error("Meetup login failed");
				}
			});
		},

		"click #sign-in": function (event, template) {
			event.preventDefault();

			var email = template.find('.email-input').value;
			var password = template.find('.password-input').value;

			Meteor.loginWithPassword(email, password, function (err) {
				if (err) {
					throw new Meteor.Error("Password login failed");
				}
			});

			return false;
		},

		"click #register": function (event) {
			event.preventDefault();

			$('.sign-in-form').css('display', 'none');
			$('.registration-form').css('display', 'block');

			return false;
		},

		"click #cancel-register": function (event) {
			event.preventDefault();

			$('.registration-form').css('display', 'none');
			$('.sign-in-form').css('display', 'block');

			return false;
		},

		'click #create-user': function (event, template) {
			event.preventDefault();

			var first = template.find('.fName-input').value;
			var last = template.find('.lName-input').value;
			var fullName = first.concat(" ", last);
			var email = template.find('#registrationEmail').value;
			var password = template.find('#registrationPassword').value;


			Accounts.createUser({email: email, password: password, profile: {name: fullName}}, function (err) {
				if (err) {
					throw new Meteor.Error("Registration failed");
				}

			});
		},

		"click .changePassword": function (event, template) {
			event.preventDefault();

			$('.dropdown-menu').css('width', '300px');
			$('#myProfile').css('display', 'none');
			$('#changePassword').css('display', 'none');
			$('#logout').css('display', 'none');
			$('#changePasswordSection').css('display', 'block');

			return false;
		},

		"click #submit-change": function (event, template) {
			event.preventDefault();

			var oldPassword = template.find('.old-password').value;
			var newPassword = template.find('.new-password').value;
			var confirmPassword = template.find('.confirm-password').value;

			if (newPassword === confirmPassword) {
				Accounts.changePassword(oldPassword, newPassword, function (err) {
					if (err) {
						alert(err.reason);
						throw new Meteor.Error("Password change failed");
					}
					else {
						alert("Password changed!");
						$('.dropdown-menu').css('width', 'auto');
						$('#myProfile').css('display', 'block');
						$('#changePassword').css('display', 'block');
						$('#logout').css('display', 'block');
						$('#changePasswordSection').css('display', 'none');
					}
				});
			}
			else {
				alert("Passwords don't match");
			}

			return false;
		},

		"click #cancel-change": function (event) {
			event.preventDefault();

			$('.dropdown-menu').css('width', 'auto');
			$('#myProfile').css('display', 'block');
			$('#changePassword').css('display', 'block');
			$('#logout').css('display', 'block');
			$('#changePasswordSection').css('display', 'none');

			return false;
		},

		"click .deleteAccount": function (event) {
			event.preventDefault();

			var id = Meteor.userId();

			Meteor.call('deleteUser', id);
			Router.go('/index');

		},

		"click .form-control": function (event) {
			event.preventDefault();
			return false;
		},

		"click .logout": function (event) {
			Meteor.logout(function (err) {
				if (err) {
					throw new Meteor.Error("Logout failed");
				}
			})
		}
	});
}

var DateFormats = {
	short: "MMMM DD, YYYY",
	long: "dddd DD MMM YYYY - HH:mm A",
	year: "YYYY",
	weekDay: "dddd",
	day: "DD",
	month: "MMMM"
};

function nthDay(d) {
	if(d>3 && d<21) return 'th';
 switch (d % 10) {
       case 1:  return "st";
       case 2:  return "nd";
       case 3:  return "rd";
       default: return "th";
   }
}

UI.registerHelper("peopleOrPerson", function (count) {

	if (count == 1) {
		return "person is";
	} else {
		return "people are";
	}
});

UI.registerHelper("formatDate", function (datetime, format) {

	if (moment) {
		f = DateFormats[format];
		return moment(datetime).format(f);
	}

	else {
		return datetime;
	}
});

UI.registerHelper("formatTime", function (time, format) {
	if (moment) {
		f = DateFormats[format];
		return moment(datetime).format(f);
	}
	else {
		return datetime;
	}
});

UI.registerHelper('activeIfCurrent', function (page) {
	if (Router.current().route.getName() == page) {
		return "active";
	}
	return "";
});