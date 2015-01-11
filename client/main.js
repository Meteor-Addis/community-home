Users = Meteor.users;

// Routing configurations

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/index.html', function() {
    this.render('home', {
        data: function() { return Users.find();}
    });
});

Router.route('/', function() {
    this.redirect('/index.html');
});

Router.route('/events.html', function() {
    this.render('events', {
        data: function() { return Users.find();}
    });
});

Router.route('/topics.html', function() {
    this.render('topics', {
        data: function() { return Users.find();}
    });
});

Router.route('/blog.html', function() {
    this.render('blog', {
        data: function() { return Users.find();}
    });
});

Router.route('/members.html', function() {
    this.render('members', {
        data: function() { return Users.find({}, {sort: {"profile.name": 1}});},
    });
});

Router.route('/event-detail.html', function() {
    this.render('event-detail', {
        data: function() { return Users.find();}
    });
})

Router.route('user/:_id', function() {
    this.render('profile', {
        data: function() { return Users.findOne({_id: this.params._id});}
    });
});

// Client Logic

if (Meteor.isClient) {
    Meteor.subscribe("users");

    Template.members.helpers({
        allUsers: function() {
            return Users.find({}, {sort: {"profile.name": 1}});
        },
        facebookProfile: function() {
            return this.services.facebook.id;
        },
        githubProfile: function() {
            return this.profile.html_url;
        },
        meetupProfile: function() {
            return this.profile.link;
        }
    });

    Template.login.events({
        "click #facebook-login": function(event) {
            Meteor.loginWithFacebook({}, function(err) {
                if (err) {
                    throw new Meteor.Error("Facebook login failed");
                }
            });
        },

        "click #github-login": function(event) {
            Meteor.loginWithGithub({
                requestPermissions: ['user', 'public_repo']
            },
            function(err) {
                if (err) {
                    throw new Meteor.Error("Github login failed");
                }
            });
        },

        "click #meetup-login": function(event) {
            Meteor.loginWithMeetup({}, function(err) {
                if (err) {
                    console.log(err);
                    throw new Meteor.Error("Meetup login failed");
                }
            });
        },

        "click #signIn": function(event, template) {
            event.preventDefault();

            var email = template.find('.email-input').value;
            var password = template.find('.password-input').value;

            Meteor.loginWithPassword(email, password, function(err) {
                if (err) {
                    throw new Meteor.Error("Password login failed");
                }
            });

            return false;
        },

        "click #register": function(event) {
            event.preventDefault();

            $('.signInForm').css('display', 'none');
            $('.registrationForm').css('display', 'block');

            return false;
        },

        "click #cancelRegister": function(event) {
            event.preventDefault();

            $('.registrationForm').css('display', 'none');
            $('.signInForm').css('display', 'block');

            return false;
        },

        'click #createUser': function(event, template) {
            event.preventDefault();

            var first = template.find('.fName-input').value;
            var last = template.find('.lName-input').value;
            var fullName = first.concat(" ", last);
            var email = template.find('#registrationEmail').value;
            var password = template.find('#registrationPassword').value;


            Accounts.createUser({email: email, password : password, profile: {name: fullName}}, function(err) {
                if (err) {
                    throw new Meteor.Error("Registration failed");
                }

            });
        },

        "click .changePassword": function(event, template) {
            event.preventDefault();

            $('.dropdown-menu').css('width', '300px');
            $('#myProfile').css('display', 'none');
            $('#changePassword').css('display', 'none');
            $('#logout').css('display', 'none');
            $('#changePasswordSection').css('display', 'block');

            return false;
        },

        "click #submit-change": function(event, template) {
            event.preventDefault();

            var oldPassword = template.find('.old-password').value;
            var newPassword = template.find('.new-password').value;
            var confirmPassword = template.find('.confirm-password').value;

            if (newPassword === confirmPassword) {
                Accounts.changePassword(oldPassword, newPassword, function(err) {
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

        "click #cancel-change": function(event) {
            event.preventDefault();

            $('.dropdown-menu').css('width', 'auto');
            $('#myProfile').css('display', 'block');
            $('#changePassword').css('display', 'block');
            $('#logout').css('display', 'block');
            $('#changePasswordSection').css('display', 'none');

            return false;
        },

        "click .deleteAccount": function(event) {
            event.preventDefault();

            var id = Meteor.userId();

            Meteor.call('deleteUser', id);

            Router.go('/index.html');

        },

        "click .form-control": function(event) {
            event.preventDefault();
            return false;
        },

        "click .logout": function(event) {
            Meteor.logout(function(err) {
                if (err) {
                    throw new Meteor.Error("Logout failed");
                }
            })
        }
    })
}

Handlebars.registerHelper('activeIfCurrent', function(page) {
    if (Router.current().route.getName() == page) {
        return "active";
    }
    return "";
});

