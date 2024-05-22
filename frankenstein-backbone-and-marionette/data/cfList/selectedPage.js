define( [ 'backbone' ] , function ( Backbone ) {
	var SelectedPageModel = Backbone.Model.extend({
		defaults: {
			currentPage: 0
		}
	});
	
	return SelectedPageModel;
});