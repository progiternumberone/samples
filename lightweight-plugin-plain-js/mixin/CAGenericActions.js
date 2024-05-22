let CAGenericActions = {
    connectGenericActions() {
        var links = this.el.querySelectorAll('a:not([data-goto-scene],[data-goto])');
        links.forEach(ele => {
            ele.onclick = e => {
                var selectionValue = /*ele.value || */ele.getAttribute("title") || ele.innerText;
                ContentAccessStat.sendSelection(this._data, selectionValue);
                ContentAccessStat.sendDestinationAction(this._data, ele.getAttribute("href"));
            }
        })
    }
}