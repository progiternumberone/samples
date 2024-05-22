define( [ 'marionette' , 'tpl!' + ListConfig.template.filter_item ] , function( Marionette , filterItemTemp ) {
    var FilterListItemView = Marionette.View.extend({
    	template: filterItemTemp
		,events: {
			"change .filterSelect" : "changeFilter"
			,"click .filterClear" : "clearFilter"
			,"click .clearFilterGroup" : "clearFilterGroup"
		}
		,onBeforeRender: function() {
			if( this.model.collection.isLoaded() ) {
				if( this.model.get( "options" ).length == 0 ) {
					if( this.model.get( "value" ) != "" ) {
						this.model.set( "options" , [ this.model.get( "value" ) ] );
					}
					else {
						this.model.set( "options" , [ "---------------" ] );
					}
				}
				else if( ! ListConfig.filter.multiSelect && this.model.get( "value" ) == "" && this.model.get( "options" )[ 0 ] != "" ) {
					this.model.get( "options" ).unshift( "" );
				}
			}
		}
		,changeFilter: function(e) {
			var seperator = "&";
			if( ListConfig.filter.multiSelect ) {
				var curValue = this.model.get( "value" );
				if( e.target.checked ) {
					if( curValue != "" )
						curValue += seperator;
					curValue += e.target.value;
				} else {
					curValue = curValue.replace( e.target.value + seperator , "" );
					curValue = curValue.replace( seperator + e.target.value , "" );
					curValue = curValue.replace( e.target.value , "" );
				}
				this.model.set( "value" , curValue );
			} else {
				if( ListConfig.filter.onlyOne ) {
					this.model.collection.clearAll();
				}
				this.model.set( "value" , e.target.value );
				this.trigger( "filter:changed" , this );
			}
		}
		,clearFilterGroup: function(e) {
			e.preventDefault();
			this.model.set( "value" , "" );
			this.trigger( "filter:changed" , this );
			return false;
		}
		,clearFilter: function(e) {
			var seperator = "&";
			e.preventDefault();
			if( ListConfig.filter.multiSelect ) {
				var curValue = this.model.get( 'value' );
				curValue = curValue.replace( e.target.title + seperator , "" );
				curValue = curValue.replace( seperator + e.target.title , "" );
				curValue = curValue.replace( e.target.title , "" );
				this.model.set( "value" , curValue );
			} else {
				this.model.set( "value" , "" );
			}
			this.trigger( "filter:changed" , this );
			return false;
		}
	});
	
	return FilterListItemView;
});