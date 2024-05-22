window.ca_listen = function ( ele , eventName, handler ) {
  if( document.addEventListener ) {
    ele.addEventListener( eventName , handler );
  } else if( document.attachEvent ) {
    ele.attachEvent( eventName , handler );
  }
}

var showcalog = window.location.href.indexOf("calog=1") > -1 || window.location.href.indexOf("debug=1") > -1;
window.calog = function ( x , label ) {
    if (showcalog) {
        console.log(label, x);
    }
}


/* old call back handler to pass into new callback handler */
/* will only work with single instance per page */
var global_scene_id;
window.ca_codex_callback = function(data) {
  eval( 'ca_codex_callback' + global_scene_id.replace( /[^a-z0-9]/g , "" ) + '(data);' );
}
window.cfFinderCallback = function(data) {
  eval( 'cfFinderCallback' + global_scene_id.replace( /[^a-z0-9]/g , "" ) + '(data);' );
}