let CASceneSwitch = {
  connectSceneSwitch() {
    var gotoScenes = this.el.querySelectorAll( 'a[data-goto-scene],button[data-goto-scene],img[data-goto-scene]' )
    gotoScenes.forEach( ele => {
      ele.onclick = e => {
        e.preventDefault();
        var selectionValue = ele.value || ele.getAttribute( "title" ) || ele.innerText;
        ContentAccessStat.sendSelection(this._data, selectionValue);
        if (ele.dataset.gotoScene.toLowerCase() == "next" ) {
          if( this._parent ) {
            ContentAccessStat.sendSceneAction(this._data, this._parent.getCurrentSceneId());
            this._parent.nextScene();
            ContentAccessProfile.setSceneRetargetId(this._id, this._children[this._sceneIdx]._id)
          } else {
            console.error( 'ContentAccess Scene Error: trying to go to next scene when parent scene is missing.' );
          }
        } else {
          /*click action retargets are set with connectRetargets mixin*/
          if (ele.dataset.retargetScene === undefined) {
            /*use single retarget record tied to first scene (stage)*/
            ContentAccessProfile.setSceneRetargetId(this._stage.stageSceneId, ele.dataset.gotoScene)
            //ContentAccessProfile.setRetargetScene( this._stage.stageSceneId , ele.dataset.gotoScene )
          }
          /*use a chain of retargeting*/
          //ContentAccessProfile.setRetargetScene( this_id , ele.dataset.gotoScene )

          ContentAccessStat.sendSceneAction(this._data, ele.dataset.gotoScene);
          this._stage.toggleScene({ id: ele.dataset.gotoScene } )
        }
      }
    })
  }
}