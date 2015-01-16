Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', {name: 'home'}, function () {
	this.render('home', {
	    data: function () { 
	    	return Meteor.users.find();
	    }
	 });
});

Router.route('events', function () {
	this.render('events', {
		data: function () {
			return Meteor.users.find();
		}
	});
});

Router.route('events/:_id', function () {
	this.render('viewEvent', {
		data: function () {
			return Events.findOne({_id: this.params._id});
		}
	});
});

Router.route('/topics', function () {
	this.render('topics', {
		data: function () {
			return Meteor.users.find();
		}
	});
});

Router.route('/blog', function () {
	this.render('blog', {
		data: function () {
			return Meteor.users.find();
		}
	});
});

Router.route('/members', function () {
	this.render('members', {
		data: function () {
			return Meteor.users.find({}, {sort: {"profile.name": 1}});
		}
	});
});

Router.route('user/:_id', function () {
	this.render('profiles', {
		data: function () {
			return Meteor.users.findOne({_id: this.params._id});
		}
	});
});

Router.route('settings', function () {
	this.render('settings', {
		data: function () {
			return Meteor.users.findOne({_id: this.params._id});
		}
	});
});