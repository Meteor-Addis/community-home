if (Meteor.isClient) {
    Template.home.events({
        "click .join-us-btn": function(event) {
            event.preventDefault();

            $('body,html').animate({scrollTop:0}, 500, 'swing', setTimeout(openDropdown, 600));

            return false;
        }
    });
}

function openDropdown() {
    $('.login-dropdown-item').addClass('open');
    $('.signInForm').css('display', 'none');
    $('.registrationForm').css('display', 'block');
}