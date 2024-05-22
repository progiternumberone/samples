let CASceneOfScenesMixin = {
    setSceneIdx(tmpId) {
        let idx = tmpId ? this._children.findIndex(x => x._id === tmpId) : 0;
        this._sceneIdx = idx === -1 ? 0 : idx;
        /*if the retarget id is not one of this scene-of-scenes' scenes, then it must be a retarget to an unconnected scene*/
        return idx !== -1;
    },
    getCurrentSceneId() {
        return this._children[this._sceneIdx]._id;
    },
  
    showScene() {
        if (this._lastSceneOfScenesShown !== this._sceneIdx) {
            this._children[this._sceneIdx].load();
        }
        this._lastSceneOfScenesShown = this._sceneIdx;

    },
  
  nextScene() {
    if( ++this._sceneIdx >= this._children.length ) this._sceneIdx = 0;
    this.showScene();
  }
}