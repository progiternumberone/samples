class CAScene {
  constructor( params /*{ id , stage , parent }*/ ) {
    this._id = params.id;
    this._stage = params.stage;
    this._location = "https://d1lxgbsjkcc098.cloudfront.net/" + this._id + ".js";
    this._data = false;
    this._loadStartTime = null;
    this._parent = params.parent || null;
    this._children = [];
    this._isCueScene = false;
    this._sceneIdx = 0;
      this._isViewToggleScene = false;
      this._stopRendering = false;
  }
  
  get el() {
    return this._data && this._data.cliSettings && this._data.cliSettings.el ? this._data.cliSettings.el : null;
  }
  
  set el( el ) {
    if( this._data && this._data.cliSettings )
      this._data.cliSettings.el = el;
  }
  
  get isSceneOfScenes() {
    return this._children.length > 0;
  }

    get sceneEle() {
        return (this._data.cliSettings && this._data.cliSettings.el) || null;
    }
    get firstDiv() {
        return (this.sceneEle && this.sceneEle.querySelector("div[data-retarget-scene]")) || null;
    }
  
  /*get isViewToggleScene() {
    return this._isViewToggleScene;
  }
  
  set isViewToggleScene( val ) {
    this._isViewToggleScene = Boolean( val );
  }*/
  
  load() {
    calog(this._id , "CAScene->load");
    this._loadStartTime = Date.now();
    if( ! this._data ) {
      /*create the JSONP handler at the global level*/
      var self = this;
      window[ 'contentAccessCallback' + this._id.replace( /[^a-z0-9]/g , "" ) ] = function( data ) { 
        self.callbackHandle( data );
      };
      window[ 'ca_codex_callback' + this._id.replace( /[^a-z0-9]/g , "" ) ] = function( data ) { 
        self.callbackHandle( data );
      };
      window[ 'cfFinderCallback' + this._id.replace( /[^a-z0-9]/g , "" ) ] = function( data ) { 
        self.callbackHandle( data );
      };
      
      /*old shit*/
      global_scene_id = this._id;
      
      let script = document.createElement( 'script' );
      script.src = this._location;
      document.body.appendChild( script );
    } else {/*already loaded*/
      this.render();
    }
  }
  
  callbackHandle( data ) {
    if( ! this._data ) {
        var tmpDiff = (Date.now() - this._loadStartTime);
        if (tmpDiff > 30) {/*this is to prvent triggering when it is loaded form local cache*/
            ContentAccessStat.sendLoadTime(this._id, tmpDiff);
        }
      this._data = data.Scene || data.Codex || data.Finder;
      this._data.id = this._data.id || this._id;
      this.cleanDefaults();
      calog( this , "callbackHandle" );
        if (this.isSceneOfScenes) {
            this.setSceneIdx(0);
        }
        //look for profile directly incase it already loaded before this scene
        this._checkProfileForScene(ContentAccessProfile, false);
        ContentAccessProfile.on("profileLoaded", (profile) => this._checkProfileForScene(profile, true));
        this.render();//normal render spot after the scene has loaded
    }
  }

    updateData(data) {
        this._data = data;
        this.cleanDefaults();
    }

    _checkProfileForScene(profile, isProfileLoadedEvent) {
        calog(this._id, "_checkProfileForScene");
        if (ContentAccessProfile.isLoaded) {
            //use retarget record tied only to first (stage) scene
            let tmpRetargetId = (!this.isSceneOfScenes && (this._parent || this._stage.stageSceneId !== this._id)) ? this._id : ContentAccessProfile.getSceneRetargetId(this._id, this._data.cliSettings.retargetMax);
            if (this.isSceneOfScenes) {
                //set the scene of scene scene, if it is not one of its scenes it will return false
                let tmpHasScene = this.setSceneIdx(tmpRetargetId);
                tmpRetargetId = tmpHasScene ? false : tmpRetargetId;
                if (isProfileLoadedEvent && tmpHasScene) {
                    //not a direct action, but just an initial load of the retarged scene. Should we send a stat here?
                    //as soon as the scene is loaded the view stat will be triggered
                    //ContentAccessStat.send(this._data, "retarget", "scene", tmpRetargetId);
                    this.showScene();
                }
            }
            //scene retargeting
            if (tmpRetargetId && tmpRetargetId !== this._id) {
                calog(tmpRetargetId, "call this._stage.toggleScene");
                //not a direct action, but just an initial load of the retargeted scene. Should we send a stat here?
                //as soon as the scene is loaded the view stat will be triggered
                //ContentAccessStat.send(this._data, "retarget", "scene", tmpRetargetId);
                this._stage.toggleScene({ id: tmpRetargetId });
                this._stopRendering = true;
            }
            //this.render();//another way to render after profiles are loaded
        } else {
            /*this will run _checkProfileForScene if profile was not yet loaded*/
            //ContentAccessProfile.on("profileLoaded", (profile) => this._checkProfileForScene(profile, true));
        }
    }
  
  render() {
      if (this._stopRendering) {
          this._stopRendering = false;
          return;
      }
    if (this.isSceneOfScenes) {
      this._data.cliSettings.elBottom = 0;
      ContentAccessStat.sendView(this._data);
      this.showScene();
    } else if (this._isCueScene) {
        this.connectCueScene(this._data.cliSettings.cues);
    } else {
      //this._data.cliSettings.el.style.visibility = "hidden";
      this._data.cliSettings.el.innerHTML = this.getTemplateOrContent();
      this._data.cliSettings.elBottom = this._data.cliSettings.el.offsetTop + this._data.cliSettings.el.offsetHeight;
      this.connectSmartNavSelects();
      this.connectViewToggle();
      this.connectRetargets();
      this.connectSceneSwitch();
      this.connectGenericActions();
      ContentAccessStat.sendView(this._data);
      //this._data.cliSettings.el.style.visibility = "visible";
      if( ! this._isViewToggleScene ) {
        this.connectJavaScripts( this._data.cliSettings.el );
      }
      this._stage.setAriaLive();
        /*if this scene says to retarget on the container then do so*/
        if (this.firstDiv && this.firstDiv.dataset.retargetScene !== undefined) {
            ContentAccessProfile.setSceneRetargetId(this._stage.stageSceneId, this.firstDiv.dataset.retargetScene);
        }
    }
  }
  
  cleanDefaults() {
    this._data.cliSettings.el = this._stage.setStage();
    this._data.cliSettings = this._data.cliSettings || {};
    this._data.cliSettings.enableGeolocation = this._data.cliSettings.enableGeolocation || false;
    this._data.theme = this._data.theme || {};
    //setTheme( CodeXModel , codex_theme_global );
    if( ! this._data.cliSettings.option1ElementId ) this._data.cliSettings.option1ElementId = "program-type";
    //if( ! this._data.cliSettings.option1DefaultText ) this._data.cliSettings.option1DefaultText = "any type of program";
    if( ! this._data.cliSettings.option2ElementId ) this._data.cliSettings.option2ElementId = "program-field";
    //if( ! this._data.cliSettings.option2DefaultText ) this._data.cliSettings.option2DefaultText = "any field";
    if( ! this._data.cliSettings.retargetMax ) this._data.cliSettings.retargetMax = 5;
    if (this._data.cliSettings.noStats && window.location.href.indexOf("app.contentaccess.com") > -1) this._data.cliSettings.noStats = false;
    
    if( this._data.cliSettings.scenes ) {
      this._data.cliSettings.scenes.forEach( s => {
        this._children.push( new CAScene( { id: s.id , stage : this._stage , parent : this } ) );
      });
    }

      if (this._data.cliSettings.cues) {
          this._isCueScene = true;
      }
    return this;
  }
  
  getTemplateOrContent() {
		var ret = "";
		if( this._data.template && this._data.template.indexOf( "text/template" ) === -1 ) {
			/* as is content */
			ret = this._data.template;
		} else {
			/* with template(s) */
			if( this._data.template ) {
				/* add it to the DOM */
				var tmpDiv = document.createElement( "div" );
				tmpDiv.innerHTML = this._data.template;
				document.body.appendChild( tmpDiv );
			}
			ret = this.getTemplate();
		}
		return ret;
	}
	
	getTemplate() {
		var ret;
		if( document.getElementById( "template-" + this._id ) ) {
			ret = document.getElementById( "template-" + this._id ).innerHTML;
			/* check for theme template */
			if( this._stage.theme.idName && document.getElementById( this._stage.theme.idName + "-template-" + this._id ) ) {
				ret = document.getElementById( this._stage.theme.idName + "-template-" + this._id ).innerHTML;
			}
		} else {
			throw( 'ContentAccess Scene Error: <script type="text/template" id="template-' + this._id + '"> is missing.' );
		}
		return ret;
	}
  connectJavaScripts( ele ) {
    if( ele ) {
      let scripts = ele.getElementsByTagName( "script" );
      Array.from( scripts ).forEach( s => {
        let script = document.createElement( 'script' );
        script.src = s.src;
        document.body.appendChild( script );
      });
    }
  }
  
}