class CAProfile {
  constructor( params /*{}*/ ) {
      this._data = this.defaultData();
    //this.fetch();
      this._curScene = null;
      this._isBeaconNeeded = false;
      this._isLoaded = false;
      this._isReadyForSaving = false;
    //this._retargetSceneStorageName = null;
    //this._retargetSceneCountStorageName = null;
      document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden' && this._isBeaconNeeded) {
              this._data.time = Date.now();
              calog(this._data.time, "SAVING");
              this.saveAll();
              this._isBeaconNeeded = false;
              navigator.sendBeacon(this.endpoint, JSON.stringify(this._data));
          }
      });
  }
    get endpoint() {
        return IS_LOCAL ? "http://localhost:3002/profile" : "https://6cu9dm1bl7.execute-api.us-east-1.amazonaws.com/prod/profile";
    }
    get isLoaded() {
        return this._isLoaded;
    }

    get ID() {
        return this._data.id || "noid";
    }

    defaultData() {
        return { scenes: [] };
    }

    fetch(forasync) {
        if (!forasync) this.fetchFromLocalStorage(true);
        var self = this;
        let backupCheckLocalStorageTimeoutId = setTimeout(() => {
            //need to tell it to save since there was nothing to load, so whatever we have is ready to go to server
            this._isBeaconNeeded = true;
            this._isReadyForSaving = true;
            if (forasync) {
                this.fetchFromLocalStorage();
            }
        }, 2000);
        window.contentAccessProfile = function (data) {
            clearTimeout(backupCheckLocalStorageTimeoutId);
            calog(data, "contentAccessProfile received");
            self._isReadyForSaving = true;
            if (!self.loadData(data)) {
                if (forasync) {
                    self._isBeaconNeeded = true;
                    self.fetchFromLocalStorage();
                }
            }
        };
        let script = document.createElement('script');
        script.src = this.endpoint;// + '?ua=' + navigator.userAgent;
        //the below lambda edge uses IPv6 sometimes
        //script.src = 'https://p.contentaccess.com/profile.js?t=' + Date.now();
        document.body.appendChild(script);
    }

    loadData(data, isFromLocalStorage) {
        //if saved data has no time it is old style, ignore it
        //if already loaded localstorage has no time it is old style or there was no localstorage and it is defaultData(), ignore it
        //if everything has time make sure the loaded profile is newer than the localstorage cache
        var isLoadedDataNewer = (data.time && (!this._data.time || this._data.time < data.time));
        calog({ data, isFromLocalStorage, a: data.time, b: this._data.time, isLoadedDataNewer }, "loadData");
        if (!isFromLocalStorage) {
            this._data.id = data.id;
        }
        if (isLoadedDataNewer) {
            this._data = data;
            this._curScene = null;//this was the important addition to ignore any actions from preloading
            this._isLoaded = true;
            if (!isFromLocalStorage) {
                this.saveAll();
            }
            this.trigger("profileLoaded", this);
        } else if (this._isLoaded) {
            this._isBeaconNeeded = true;
            this.saveAll();
        }
        return isLoadedDataNewer;
    }
  
    async fetchAsync() {
        let promise = new Promise((resolve, reject) => {
            this.on("profileLoaded", () => {
                resolve(this);
            });
            this.fetch(true);
        });
        let ret = await promise;
        return ret;
    }

    fetchFromLocalStorage(isPreLoad) {
        calog({ isPreLoad } , "fetchFromLocalStorage");
        let tmp = false;// localStorage.getItem( "ca_profile" );
        var data = tmp ? JSON.parse(tmp) : this.defaultData();
        if (data.time === undefined) data = this.defaultData();
        if (!isPreLoad) {
            this._isReadyForSaving = true;
        }
        this.loadData(data, true);
    }
  
    save() {
        if (this._isReadyForSaving) {
            this.updateCurrentScene();
            this._isBeaconNeeded = true;
            this.saveAll();
        }
    }
  
    saveAll() {
        /*if (this._isReadyForSaving) {
            localStorage.setItem("ca_profile", JSON.stringify(this._data));
        }*/
    }
  
    updateCurrentScene() {
        var tmpIdx = this._data.scenes.findIndex(x => x.id == this._curScene.id);
        this._curScene.time = Date.now();
        if (tmpIdx > -1) {
            this._data.scenes[tmpIdx] = this._curScene;
        } else {
            this._data.scenes.push(this._curScene);
        }
    }
  
  getScene( id ) {
    if( ! this._curScene || this._curScene.id != id ) {
      this._curScene = this._data.scenes.find( x => x.id == id ) || null;
      if( ! this._curScene ) {
        this._curScene = { id };
      }
    }
    return this._curScene;
  }
  
  getAccessNavOptions( id ) {
    let tmpItem = this.getScene( id );
    let ret = ( tmpItem && tmpItem.navOpts ) || null;
    return ret;
  }
  
  setAccessNavOptions( id , opts ) {
    let tmpItem = this.getScene( id );
    tmpItem.navOpts = opts || {};
    this.save();
  }
  
  getSceneRetargetId( id , max ) {
    let tmpItem = this.getScene( id );
    let tmpId = ( tmpItem && tmpItem.retargetId ) || null
    if( tmpId ) {
      let ct = ( tmpItem && tmpItem.retargetCt ) || 0;
      if( ct >= max ) {
        delete tmpItem.retargetId;
        delete tmpItem.retargetCt;
        tmpId = null;
      } else {
        tmpItem.retargetCt++;
      }
      this.save();
    }
    return tmpId;
  }
  
  setSceneRetargetId( id , retargetId ) {
    let tmpItem = this.getScene( id );
    tmpItem.retargetId = retargetId;
    tmpItem.retargetCt = 0;
    this.save();
  }
  
  getViewRetargetId( id , max ) {
    let tmpItem = this.getScene( id );
    let tmpId = ( tmpItem && tmpItem.retargetViewId ) || null
    if (tmpId) {
      let ct = ( tmpItem && tmpItem.retargetViewCt ) || 0;
      if( ct >= max ) {
        delete tmpItem.retargetViewId;
        delete tmpItem.retargetViewCt;
        tmpId = null;
      } else {
        tmpItem.retargetViewCt++;
      }
      this.save();
    }
    return tmpId;
  }
  
  setViewRetargetId( id , retargetId ) {
    let tmpItem = this.getScene( id );
    tmpItem.retargetViewId = retargetId;
    tmpItem.retargetViewCt = 0;
    this.save();
  }
  
  /*use a chain of retargeting*/
  /*
  getRetargetId( id , max ) {
    let tmpId
    let ret = id;
    let ct = 0;
    let retargetIdChain = [];
    this._retargetSceneStorageName = "ca_scene" + id;
    this._retargetSceneCountStorageName = "ca_scene_ct" + id;
    let lastCountStorageName = this._retargetSceneCountStorageName;
    while( tmpId = localStorage.getItem( this._retargetSceneStorageName ) ) {
      ct = parseInt( localStorage.getItem( this._retargetSceneCountStorageName ) || "0" );
      if( ct < max ) {
        ret = tmpId;
        lastCountStorageName = this._retargetSceneCountStorageName;
        retargetIdChain.push( tmpId );
        this._retargetSceneStorageName = "ca_scene" + tmpId;
        this._retargetSceneCountStorageName = "ca_scene_ct" + tmpId;
      } else {
        ret = id;
        this.clearRetargetChain( retargetIdChain.reverse() );
        lastCountStorageName = "";
        break;
      }
    }
    if( lastCountStorageName ) {
      localStorage.setItem( lastCountStorageName , ++ct );
    }
    return ret;
  }
  setRetargetScene( stageSceneId, retargetId ) {
    localStorage.setItem( this._retargetSceneStorageName , retargetId );
    localStorage.setItem( this._retargetSceneCountStorageName , 0 );
  }
  clearRetargetChain( chainIds ) {
    chainIds.forEach( id => {
      this._retargetSceneStorageName = "ca_scene" + id;
      this._retargetSceneCountStorageName = "ca_scene_ct" + id;
      localStorage.removeItem( this._retargetSceneStorageName );
      localStorage.removeItem( this._retargetSceneCountStorageName );
    });
  }
  */
}