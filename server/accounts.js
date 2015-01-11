/**
 * Created by Hilawi on 1/1/15.
 */

Users = Meteor.users;

MEETUP_API_KEY = "78761a1837f20736a037068304565"; // This key is from the account :http://www.meetup.com/members/183336755/
// The key should not be visible once deployed. It'll have to be placed in a file and passed to Meteor upon startup as an environment variable

ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1586727228211595',
    secret: 'd902296d9fb732b9e8d66e71c5595707'
});

ServiceConfiguration.configurations.remove({
    service: "github"
});
ServiceConfiguration.configurations.insert({
    service: "github",
    clientId: "2c6034b39288c9a979af",
    secret: "d482c0f02550cb2b8b0268909721502467dd8466"
});

ServiceConfiguration.configurations.remove({
    service: "meetup"
});
ServiceConfiguration.configurations.insert({
    service: "meetup",
    clientId: "5g5feiednjd9j60oj7saqk2d3c",
    secret: "3q9k06m0sjacm1usq93pp7jrnk"
});

Accounts.onCreateUser(function(options, user) {
    if (user.services) {
        var service = _.keys(user.services)[0];
        if (service == "facebook") {

            // Check if the user's email is not null and if so that it's associated with an existing account
            if (user.services.facebook.email && Users.findOne({'profile.email': user.services.facebook.email})) {

                // THIS METHOD WORKS FOR THE MOST PART. THE ISSUE IS THAT ONCE WE UPDATE EXISTING USER, WE HAVE
                // TO RETURN A USER IN ORDER TO BE LOGGED IN AUTOMATICALLY. HOWEVER, RETURNING EXISTING USER RESULTS
                // IN A DUPLICATE KEY ERROR. WE CAN'T RETURN NEW USER BECAUSE THE WHOLE PURPOSE OF THIS CODE IS AVOIDING
                // CREATING A NEW USER WITH THE SAME EMAIL. ALTERNATIVE IS CREATING A NEW USER WITH PROPERTIES FROM
                // BOTH EXISTING AND NEW USERS AND RETURNING THAT USER AFTER REMOVING THE EXISTING USER. THE ANTICIPATED
                // ISSUE WITH THIS METHOD IS THAT FOR THE SPLIT SECOND BETWEEN REMOVING AND INSERTING, OTHER USERS LOOKING
                // AT THE PROFILE OF THE USER CURRENTLY LOGGING IN COULD SEE AN EMPTY PROFILE BEFORE IT'S REPOPULATED
                // WITH THE NEW DATA. KEEPING THIS CODE HERE TEMPORARILY. WILL WORK ON FIX IF ALTERNATIVE IS WORSE.

                //var existingUser = Users.find({'profile.email': user.services.facebook.email}).fetch()[0];
                //var existingUserId = Users.find({'profile.email': user.services.facebook.email}).fetch()[0]._id;
                //
                //
                //var newServices = Users.findOne({'_id': existingUserId}).profile.services.push("facebook");
                //
                //Users.update({'_id': existingUserId}, {$set: {'profile.services': newServices}});
                //Users.update({'_id': existingUserId}, {$set: {'services.facebook': user.services.facebook}});
                //
                //if (! existingUser.profile.picture) {
                //    Users.update({'_id': existingUserId}, {$set: {'profile.picture': "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large&width=500&height=500"}})
                //}
                //
                //return false;

                var existingUser = Users.findOne({'profile.email': user.services.facebook.email});

                existingUser.profile.services.push("facebook");
                existingUser.services.facebook = user.services.facebook;

                if (! existingUser.profile.picture) {
                    existingUser.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large&width=500&height=500";
                }

                Users.remove({'_id': existingUser._id});

                return existingUser;
            }
            else {
                if (options.profile) {
                    options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large&width=500&height=500";
                    user.profile = options.profile;
                }

                if (user.services.facebook.email) {
                    user.profile.email = user.services.facebook.email;
                }

                user.profile.bio = null;
                user.profile.services = ["facebook"];

                return user;
            }
        }

        if (service == "github") {
            var accessToken = user.services.github.accessToken,
                result,
                profile;

            result = Meteor.http.get('https://api.github.com/user',{
                params : {
                    access_token : accessToken
                },
                headers: {"User-Agent": "Meteor/1.0"}
            });

            if(result.error){
                throw result.error
            }

            profile = _.pick(result.data,
                'login',
                'name',
                'avatar_url',
                'email',
                'bio',
                'html_url'
            );

            if (! profile.name) {
                profile.name = profile.login;
                delete profile.login;
            }
            else {
                delete profile.login;
            }

            profile.picture = profile.avatar_url;
            delete profile.avatar_url;

            user.services.github.link = profile.html_url;
            delete profile.html_url;

            if (profile.services) {
                profile.services.push("github");
            }
            else {
                profile.services = ["github"]
            }

            user.profile = profile;

            user.profile.services = ["github"];

            return user;
        }

        if (service == "meetup") {
            var meetupId = user.services.meetup.id;
            var target = 'https://api.meetup.com/2/member/' + meetupId + '?key=' + MEETUP_API_KEY + '&signed=true';

            var result = HTTP.get(target, {
                params: {
                    format: 'json'
                }
            });

            var userProperties = result.data;

            if(userProperties.hasOwnProperty("photo") && userProperties.photo_link !== "") {
                var picture = userProperties.photo.highres_link;
            }

            options.profile = {
                'name': userProperties.name,
                'bio': userProperties.bio,
                'picture': picture,
                'email': null, // Meetup doesn't expose emails. To be filled out on an "Edit profile" page.
                'services': ["meetup"]
            };

            user.services.meetup.link = userProperties.link;

            user.profile = options.profile;

            return user;

        }

        if (service == "password") {
            user.profile = options.profile;
            user.profile.email = user.emails[0].address;
            user.profile.picture = null;
            user.profile.bio = null;
            user.profile.services = ["password"];

            return user;
        }
    }
    return user;
});