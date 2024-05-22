class CAStage {
  constructor( params /*{ id , theme }*/ ) {
    this._currentSceneId = params.id;
    this._script = params.script;
    this.theme = params.theme;
    this._defaultClassName = false;
    this._currentScene = new CAScene( { id: this._currentSceneId , stage : this } );
    this._stageEle = null;
    this._stageSceneId = this._currentSceneId;
  }
  
  get theme() {
    return this._theme;
  }

    get stateEle() {
        return this._stageEle;
    }

  get stageSceneId() {
    return this._stageSceneId;
  }
  
  get currentScene() {
      return this._currentScene;
  }
  
  set theme( name ) {
      let tmp = name || "";
      this._theme = { name : tmp , idName : tmp.replace( /\s/g , "-" ) }
  }
  
  load() {
    this._currentScene.load();
  }
    clear() {
        this._stageEle.innerHTML = "";
    }
  setStage() {
      if (!this._stageEle) {
          /*just need to run this once for the first scene, other scenes will be pulled onto this stage*/
          this.identifyContainer(this._currentScene.el);
          if (this._stageEle.getAttribute("data-theme")) {
              this.theme = this._stageEle.getAttribute("data-theme");// || this.theme;
          }
      }
    this.addThemeClass();
    return this._stageEle;
    //this._currentScene.el = this._stageEle;
    //this._currentScene.render();
  }
    setAriaLive() {
        if (!this._stageEle.ariaLive) {
            this._stageEle.ariaLive = "polite";
        }
    }

  addThemeClass() {
    if( this._defaultClassName === false ) {
      this._defaultClassName = this._stageEle.className || "";
    }
    this._stageEle.className = this._defaultClassName + ( ' ca-scene-' + this._currentSceneId ) + ( this._theme.idName ? ' ca-scene-' + this._theme.idName : "" );
		this._stageEle.className += ( ' smart-nav-' + this._currentSceneId ) + ( this._theme.idName ? ' smart-nav-' + this._theme.idName : "" );
  }
  
    identifyContainer(providedId) {
        let tmpId = providedId;
        let autoId = "ca-scene-" + this._currentSceneId.substr(0, this._currentSceneId.indexOf("-"));
        if (!providedId || !document.getElementById(providedId)) {
            tmpId = autoId;
        }
        if (document.getElementById(tmpId)) {
            this._stageEle = document.getElementById(tmpId);
		} else {
			//throw( "ContentAccess Stage: specified element " + this._stageEle + "does not exist" );
            tmpId = providedId || autoId;
			console.error( "ContentAccess Stage: specified element with id of \"" + tmpId + "\" does not exist" );
			this._stageEle = document.createElement( "div" );
            this._stageEle.id = tmpId;
            this._script.parentNode.insertBefore(this._stageEle, this._script);
		}
	}
    toggleScene(params /*{ id }*/) {
        calog({ _currentSceneId:this._currentSceneId, "params->id": params.id }, "toggleScene");
        if (this._currentSceneId !== params.id) {
            this._currentSceneId = params.id;
            this._currentScene = new CAScene({ id: this._currentSceneId, stage: this });
            this._currentScene.load();
        }
    }
}