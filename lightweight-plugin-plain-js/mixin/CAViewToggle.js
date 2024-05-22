let CAViewToggle = {

  connectViewToggle() {
    this._currentViewId = "";
    this._views = this.el.querySelectorAll( '*[data-step]' )
    if( this._views.length == 0 ) {
      this._views = this.el.querySelectorAll( '*[data-view]' )
    }
    if( this._views.length > 0 ) {
        this._isViewToggleScene = true;
        this._checkProfileForViewToggle(ContentAccessProfile);
        ContentAccessProfile.on("profileLoaded", (profile) => this._checkProfileForViewToggle(profile));

      var gotos = this.el.querySelectorAll( '*[data-goto]' )
      gotos.forEach( ele => {
        ca_listen( ele , "click" , e => {
          /*block _toggleView from setting retarget if the click of this goto has a retarget which is checked by connectRetargets*/
          var selectionValue = ele.value || ele.getAttribute("title") || ele.innerText;
          ContentAccessStat.sendSelection(this._data, selectionValue);
          var currentView = this._toggleView( this._views , ele.dataset.goto )
          currentView.scrollIntoView({behavior: "smooth", block: "nearest"});
          /*click action retargets are set with connectRetargets mixin*/
          if( ele.dataset.retarget === undefined ) {
            ContentAccessProfile.setViewRetargetId( this._id , currentView.dataset.retarget || ele.dataset.goto );
          }
        });
      })
    }
  },

    _checkProfileForViewToggle(profile) {
        calog(this._id, "_checkProfileForViewToggle");
        let tmpRetargetId = ContentAccessProfile.getViewRetargetId(this._id, this._data.cliSettings.retargetMax);
        var firstViewId = tmpRetargetId || this._views[0].dataset.view || this._views[0].dataset.step;
        //not a direct action, but just an initial step-view selection. Should we send a stat here?
        //ContentAccessStat.send(this._data, "initialView", "step", tmpRetargetId);
        var currentView = this._toggleView(this._views, firstViewId);
        if (currentView.dataset.retarget !== undefined) {
            ContentAccessProfile.setViewRetargetId(this._id, currentView.dataset.retarget);
        }
    },
  
  _toggleView( views , id , secondCall ) {
    /*show the correct view*/
    var ret = null;
    views.forEach( s => {
      if( s.dataset.view === id || s.dataset.step === id ) {
        ret = s;
        s.style.display = "block"
        this._viewShowing( id , s );
      } else {
        s.style.display = "none"
      }
    })
    /*what if it tries to show an absent view*/
    if( ! ret && ! secondCall ) {
      /*this should not get caught in infinite calls as we are providing it an accurate view, but just in case lets block it cause it should also never need to happen twice*/
      return _toggleView( views , views[ 0 ].dataset.view || views[ 0 ].dataset.step , true );
    } else {
      this._data.cliSettings.elBottom = this._data.cliSettings.el.offsetTop + this._data.cliSettings.el.offsetHeight
      return ret;
    }
  },
  
  _viewShowing( id , viewEle ) {
    this._currentViewId = id;
    this.connectJavaScripts( viewEle );
    var cliConfig = this._data.cliSettings.views || this._data.cliSettings.steps;
    if( cliConfig ) {
      var viewInfo = cliConfig.find( x => x.id == id );
      if( typeof viewInfo !== "undefined" ) {
        if( viewInfo.trackingPixel ) {
          let trackingPixelWrapperId = "views-" + id + "-extra";
          let existing = viewEle.querySelector( "#" + trackingPixelWrapperId );
          if( existing ) {
            existing.remove();
          }
          viewEle.insertAdjacentHTML( "beforeend" , "<span id='" + trackingPixelWrapperId + "'>" + viewInfo.trackingPixel + "</span>" );
        }
      }
    }
  }
}