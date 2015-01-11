/**
 * Created by Hilawi on 1/1/15.
 */

MEETUP_API_KEY = "78761a1837f20736a037068304565"; // This key is from the account :http://www.meetup.com/members/183336755/
// The key should not be visible once deployed. It'll have to be placed in a file and passed to Meteor upon startup as an environment variable

ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1586721864878798',
    secret: 'd63b69d08b183a635d7d4af9a5e10a1f'
});

ServiceConfiguration.configurations.remove({
    service: "github"
});
ServiceConfiguration.configurations.insert({
    service: "github",
    clientId: "6955099e1c9f2bc9355c",
    secret: "9574a6144496214e27d792ae7e8f07b3ef1c2055"
});

ServiceConfiguration.configurations.remove({
    service: "meetup"
});
ServiceConfiguration.configurations.insert({
    service: "meetup",
    clientId: "33ve5upvrvugv6s3m2ja4oif7k",
    secret: "d5vnerk4rkq8sn5jqof1962rju"
});

Accounts.onCreateUser(function(options, user) {
    if (user.services) {
        var service = _.keys(user.services)[0];
        if (service == "facebook") {
            if (options.profile) {
                options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large&width=500&height=500";
                user.profile = options.profile;
            }
            return user;
        }

        if (service == "github") {
            // TODO: Figure out how to get user's full name and avatar picture from github. Same for service==meetup
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
                console.log(result);
                throw result.error
            }

            profile = _.pick(result.data,
                'login',
                'name',
                'avatar_url',
                'url',
                'company',
                'blog',
                'location',
                'email',
                'bio',
                'html_url'
            );

            profile.picture = profile.avatar_url;
            delete profile.avatar_url;

            user.profile = profile;

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
                var picture = userProperties.photo.photo_link;
            }

            options.profile = {
                'name': userProperties.name,
                'link': userProperties.link,
                'bio': userProperties.bio,
                'picture': picture,
                'id': meetupId
            };

            user.profile = options.profile;

            return user;

        }

        if (service == "password") {
            user.profile = options.profile;
            user.profile.email = user.emails[0].address;

            return user;
        }
    }
    return user;
});