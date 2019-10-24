//console.log("module sharedFunc:", typeof sharedFunc, sharedFunc);
var func = sharedFunc();
console.log("func:", func);

	var support = false;
	var logMsg;

window.onload = function(){

	logMsg = navigator.userAgent;
	func.logAlert(logMsg, "info");

	//left menu
	var snapper = new Snap({
		element: document.getElementById("appContainer");
	});
	addEvent( document.getElementById("open-left"), "click", function(){
		snapper.open("left");
	});

	defineEvents();

	//--------------------------
	var test =  typeof navigator.geolocation !== "undefined";
	logMsg = "navigator.geolocation support: " + test;
	if ( test ) {
		func.logAlert(logMsg, "success");
		support = true;
	} else {
		func.logAlert(logMsg, "danger");
	}
	
	//--------------------------
	if( window.location.protocol !== "https:"){
		support = false;
		logMsg = "error, <b>navigator.geolocation</b> requires <b>'https:'</b> protocol....";
		func.logAlert( logMsg, "error" );
	} else {
		support = true;
	}

//for test
support = true;

	//Start webApp
	if( support ){
		_runApp();
	}

	function _runApp(){
		var _app = App();
console.log("_app:", _app);
		_app.init();
	}//end _runApp()

};//end window.load



function defineEvents(){

	var btn_clear_log = func.getById("btn-clear-log");
	btn_clear_log.onclick = function( event ){
//console.log("click...", e);			
		event = event || window.event;
		var target = event.target || event.srcElement;
		if (event.preventDefault) { 
			event.preventDefault();
		} else {
			event.returnValue = false;				
		}
		log.innerHTML = "";
	};//end event

}//end defineEvents()

var addEvent = function addEvent(element, eventName, func) {
	if (element.addEventListener) {
		return element.addEventListener(eventName, func, false);
	} else if (element.attachEvent) {
		return element.attachEvent("on" + eventName, func);
	}
};
