const USE_CLOUD = true;
const IS_LOCAL = window.location.href.indexOf("http://localhost") > -1;
var contentAccessPage;
var ContentAccessProfile = new CAProfile();
var ContentAccessStat = new CAStat();
Object.assign(CAScene.prototype, CAViewRetargeting);
Object.assign(CAScene.prototype, CAViewToggle);
Object.assign(CAScene.prototype, CASceneSwitch);
Object.assign(CAScene.prototype, CAAccessNav);
Object.assign(CAScene.prototype, CASceneOfScenesMixin);
Object.assign(CAScene.prototype, CAEventer);
Object.assign(CAScene.prototype, CACueScene);
Object.assign(CAScene.prototype, CAGenericActions);
Object.assign(CAProfile.prototype, CAEventer);