define( [ 'backbone' ] , function ( Backbone ) {
	var CartItemModel = Backbone.Model.extend({
		urlRoot: ListConfig.cart.url
		,defaults: {
			title: 'default title'
			,qty: 1
			,subTotal: 10.00
		}
	});
	
	return CartItemModel;
});