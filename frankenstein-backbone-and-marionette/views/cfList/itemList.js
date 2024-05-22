define( [ 'marionette' , 'views/cfList/itemListItem' ] , function( Marionette , ItemListItemView ) {
	var ItemListView = Marionette.CollectionView.extend({
		className: ""
		,numShown: 0
		,childView: ItemListItemView
		/*,render: function() {
			log( "ItemListView onRender" );
			log( this );
			for(var i = 0; i < 10; i++ ) {
				if( this.children.length > i )
					this.$el.append( this.children.toArray()[ i ].render() );
			}
			return false;
		}*/
		,onRender: function() {
			log( "itemList onRender" );
			if( ListConfig.template.list_empty ) {
				if( this.numShown == 0 ) {
					this.$el.html( ListConfig.template.list_empty );
				}
			}
		}
		,onBeforeRender: function() {
			this.numShown = 0;
			this.$el.html( '' );
		}
		,childEvents: function() {
			return {
				render: this.onChildRender
			}
		}
		,handleScroll: function( childView ) {
			if( childView.$el.isInViewport() ) {
				$( window ).off( 'scroll' );
				this.trigger( 'item:loadmore' );
			}
		}
		,onChildviewRender: function( childView ) {
			if( childView.model.get( "active" ) && childView.model.get( "inpage" ) ) {
				this.numShown++;
				if( ListConfig.item.infiniteScroll && ( ( !ListConfig.item.useServer && this.numShown == this.collection.maxDisplaySize() - 5) || ( ListConfig.item.useServer && childView._index == this.collection.length - 9 ) ) ) {
					var self = this;
					$( window ).off( 'scroll' );
					$( window ).on( 'scroll' , function() { self.handleScroll( childView ); } );
				}
			}
		}
	});
	
	return ItemListView;
});