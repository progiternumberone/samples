define( [ 'backbone' , 'entity/cfList/item' ] , function ( Backbone , ItemModel ) {
    var ItemCollection = Backbone.Collection.extend({
        //url: ITEMS_URL
		ensureMapNumLoad: 0
		,fetchingMore: false
		,searchText: ""
		,orderBy: ""
		,pageNum: 1
		,pageSize: ( ListConfig.item.pageSize ? ListConfig.item.pageSize : 10 )
		,maxDisplaySize: function() { return this.pageSize * this.pageNum; }
		,url: function() {
			var ret = ListConfig.item.url;
			var params = "";
			var connector = ret.indexOf( "?" ) > -1 ? "&" : "?";
			if( this.ensureMapNumLoad != 0 )
				params += connector + "mapNum=" + this.ensureMapNumLoad;
			else {
				if( this.filterParam ) {
					if( this.filterCollection && this.filterCollection.getFirstUsedModel() && ListConfig.item.urls && ListConfig.item.urls[ this.filterCollection.getFirstUsedModel().get( "attr" ) ] ) {
						ret = ListConfig.item.urls[ this.filterCollection.getFirstUsedModel().get( "attr" ) ] + this.filterCollection.getFirstUsedModel().get( "value" );
						connector = ret.indexOf( "?" ) > -1 ? "&" : "?";
					} else {
						params += connector + "filters=" + this.filterParam;
						connector = "&";
					}
				}
				this.searchText = this.searchText.replace( /[!\$\^\*\(\)~\[\]|{}<>\?;]/g , "" );/* '"& */
				if( this.searchText != "" ) {
					if( ListConfig.item.urls[ "Search" ] ) {
						ret = ListConfig.item.urls[ "Search" ] + this.searchText;
						connector = ret.indexOf( "?" ) > -1 ? "&" : "?";
					} else {
						params += connector + "search=" + escape( this.searchText );
						connector = "&";
					}
				}
				if( this.fetchingMore ) {
					params += connector + "more=1";
					connector = "&";
				}
				if( this.orderBy != "" ) {
					params += connector + "orderBy=" + this.orderBy + "&orderDir=" + this.orderDir;
					connector = "&";
				}
				if( this.pageNum != 1 ) {
					params += connector + "pageNum=" + this.pageNum + "&pageSize=" + this.pageSize;
				}
			}
			ret = ret + params;
			//alert( ret );
			return ret;
		}
		,fetchEnsureMap: function( id , options ) {
			this.ensureMapNumLoad = id;
			this.fetch({
				success: options.success
				,error: function( col , resp ,opts ) {
					log( "fetchSearch fetch error" );
					var rtext = resp.responseText;
					if( rtext.indexOf( "<data>" ) != -1 ) {
						log( "fetchSearch had <data>" );
						rtext = rtext.replace( "<data>" , "" );
						rtext = rtext.replace( "<![CDATA[" , "" );
						rtext = rtext.replace( "]]>" , "" );
						rtext = rtext.replace( "</data>" , "" )
						col.on( "reset" , function( collection ) {
							log( "reset collection" );
							log( collection );
							options.success( collection );
						});
						col.reset( JSON.parse( rtext ) );
					} else {
						options.error( col , resp , opts );
					}
				}
			});
			this.ensureMapNumLoad = 0;
		}
		,fetchMore: function( FilterCollection ) {
			this.pageNum++;
			this.fetchingMore = true;
			this.filter( FilterCollection );
			this.fetchingMore = false;
		}
		,_fetchSearch: function( FilterCollection , options ) {//filterNVPArray , text , options ) {
			log( "_fetchSearch" );
			this.searchText = FilterCollection.searchText;
			this.filterParam = FilterCollection.getURLJson();
			this.filterCollection = FilterCollection;
			log( "_fetchSearch2" );
			this.fetch({
				success: options ? options.success : undefined
				,error: options ? options.error : undefined
			});
			log( "_fetchSearch3" );
			this.filterParam = null;
			this.searchText = "";
		}
		,model: ItemModel
		,addBlank: function() {
			this.add( new ItemModel() );
		}
		,lastSortDescending: false
		,lastSortField: ""
		
		,customSort: function( attr , refetch , filterCol ){
			if( this.lastSortField == attr )
				this.lastSortDescending = !this.lastSortDescending;
			else
				this.lastSortDescending = false;
				
			var descending = this.lastSortDescending;
			this.lastSortField = attr;
			
			if( refetch ) {
				this.orderBy = attr;
				this.orderDir = ( this.lastSortDescending ? "desc" : "asc" );
				if( filterCol ) {
					this.filterParam = filterCol.getURLJson();
					if( filterCol.searchText != "" )
						this.searchText = filterCol.searchText;
				}
				
				this.fetch();
				this.filterParam = null;
				this.searchText = "";
				this.orderBy = "";
				this.orderDir = "";
			} else {
				this.models.sort( function( a , b ) {
					var chooseA = descending ? -1 : 1;
					var tmpA = a.get( attr ).replace( "$" , "" );
					if( isNaN( parseFloat( tmpA ) ) ) {
						return a.get( attr ) > b.get( attr ) ? chooseA : chooseA*-1;
					}
					else {
						var tmpB = b.get( attr ).replace( "$" , "" );
						return parseFloat( tmpA ) > parseFloat( tmpB ) ? chooseA : chooseA*-1;
					}
				});
			}
			this.trigger( "sort" );
		}
		,filter: function( FilterCollection , options/* , isOnlyForGetMore*/ ) {
			log( "items->filter" );
			if( ListConfig.item.filterOnServer ) {
				this._fetchSearch( FilterCollection , options );
			} else {
				var idx = 0;
				log( "items filter start" );
				this.each( function( item ) {
					var showIt = true;
					var searchText = FilterCollection.searchText;
					if( ! ListConfig.waitForSearch || searchText != "" ) {
						_.each( FilterCollection.getActiveNVP() , function( nvp ) {
							if( showIt ) {
								log( nvp.name );
								if( typeof item.get( nvp.name ) == "object" ) {
									if( ListConfig.filter.multiSelect ) {
										_.each( nvp.value.split( "&" ) , function( val ) {
											if( showIt ) {
												showIt = item.get( nvp.name ).indexOf( val ) > -1;
											}
										});
									} else {
										showIt = item.get( nvp.name ).indexOf( nvp.value ) > -1;
									}	
								} else if( ListConfig.filter.attributesWithCSV && $.inArray( nvp.name , ListConfig.filter.attributesWithCSV ) > -1 ) {
									if( ListConfig.filter.multiSelect ) {
										_.each( nvp.value.split( "&" ) , function( val ) {
											if( showIt ) {
												showIt = item.get( nvp.name ).toLowerCase().indexOf( "," + val.toLowerCase() + "," ) > -1
											}
										});
									} else {
										showIt = item.get( nvp.name ).toLowerCase().indexOf( "," + nvp.value.toLowerCase() + "," ) > -1
									}
								} else {
									/*this may need to check for ListConfig.filter.multiSelect too*/
									showIt = item.get( nvp.name ) == nvp.value;
								}
							}
						});
						if( showIt && searchText != "" ) {
							var foundMatch = false;
							var foundContaining = false;
							if( ListConfig.search ) {
								if( ListConfig.search.matches )
									_.each( ListConfig.search.matches , function( toMatch ) {
										if( ! foundMatch )
											foundMatch = item.get( toMatch ) == searchText;
									});
								var searchTextLower = searchText.toLowerCase();
								if( ListConfig.search.contains )
									_.each( ListConfig.search.contains , function( toContain ) {
										if( ! foundContaining ) {
											if( typeof item.get( toContain ) == "object" ) {
												_.each( item.get( toContain ) , function( toContainArrItem ) {
													foundContaining = foundContaining || toContainArrItem.toLowerCase().indexOf( searchTextLower ) > -1;
												});
											} else if( ListConfig.filter.attributesWithCSV && $.inArray( toContain , ListConfig.filter.attributesWithCSV ) > -1 ) {
												if( ListConfig.filter.searchCsvAnywhere )
													foundContaining = item.get( toContain ).toLowerCase().indexOf( searchTextLower ) > -1
												else
													foundContaining = item.get( toContain ).toLowerCase().indexOf( "," + searchTextLower + "," ) > -1
											}
											else {
												foundContaining = item.get( toContain ).toLowerCase().indexOf( searchTextLower ) > -1
											}
										}
									});
							}
							showIt = foundMatch || foundContaining;					
						}
					} else {
						showIt = false;
					}
					item.set( "active" , showIt );
					item.set( "inpage" , true );
					if( ListConfig.item.infiniteScroll && ( !showIt || idx > this.pageNum*this.pageSize ) ) {
						item.set( "inpage" , false );
					} else {
						idx++;
					}
				} , this);
				log( "items filter end" );
				this.trigger( "sync" );
			}
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
	
	return new ItemCollection();
});