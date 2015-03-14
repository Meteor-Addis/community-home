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

        // Collect data from form
        var first = template.find('.fName-input').value;
        var last = template.find('.lName-input').value;
        var fullName = first.concat(" ", last);
        var email = template.find('#registrationEmail').value;
        var password = template.find('#registrationPassword').value;

        // Check if users already exists
        if ( Users.findOne({'profile.email': email}) ) {
            alert("User already exists");
            throw new Meteor.Error("User already exists!");
        }

        // Create the user
        Accounts.createUser({email: email, password: password, profile: {name: fullName}}, function (err) {
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

        Router.go('/');

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
});