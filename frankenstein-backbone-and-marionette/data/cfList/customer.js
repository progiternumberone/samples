define( [ 'backbone' ] , function ( Backbone ) {
    var CustomerModel = Backbone.Model.extend({
		urlRoot: ListConfig.customer.url
		,defaults: {
			"subtotalCost": 0
			,"total" : 0
		}
	});
	
	return CustomerModel;
});