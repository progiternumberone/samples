define( [ 'backbone' ] , function ( Backbone ) {
	if( ! ListConfig.item.defaults ) {
		ListConfig.item.defaults = {
			title: 'default title'
			,saleprice: 0
			,active: true
			,inpage: true
		}
	} else {
		ListConfig.item.defaults.active = true;
		ListConfig.item.defaults.inpage = true;
	}
	var ItemModel = Backbone.Model.extend({
		idAttribute: ListConfig.item.idVar
		,defaults: ListConfig.item.defaults
		,initialize: function() {
			if( this.get( "FirstName" ) ) {
				this.set( 'FirstInitial' , this.get( "FirstName" )[ 0 ] );
				this.set( 'LastInitial' , this.get( "LastName" )[ 0 ] );
			}
		}
	});
	return ItemModel;
});