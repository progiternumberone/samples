document.addEventListener("DOMContentLoaded", function() {
    startContentAccess();
});

window.startContentAccess = function(isPreview) {
    if (contentAccessPage == null || isPreview) {
        contentAccessPage = new CAPage();
        calog(contentAccessPage, "startContentAccess");
        if (USE_CLOUD) {
            if (true || isPreview) {
                //load profile and scene(s)
                if (!isPreview) {
                    ContentAccessProfile.fetch();
                    //ContentAccessProfile.fetchFromLocalStorage();
                }
                contentAccessPage.load();
            } else {
                //load profile then scene(s)
                ContentAccessProfile.fetchAsync().then(data => {
                    contentAccessPage.load();
                }).catch(err => {
                    console.log("fetch error", err);
                    contentAccessPage.load();
                });
            }
        }
    }
}