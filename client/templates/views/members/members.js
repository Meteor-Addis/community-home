Template.members.helpers({
    allUsers: function() {
        return Meteor.users.find({}, {sort: {"profile.name": 1}});
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