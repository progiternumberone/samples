define( [ 'backbone' , 'model/cartItem' ] , function ( Backbone , CartItemModel ) {
    var CartCollection = Backbone.Collection.extend({
		url: ListConfig.cart.url
		,model: CartItemModel
		,addBlank: function( data ) {
			this.add( new CartItemModel( data ) );
		}
		/*,comparator: function( a , b ) {
			//return item.get( "usasVendorId" );
			if( a.get( "batchTotal" ) )
				return -1;
			else if( a.get( "vendorTotal" ) && a.get( "usasVendorId" ) == b.get( "usasVendorId" ) )
					return -1;
			else if( a.get( "usasVendorId" ) < b.get( "usasVendorId" ) ) {
				return -1;
			}
				
			return 1;
		}*/
	});
	
	return CartCollection;
});