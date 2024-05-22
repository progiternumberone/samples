define( [ 'backbone' , 'entity/cfList/filter' ] , function ( Backbone , FilterModel ) {
    var FilterCollection = Backbone.Collection.extend({
		//url: ListConfig.filter.url
		urlFilters: ""
		,url: function() {
			var ret = "";
			var filterParam = this.getURLJson();
			if( filterParam != "" ) {
				ret += "?filters=" + filterParam;
			}
			
			this.searchText = this.searchText.replace( /[!\$\^&\*\(\)~\[\]|{}'";<>\?]/g , "" );
			if( this.searchText != "" ) {//$( ".searchText" ).val() != "" ) {
				//ret += ( ret == "" ? "?" : "&" ) + "search=" + $( ".searchText" ).val();
				ret += ( ret == "" ? "?" : "&" ) + "search=" + this.searchText;
			}
			ret = ListConfig.filter.url + ret;
			return ret;
		}
		,initialize: function() {
			if( ListConfig.filter.initialJson ) {
				this.reset( ListConfig.filter.initialJson );
			}
		}
		,searchText: ""
		,comparator: "value"
		,model: FilterModel
		,addBlank: function() {
			this.add( new FilterModel() );
		}
		,hasFilter: function() {
			return this.searchText || this.getFirstUsedModel();
		}
		,clearAll: function() {
			this.each( function( filter ) {
				filter.set( "value" , "" );
			});
			this.searchText = "";
		}
		,getTotalResults: function() {
			return this.models.length > 0 ? this.models[0].get( "totalResults" ) : 0;
		}
		,isLoaded: function() {
			var ret = false;
			this.each( function( filter ) {
				if( filter.get( "options" ).length > 0 )
					ret = true;
			});
			return ret;
		}
		,getFirstUsedModel: function() {
			var ret = null;
			this.each( function( filter ) {
				if( filter.get( "value" ) )
					ret = filter;
			});
			return ret;
		}
		,getNVP: function( active ) {
			var collNVPArr = [];
			this.each( function( filter ) {
				if( ! active || filter.get( "value" ) )
					collNVPArr.push( filter.getNVP() );
			});
			return collNVPArr;
		}
		,getActiveNVP: function() {
			return this.getNVP( true );
		}
		,getURLJson: function() {
			var nvpArr = this.getActiveNVP();
			var ret = "";
			if( nvpArr.length > 0 ) {
				//ret += ret == "" ? "?filterNVP=" : "&filterNVP=";
				var first = true;
				ret += "[";
				_.each( nvpArr , function( nvp ) {
					ret += first ? "" : ",";
					ret += '{"' + nvp.name + '":"' + escape( nvp.value ) + '"}';
					first = false;
				});
				ret += "]";
			}
			return ret;
		}
		,getURLParam: function() {
			var paramArr = "";
			this.each( function( filter ) {
				if( filter.get( "value" ) ) {
					paramArr = paramArr == "" ? "" : paramArr + "|";
					paramArr += filter.getURLParam();
				}
			});
			log( "paramArr" );
			log( paramArr );
			if( paramArr == "" ) paramArr = "0";
			this.searchText = this.searchText.replace( /[!\$\^\*\(\)~\[\]|{}<>\?;]/g , "" );/* '"& */
			if( this.searchText != "" ) {
				paramArr += "/" + escape( this.searchText );
			}
			return paramArr;
		}
		,save: function( options ) {
			var self = this;
			Backbone.sync('create', this , {
				success: function( col ) {
					if( options.reset == true )
						self.reset( col );
					options.success( col );
				}
			});
		}
		,parseFromURL: function( urlFilters ) {
			if( urlFilters ) this.urlFilters = urlFilters;
			var filterNVP = [];
			this.urlFilters = this.urlFilters == "0" ? "" : this.urlFilters;
			if( this.urlFilters ) {
				var filters = this.urlFilters.split( "|" );
				_.each( filters , function( nameValue ) {
					nv = nameValue.split( "=" );
					var model = this.findWhere( { attr: nv[ 0 ] } )
					model.set( "value" , nv[ 1 ] );
				} , this );
			}
			return filterNVP;
		}
		
	});
	
	return new FilterCollection();
});