Handlebars.registerHelper('activeIfCurrent', function (page) {
	if (Router.current().route.getName() == page) {
		return "active";
	}
	return "";
});