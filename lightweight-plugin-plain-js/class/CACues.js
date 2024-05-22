class CACues {
    constructor(data) {
        this._cues = [];
        data.forEach(c => {
            let tcue;
            eval("tcue = new CACueType_" + c.type.toLowerCase() + "(c);");
            this._cues.push(tcue);
        });
    }

    get cues() {
        return this._cues;
    }

    findActiveCue() {
        var ret = false;
        this._cues.some(c => {
            ret = c.sceneIdIfActive();
            if (ret) {
                return true;
            }
        });
        return ret;
    }
}