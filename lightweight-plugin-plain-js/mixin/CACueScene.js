let CACueScene = {
    connectCueScene(data) {
        this._cues = new CACues(data);
        let cuedId = this._cues.findActiveCue();
        if (cuedId) {
            this._stage.toggleScene({ id: cuedId });
        } else {
            this._stage.clear();
        }
    }
}