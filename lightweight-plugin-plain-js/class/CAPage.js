class CAPage {
    constructor() {
        this._scripts = document.querySelectorAll('script[data-scene]');
        /*check for older versions may get rid of this*/
        if (this._scripts == null || this._scripts.length == 0)
            this._scripts = document.querySelectorAll('script[data-codexid]');
        if (this._scripts == null || this._scripts.length == 0)
            this._scripts = document.querySelectorAll('script[data-cffinderid]');
        this._stageIds = [];
        this._stages = [];
    }

    get stages() {
        return this._stages;
    }

    load() {
        calog(this._stages, "CAPage->load");
        this._scripts.forEach(script => {
            let scriptStageIds = script.getAttribute("data-scene") ? script.getAttribute("data-scene").split(",")
                : script.getAttribute("data-codexid") ? script.getAttribute("data-codexid").split(",")
                    : script.getAttribute("data-cffinderid").split(",");
            let scriptTheme = script.getAttribute("data-theme") || "";
            scriptStageIds.forEach(id => {
                this._stageIds.push(id);
                this._stages.push(new CAStage({ id, script, theme: scriptTheme }));
                this._stages[this._stages.length - 1].load();
            });
        });
    }
}