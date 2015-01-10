/**
 * Created by Hilawi on 1/9/15.
 */

Meteor.methods({
    deleteUser: function(id) {
        if (Meteor.userId() == id) {
            Meteor.users.remove({_id: id});
            return true;
        }
        else {
            return "Account delete failed";
        }
    }
});