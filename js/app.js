//(function(){
	
	var App =  App || function(){
	
		// private variables and functions
		//.......
		_vars = {
			"logMsg" : ""
		};//end _vars
		
		var _init = function(){
console.log("App initialize...");
			
			_vars["gpsCoords"]={
				"latitude" : document.querySelector("#gpscoords-latitude"),
				"longitude" : document.querySelector("#gpscoords-longitude"),
				"accuracy" : document.querySelector("#gpscoords-accuracy"),
			};

			_vars["waitOverlay"] = document.querySelector("#wait");
			_vars["waitOverlay"].style.display="none";
			
			_vars["getCoord"] = document.querySelector("#get_coords");
			_vars["getCoord"].onclick = function(e){
console.log(e);

				_vars["waitOverlay"].style.display="";
				//_vars["waitOverlay"].classList.remove("close");
				_vars["waitOverlay"].classList.add("open");
				
				_handleCoordinateBtn({
					"postFunc": function( coords ){
						_vars["gpsCoords"]["latitude"].innerHTML = coords.latitude;
						_vars["gpsCoords"]["longitude"].innerHTML = coords.longitude;
						_vars["gpsCoords"]["accuracy"].innerHTML = coords.accuracy;
						// timestamp_value.innerHTML = position.timestamp;
						
						// speed_value.innerHTML = coords.speed;
						// altitude_value.innerHTML = coords.altitude;
						// altitudeAccuracy_value.innerHTML = coords.altitudeAccuracy;
						// heading_value.innerHTML = position.heading;
						
						_vars["waitOverlay"].classList.remove("open");
						//_vars["waitOverlay"].classList.add("close");
						_vars["waitOverlay"].style.display="none";
					}
				});
				
			}//end event
			
		};// end _init


		var _handleCoordinateBtn = function(opt){
			navigator.geolocation.getCurrentPosition( function (position) {
console.log( "async navigator.geolocation.getCurrentPosition ");
console.log( position);
// for(var item in position.coords){
	// console.log( item, position.coords[item] );
// }
				if( typeof opt["postFunc"] === "function"){
					opt["postFunc"]( position.coords );
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
		};//_handleCoordinateBtn
		
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

