
// Routing configurations

Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/index', function () {
	this.render('home', {
		data: function () {
			return Users.find();
		}
	});
});

Router.route('/', function () {
	this.redirect('/index');
});

Router.route('/events', function () {
	this.render('events', {
		data: function () {
			return Users.find();
		}
	});
});

Router.route('/topics', function () {
	this.render('topics', {
		data: function () {
			return Users.find();
		}
	});
});

Router.route('/blog', function () {
	this.render('blog', {
		data: function () {
			return Users.find();
		}
	});
});

Router.route('/members', function () {
	this.render('members', {
		data: function () {
			return Users.find({}, {sort: {"profile.name": 1}});
		}
	});
});

Router.route('/event-detail', function () {
	this.render('event-detail', {
		data: function () {
			return Users.find();
		}
	});
});

Router.route('user/:_id', function () {
	this.render('profile', {
		data: function () {
			return Users.findOne({_id: this.params._id});
		}
	});
});