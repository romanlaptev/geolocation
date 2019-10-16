//(function(){
	
	var App =  App || function(){
	
		// private variables and functions

		_vars = {
			"logMsg" : ""
		};//end _vars

		const GPS_TIMEOUT_POSITION = 300; //(sec) time that is allowed to end finding position		
		
		var _init = function(){
//console.log("App initialize...");
			
			_vars["gpsCoords"]={
				"latitude" : document.querySelector("#latitude"),
				"longitude" : document.querySelector("#longitude"),
				"accuracy" : document.querySelector("#accuracy"),
				"datetime" : document.querySelector("#datetime"),
				"altitude" : document.querySelector("#altitude"),
				"altitudeAccuracy" : document.querySelector("#altitude-accuracy"),
				"heading" : document.querySelector("#heading"),
				"speed" : document.querySelector("#speed")
			};

			_vars["waitOverlay"] = document.querySelector("#wait");
			_vars["waitOverlay"].style.display="none";

//-----------------------------------------
			_vars["btnGetCoord"] = document.querySelector("#get_coords");
			_vars["btnGetCoord"].onclick = function(e){
//console.log(e);
				_vars["waitOverlay"].style.display="";
				//_vars["waitOverlay"].classList.remove("close");
				_vars["waitOverlay"].classList.add("open");
				_handleCoordinateBtn();
			}//end event
//-----------------------------------------
			
		};// end _init

		_getDateTime = function( timestamp ){
			var now = new Date( timestamp );
			_cDate = func.timeStampToDateStr(now);
//console.log(now, _cDate);
			return _cDate;
		};//end _getDateTime()
		
		
		var _handleCoordinateBtn = function(){

			var success_fn = function(posObj){
console.log( "async navigator.geolocation.getCurrentPosition ");
console.log( posObj);
// for(var item in posObj.coords){
	// console.log( item, posObj.coords[item] );
// }
				_vars["gpsCoords"]["latitude"].innerHTML = posObj.coords.latitude;
				_vars["gpsCoords"]["longitude"].innerHTML = posObj.coords.longitude;
				_vars["gpsCoords"]["accuracy"].innerHTML = posObj.coords.accuracy;
				_vars["gpsCoords"]["datetime"].innerHTML = _getDateTime( posObj.timestamp );
				
				_vars["gpsCoords"]["altitude"].innerHTML = posObj.coords.altitude;
				_vars["gpsCoords"]["altitudeAccuracy"].innerHTML = posObj.coords.altitudeAccuracy;
				_vars["gpsCoords"]["heading"].innerHTML = posObj.coords.heading;
				_vars["gpsCoords"]["speed"].innerHTML = posObj.coords.speed;
				
				_vars["waitOverlay"].classList.remove("open");
				//_vars["waitOverlay"].classList.add("close");
				_vars["waitOverlay"].style.display="none";
			}//end success_fn()
			
			var fail_fn = function(error){
				var errorTypes = {
					1: "Permission denied",
					2: "Position is not available",
					3: "Request timeout"
				};
				_vars["logMsg"] = "Error code: " + error.code + ", " + errorTypes[error.code] + ", " + error.message;
console.log(error);
				func.logAlert(_vars["logMsg"], "error");
			}//end fail_fn()
			
			_getGPSCoordinate( success_fn, fail_fn );			
		};//_handleCoordinateBtn()
		

		var  _getGPSCoordinate = function(success_fn, fail_fn){
			
			var opts = {
				enableHighAccuracy: true,  // high accuracy
				maximumAge: 0,  // no cache
				timeout: ( GPS_TIMEOUT_POSITION * 1000) // timeout
			};
			navigator.geolocation.getCurrentPosition(
				success_fn,
				fail_fn,
				opts);
			
/*			
			navigator.geolocation.getCurrentPosition( function (position) {
console.log( "async navigator.geolocation.getCurrentPosition ");
console.log( position);
// for(var item in position.coords){
	// console.log( item, position.coords[item] );
// }
				if( typeof opt["postFunc"] === "function"){
					opt["postFunc"]( position );
				}
				
			}, function (error){
				var errorTypes = {
					1: "Permission denied",
					2: "Position is not available",
					3: "Request timeout"
				};
				_vars["logMsg"] = "Error code: " + error.code + ", " + errorTypes[error.code] + ", " + error.message;
console.log(error);
				func.logAlert(_vars["logMsg"], "error");
			});
*/			
		};//end _getGPSCoordinate()
		
		// public interfaces
		return {
			vars:	_vars,
			init:	_init
			//get_content: function( params ){ 
				//return get_content( params ); 
			//}
		};
		
	};//end App
	
//window.App = App;
//})();

