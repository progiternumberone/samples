define( [ 'marionette' , 'views/cfList/filterListItem' ] , function( Marionette , FilterListItemView ) {
	var FilterListView = Marionette.CollectionView.extend({
		childView: FilterListItemView
		,onRender: function() {
			log( "FilterListView onRender" );
		}
	});
	
	return FilterListView;
});