define( [ 'backbone' ] , function ( Backbone ) {
	var FilterModel = Backbone.Model.extend({
		defaults: {
			attr: ""
			,value: ""
			,options: []
		}
		,getNVP: function() {
			return { "name": this.get( "attr" ) , "value": this.get( "value" ) };
		}
		,getURLParam: function() {
			return this.get( "attr" ) + "=" + escape( this.get( "value" ) );
		}
	});
	
	return FilterModel;
});