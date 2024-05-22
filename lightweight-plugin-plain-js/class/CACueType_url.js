class CACueType_url extends CACue {
    constructor(data) {
        super(data);
    }

    sceneIdIfActive() {
        return this._value.split(",").filter( x => window.location.href.indexOf( x.trim() ) > -1 ).length > 0 && this._sceneId;
    }
}