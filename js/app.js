//(function(){
	
	var App =  App || function(){
	
		// private variables and functions

		_vars = {
			"logMsg" : ""
		};//end _vars

		const GPS_TIMEOUT_POSITION = 300; //(sec) time that is allowed to end finding position		
		
		var _init = function(){
//console.log("App initialize...");
			
			_vars["htmlObj"]={
				"latitude" : document.querySelector("#latitude"),
				"longitude" : document.querySelector("#longitude"),
				"accuracy" : document.querySelector("#accuracy"),
				"datetime" : document.querySelector("#datetime"),
				"altitude" : document.querySelector("#altitude"),
				"altitudeAccuracy" : document.querySelector("#altitude-accuracy"),
				"heading" : document.querySelector("#heading"),
				"speed" : document.querySelector("#speed"),
				"addresText": document.querySelector("#adrtext")
			};

			_vars["waitOverlay"] = document.querySelector("#wait");
			_vars["waitOverlay"].style.display="none";

//-----------------------------------------
			_vars["btnGetCoord"] = document.querySelector("#get-coords");
			_vars["btnGetCoord"].onclick = function(e){
//console.log(e);
				_vars["waitOverlay"].style.display="";
				//_vars["waitOverlay"].classList.remove("close");
				_vars["waitOverlay"].classList.add("open");
				_handleCoordinateBtn();
			}//end event
//-----------------------------------------
			_vars["btnShowMap"] = document.querySelector("#show-map");
			_vars["btnShowMap"].onclick = function(e){
//console.log(e);
				_vars["waitOverlay"].style.display="";
				//_vars["waitOverlay"].classList.remove("close");
				_vars["waitOverlay"].classList.add("open");
				_handleMapBtn();
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
//console.log( posObj);
// for(var item in posObj.coords){
	// console.log( item, posObj.coords[item] );
// }
				_vars["htmlObj"]["latitude"].innerHTML = posObj.coords.latitude;
				_vars["htmlObj"]["longitude"].innerHTML = posObj.coords.longitude;
				_vars["htmlObj"]["accuracy"].innerHTML = posObj.coords.accuracy;
				_vars["htmlObj"]["datetime"].innerHTML = _getDateTime( posObj.timestamp );
				
				_vars["htmlObj"]["altitude"].innerHTML = posObj.coords.altitude;
				_vars["htmlObj"]["altitudeAccuracy"].innerHTML = posObj.coords.altitudeAccuracy;
				_vars["htmlObj"]["heading"].innerHTML = posObj.coords.heading;
				_vars["htmlObj"]["speed"].innerHTML = posObj.coords.speed;
				
				_vars["position"] = posObj;
				
				//get address
				// _getGPSAdress({
					// lng: posObj.coords.longitude,
					// lat: posObj.coords.latitude//,
					// //isWait: false
				// });

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
		

		var _handleMapBtn = function(opt){

//--------------------------------- yandex map API
console.log("ymaps: ", ymaps);

			if( !_vars["position"] ){
				_vars["waitOverlay"].classList.remove("open");
				_vars["waitOverlay"].style.display="none";
				return false;
			}
			
			var lat = _vars["position"]["coords"].latitude.toFixed(5);// 55.03146
			var lng = _vars["position"]["coords"].longitude.toFixed(5);// 82.92317
console.log( lat, lng );
			
			ymaps.ready(init);
			function init(){ 
				var myMap = new ymaps.Map("map", {
					//center: [55.76, 37.64],
					center: [ lat, lng],
					zoom: 7
				}); 
			}
			_vars["waitOverlay"].classList.remove("open");
			_vars["waitOverlay"].style.display="none";
		};//_handleMapBtn()



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
		};//end _getGPSCoordinate()
		
		var _getGPSAdress = function(opt){
//console.log(opt);
			var p = {
				lng : null,
				lat : null//,
				//isWait : true
			};
			//extend p object
			for(var key in opt ){
				p[key] = opt[key];
			}
console.log(p);

//https://geocode-maps.yandex.ru/1.x/?geocode=27.525773,53.89079
//https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/geocode-docpage/

			// var google_map_pos = new google.maps.LatLng( p.lat, p.lng );
// console.log( google_map_pos );

			// var google_maps_geocoder = new google.maps.Geocoder();
			// google_maps_geocoder.geocode({ "latLng": google_map_pos },
				// function( results, status ) {
// console.log( results );
				// }
			// );

			// var _wrapLatLng = function(lat, lng){
				// //if(_fake_gps){
					// //return {lat:56.961462, lng:24.139792, lat5:56.96146, lng5:24.13979};
				// //}else{
					// return {lat: lat, lng: lng, lat5: lat.toFixed(5), lng5: lng.toFixed(5)};
				// //}
			// };//_wrapLatLng
			
		};//end _getGPSAdress()
		
		
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

