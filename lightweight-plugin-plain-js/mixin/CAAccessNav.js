let CAAccessNav = {
    connectSmartNavSelects() {
        /* find needed elements for SmartNav DDLs */
        var option1Ele = this.el.querySelector("#" + this._data.cliSettings.option1ElementId);
        if (option1Ele) {
            if (option1Ele && !this._data.cliSettings.option1DefaultText) this._data.cliSettings.option1DefaultText = option1Ele.children[0].innerHTML;
            var option2Ele = this.el.querySelector("#" + this._data.cliSettings.option2ElementId);
            if (option2Ele && !this._data.cliSettings.option2DefaultText) this._data.cliSettings.option2DefaultText = option2Ele.children[0].innerHTML;
            this._buttonEle = null;
            if (this._data.cliSettings.buttonElementId) {
                this._buttonEle = this.el.querySelector("#" + this._data.cliSettings.buttonElementId);
            } else if (this.el.getElementsByClassName("codex-submit").length > 0) {
                this._buttonEle = this.el.getElementsByClassName("codex-submit")[0];
            } else if (this.el.getElementsByClassName("finder-submit").length > 0) {
                this._buttonEle = this.el.getElementsByClassName("finder-submit")[0];
            } else {
                throw ("CA Scene: specified element with id of \"" + this._data.cliSettings.el + "\" does have a submit button that can be listened to.");
            }

            option1Ele.innerHTML = "";
            var programTypeOptions = '<option value="">' + this._data.cliSettings.option1DefaultText + '</option>';
            for (var key in this._data.optionsMap) {
                programTypeOptions += '<option value="' + key + '">' + key + '</option>';
            }
            option1Ele.innerHTML = programTypeOptions;
            if (option2Ele) option2Ele.innerHTML = '<option value="">' + this._data.cliSettings.option2DefaultText + '</option>';

            /*listen to option 1 changes*/
            ca_listen(option1Ele, "change", (e) => { this._typeChange(e, option2Ele); });
            if (option2Ele) ca_listen(option2Ele, "change", (e) => { this._fieldChange(e, option1Ele); });
            /*find and listen to button*/
            ca_listen(this._buttonEle, "click", (e) => { this._accessNavSubmit(e, option1Ele.value, option2Ele ? option2Ele.value : ""); });

            this._checkProfileForSmartNav(ContentAccessProfile, option1Ele);
            ContentAccessProfile.on("profileLoaded", (profile) => this._checkProfileForSmartNav(profile, option1Ele));
        }
    },

    _checkProfileForSmartNav(profile, option1Ele) {
        if (ContentAccessProfile.isLoaded) {
            this._profileOpts = ContentAccessProfile.getAccessNavOptions(this._id) || {};
            if (this._profileOpts.opt1) {
                option1Ele.value = this._profileOpts.opt1;
                option1Ele.dispatchEvent(new Event('change'));
            }
        } else {
            this._profileOpts = {};
            /*this will run _checkProfileForSmartNav if profile is not yet loaded*/
            //ContentAccessProfile.on("profileLoaded", (profile) => this._checkProfileForSmartNav(profile, option1Ele));
        }
    },

    /* interaction handlers */
    _fieldChange(e, ele) {
        let opt1 = ele.value;
        let opt2 = e.target.value;
        if ((!this._profileOpts.opt1 || this._profileOpts.opt1 != opt1 || !this._profileOpts.opt2 || this._profileOpts.opt2 != opt2)) {
            this._profileOpts.opt1 = opt1;
            this._profileOpts.opt2 = opt2;
            ContentAccessStat.sendAccessNavStat(this._data, opt1, opt2, "");
            ContentAccessProfile.setAccessNavOptions(this._id, this._profileOpts);
        }
        let link = this._getAccessNavLink(opt1, opt2);
        this._toggleSubmitButton(link);
    },

    _typeChange(e, ele) {
        if (ele) ele.innerHTML = "";
        let opt1 = e.target.value;
        if (!this._profileOpts.opt1 || this._profileOpts.opt1 != opt1) {
            this._profileOpts.opt1 = opt1;
            this._profileOpts.opt2 = "";
            ContentAccessStat.sendAccessNavStat(this._data, opt1, "", "");
            ContentAccessProfile.setAccessNavOptions(this._id, this._profileOpts);
        }
        var programFieldOptions = '<option value="">' + this._data.cliSettings.option2DefaultText + '</option>';
        for (var i = 0; i < this._data.optionsMap[opt1].length; i++) {
            let val = this._data.optionsMap[opt1][i];
            programFieldOptions += '<option value="' + val + '">' + val + '</option>';
        }
        if (ele) ele.innerHTML = programFieldOptions;
        if (ele && this._profileOpts.opt2) {
            ele.value = this._profileOpts.opt2;
            ele.dispatchEvent(new Event('change'));
        } else {
            /*dis/enable submit button*/
            let link = this._getAccessNavLink(opt1, "");
            this._toggleSubmitButton(link);
        }
    },

    _toggleSubmitButton(show) {
        this._buttonEle.disabled = !show;
    },

    _getAccessNavLink(type, field) {
        let ret = null;
        if (type != "") {
            let key = type + (field ? " " : "") + field;
            if (typeof this._data.linksMap[key] != "undefined") {
                ret = this._data.linksMap[key];
            }
        }
        return ret;
    },

    _accessNavSubmit(e, type, field) {
        e.preventDefault();
        let link = this._getAccessNavLink(type, field);
        if (link) {
            ContentAccessStat.sendAccessNavStat(this._data, type, field, link);
            var tmp = link.replaceAll("&amp;", "&");
            //if (confirm(tmp)) {
                window.top.location = tmp;
            //}
        }
    }
}