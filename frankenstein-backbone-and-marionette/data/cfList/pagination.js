define( [ 'backbone' ] , function ( Backbone ) {
	var PaginationModel = Backbone.Model.extend({
		defaults: {
			pageCount: 1
			,itemCount: 1
			,pageSize: 25
		},
		initialize: function() {
			this.set( "pageCount" , Math.ceil( this.get("itemCount") / this.get("pageSize") ) );
		}
	});
	
	return PaginationModel;
});