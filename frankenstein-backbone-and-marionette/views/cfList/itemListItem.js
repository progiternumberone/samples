define( [ 'marionette' , 'tpl!' + ListConfig.template.list_item ] , function( Marionette , itemTemp ) {
	var ItemListItemView = Marionette.View.extend({
		template: itemTemp
		,className: "listItem"
		//,maxDisplay: 25
		,events: {
			'click a.detail': "select"
			,'click a.addtocart': "addtoCart"
			,'click button.removefromcart': "removefromcart"
		}
		,removefromcart: function( e ) {
			e.preventDefault();
			this.trigger( "item:removefromcart" );
			return false;
		}
		,addtoCart: function( e ) {
			e.preventDefault();
			var qty = $( e.target ).siblings( "select" ).val();
			this.model.set( "qty" , qty );
			this.trigger( "item:addtocart" );
			this.model.set( "isInCart" , "1" );
			this.render();
			return false;
		}
		,select: function( e ) {
			e.preventDefault();
			this.trigger( "item:selected" );
			return false;
		}
		,onRender: function( a ) {
			if( this.model.get( "active" ) && this.model.get( "inpage" ) )
				this.$el.show();
			else
				this.$el.hide();
			
			if( this.$el.find( ".mapImg" ).length > 0 ) {
				var tmp = new Image();
				var tmp2 = $( this.$el.find( ".mapImg" )[0] );
				tmp.onload = function() {
					var divH = 230;
					var divW = 230;
					if( tmp.height > divH )
						tmp2.css( 'top' , -1*(tmp.height/2 - divH/2) );
					if( tmp.width > divW )
						tmp2.css( 'left' , -1*(tmp.width/2 - divW/2) );
				}
				tmp.src = this.$el.find( ".mapImg" )[0].src;
			}
		}
	});
	
	return ItemListItemView;
});