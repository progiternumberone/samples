class CACue {
    constructor(data) {
        this._type = data.type;
        this._value = data.value;
        this._sceneId = data.sceneId;
    }
    get sceneId() {
        return this._sceneId;
    }
    /*important to define this in the extending class*/
    /**
     * determines if the cue condition is active
     * 
     * Return: false or scendId
     * */
    sceneIdIfActive() {
        return false;
    }
}