Meteor.methods({
	deleteUser: function (id) {
		if (Meteor.userId() == id) {
			// delete associated topics
			Topics.remove({owner: id});

			TopicVotes.remove({voter: id});

			Meteor.users.remove({_id: id});
			return true;
		}

		else {
			return "Account delete failed";
		}
	}
});