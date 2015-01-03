Users = Meteor.users;

// Routing configurations

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/index.html', function() {
    this.render('home');
});

Router.route('/', function() {
    this.redirect('/index.html');
});

Router.route('/events.html', function() {
    this.render('events');
});

Router.route('/topics.html', function() {
    this.render('topics');
});

Router.route('/blog.html', function() {
    this.render('blog');
});

Router.route('/members.html', function() {
    this.render('members');
});

Router.route('/event-detail.html', function() {
    this.render('event-detail');
})

Router.route('user/:_id', function() {
    this.render('profile', {
        data: function() { return Users.findOne({_id: this.params._id});},
        allUsers: function() { return Users.find({});}
    });
});

// Client/Server Logic

if (Meteor.isClient) {
    Meteor.subscribe("users");

    Template.profile.helpers({
        stuff: function() {
            console.log(this._id);
            return Users.findOne({_id: this._id}).profile.name;
        }
    });

    Template.members.helpers({
        allUsers: function() {
            console.log("Hi there");
            console.log(Users.find().fetch());
            return Users.find({});
        }
    })
}

if (Meteor.isServer) {
    Meteor.publish("users", function() {
        console.log(Users.find());
        return Users.find();
    });
}

Handlebars.registerHelper('activeIfCurrent', function(page) {
    if (Router.current().route.getName() == page) {
        return "active";
    }
    return "";
});