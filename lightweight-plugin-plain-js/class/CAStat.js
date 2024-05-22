class CAStat {
    constructor() {
        this._timezone = new Date().getTimezoneOffset();
    }
    get endpoint() {
        //return IS_LOCAL ? "http://localhost:3005/statEvent" : "https://6cu9dm1bl7.execute-api.us-east-1.amazonaws.com/prod/statEvent";
        return "https://stat.contentaccess.com/beacon?x=" + Date.now();
    }

    _send(sceneId, event, name, strVal, intVal, floatVal, lati, longi) {
        fetch(this.endpoint, {
            method: "POST",
            headers: {
                "event": event,
                "page": window.location.href,
                "clientid": ContentAccessProfile.ID,
                "itemid": sceneId,
                "custom_metric_name": name || "-",
                "custom_metric_string_value": strVal || "-",
                "custom_metric_int_value": intVal || "-",
                "custom_metric_float_value": floatVal || "-"
            },
            body: "",
            keepalive: true
        });
    }

    send(SceneData, event, name, strVal, intVal, floatVal) {
        if (!SceneData.cliSettings.noStats) {
            SceneData.time = new Date().getTime();
            calog(SceneData, "CAStat->send");
            if (SceneData.cliSettings.enableGeolocation && navigator.geolocation) {
                var self = this;
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        self._send(SceneData.id, event, name, strVal, intVal, floatVal, position.coords.latitude, position.coords.longitude);
                    },
                    function (error) {
                        if (error.code == error.PERMISSION_DENIED) {
                            self._send(SceneData.id, event, name, strVal, intVal, floatVal, 0, 0);
                        }
                    });
            } else {
                this._send(SceneData.id, event, name, strVal, intVal, floatVal);
            }
        }
    }

    sendView(SceneData) {
        ContentAccessStat.send(SceneData, "view", "", "");
    }

    sendSelection(SceneData, value) {
        ContentAccessStat.send(SceneData, "selection", "opt1", value);
        /*send just opt when report is connected to that value*/
        //ContentAccessStat.send(SceneData, "selection", "opt", value);
    }

    sendDestinationAction(SceneData, destination) {
        ContentAccessStat.send(SceneData, "action", "destination", destination);
    }

    sendSceneAction(SceneData, sceneId) {
        ContentAccessStat.send(SceneData, "action", "scene", sceneId);
    }

    sendAccessNavStat(SceneData, type, field, destination) {
        var selection = destination || field || type || false;
        var event = destination ? "action" : "selection";// selection ? "selection" : "view";
        var metricName = type && !field && !destination ? "opt1"
            : type && field && !destination ? "opt2"
                : destination ? "destination"
                    : "-";
        this.send(SceneData, event, metricName, selection);
    }

    sendLoadTime(sceneId, loadTime) {
        this._send(sceneId, "load", "scene_load_time", null, loadTime);
    }
}