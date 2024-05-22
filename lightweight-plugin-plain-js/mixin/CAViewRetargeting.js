let CAViewRetargeting = {
  connectRetargets() {
    /*ignore steps as their retarget gets checked when displaying*/
    this.el.querySelectorAll('*[data-retarget]:not([data-step])').forEach( r => {
        ca_listen(r, "click", e => {
            ContentAccessProfile.setViewRetargetId(this._id, r.dataset.retarget);
            //var actionValue = r.value || r.innerText;
            //ContentAccessStat.send(this._data, "retarget", r.dataset.retarget, actionValue);
        });
    });

    this.el.querySelectorAll('a[data-retarget-scene],button[data-retarget-scene],img[data-retarget-scene]').forEach(r => {
        ca_listen(r, "click", e => {
            ContentAccessProfile.setSceneRetargetId(this._stage.stageSceneId, r.dataset.retargetScene);
            //var actionValue = r.value || r.innerText;
            //var tmpData = { ...this._data };
            //tmpData.id = r.dataset.retargetScene;
            //ContentAccessStat.send(tmpData, "retarget", r.dataset.retarget, actionValue);
        });
    });
  }
}