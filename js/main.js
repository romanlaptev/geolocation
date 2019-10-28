//console.log("module sharedFunc:", typeof sharedFunc, sharedFunc);
var func = sharedFunc();
//console.log("func:", func);

	var support = false;
	var logMsg;

window.onload = function(){

	logMsg = navigator.userAgent;
	func.logAlert(logMsg, "info");

//------------------ left menu, SNAP-BOX
	var snapper = new Snap({
		element: document.getElementById("appContainer")
	});
  
	addEvent(document.getElementById('open-left'), 'click', function(){
		//snapper.open('left');
//console.log( snapper.state().state );
		( snapper.state().state == "closed")? snapper.open("left"): snapper.close();
	});
  
	addEvent(document.getElementById("btn-close-drawer-left"), 'click', function(){
		snapper.close();
	});
  
//	addEvent(document.getElementById('or'), 'click', function(){
		//snapper.open('right');
//console.log( snapper.state().state );
		//( snapper.state().state == "closed")? snapper.open("right"): snapper.close();
	//});
  
/* Prevent Safari opening links when viewing as a Mobile App */
/*  
(function (a, b, c) {
    if(c in b && b[c]) {
        var d, e = a.location,
            f = /^(a|html)$/i;
        a.addEventListener("click", function (a) {
            d = a.target;
            while(!f.test(d.nodeName)) d = d.parentNode;
            "href" in d && (d.href.indexOf("http") || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href)
        }, !1)
    }
})(document, window.navigator, "standalone");
*/  
//----------------------
  
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


function addEvent(element, eventName, func) {
	if (element.addEventListener) {
    	return element.addEventListener(eventName, func, false);
    } else if (element.attachEvent) {
        return element.attachEvent("on" + eventName, func);
    }
};


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

