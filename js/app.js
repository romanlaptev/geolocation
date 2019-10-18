//(function(){
	
	var App =  App || function(){
	
		// private variables and functions

		_vars = {
			"logMsg" : "",
			"ya_apiKey" : "6868d08d-fea9-41c7-8f32-f3a3a33495ed",
			//"ya_templateUrl" : "https://geocode-maps.yandex.ru/1.x/?apikey={{apiKey}}&geocode={{lng}},{{lat}}",
			"ya_templateUrl" : "https://geocode-maps.yandex.ru/1.x/?apikey={{apiKey}}&format=json&geocode={{lng}},{{lat}}",
			"google_apiKey" : "AIzaSyDit1piuzGn-N0JVzirMUcERxxWZ4DK4OI"
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
				_getAdress({
					lng: posObj.coords.longitude,
					lat: posObj.coords.latitude
				});

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
			
			_getCoordinate( success_fn, fail_fn );			
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
					zoom: 15
				}); 
console.log( "myMap:", myMap );
			}

			// ymaps.geolocation.get({
					// // Зададим способ определения геолокации    
					// // на основе ip пользователя.
					// provider: 'yandex',
					// // Включим автоматическое геокодирование результата.
					// autoReverseGeocode: true
				// })
				// .then(function (result) {
					// // Выведем результат геокодирования.
					// console.log(result.geoObjects.get(0)
						// .properties.get('metaDataProperty'));
				// });
	
			// var geolocation = ymaps.geolocation, myMap = new ymaps.Map("map", {
					// center: [ lat, lng ],
					// zoom: 15
				// }, {
					// searchControlProvider: 'yandex#search'
				// });
			
			// // Сравним положение, вычисленное по ip пользователя и
			// // положение, вычисленное средствами браузера.
			// geolocation.get({
				// provider: 'yandex',
				// mapStateAutoApply: true
			// }).then(function (result) {
				// // Красным цветом пометим положение, вычисленное через ip.
				// result.geoObjects.options.set('preset', 'islands#redCircleIcon');
				// result.geoObjects.get(0).properties.set({
					// balloonContentBody: "you location by IP"
				// });
				// myMap.geoObjects.add(result.geoObjects);
			// });

			// geolocation.get({
				// provider: 'browser',
				// mapStateAutoApply: true
			// }).then(function (result) {
				// // Синим цветом пометим положение, полученное через браузер.
				// // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
				// result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
				
				// result.geoObjects.get(0).properties.set({
					// balloonContentBody: "you location from browser data"
				// });

				// myMap.geoObjects.add(result.geoObjects);
			// });
	
			_vars["waitOverlay"].classList.remove("open");
			_vars["waitOverlay"].style.display="none";
		};//_handleMapBtn()


		var  _getCoordinate = function(success_fn, fail_fn){
			
			var opts = {
				enableHighAccuracy: true,  // high accuracy
				maximumAge: 0,  // no cache
				timeout: ( GPS_TIMEOUT_POSITION * 1000) // timeout
			};
			navigator.geolocation.getCurrentPosition(
				success_fn,
				fail_fn,
				opts);
		};//end _getCoordinate()
		
		var _getAdress = function(opt){
//console.log(opt);
			var p = {
				lng : null,
				lat : null
			};
			//extend p object
			for(var key in opt ){
				p[key] = opt[key];
			}
//console.log(p);

			// var google_map_pos = new google.maps.LatLng( p.lat, p.lng );
// console.log( google_map_pos );

			// var google_maps_geocoder = new google.maps.Geocoder();
			// google_maps_geocoder.geocode({ "latLng": google_map_pos },
				// function( results, status ) {
// console.log( results );
				// }
			// );
			
			var dataUrl = _vars["ya_templateUrl"]
			.replace( "{{apiKey}}", _vars["ya_apiKey"] )
			.replace( "{{lng}}", p["lng"] )
			.replace( "{{lat}}", p["lat"] );
//console.log( dataUrl );		
			
			_runAjaxRequest( dataUrl, __postFunc );
			
			function __postFunc( data, runtime, xhr ) {
console.log( typeof data );
console.log( data.length );
console.log( data );

_vars["logMsg"] = "ajax load url: <b>" + dataUrl + "</b>, runtime: " + runtime +" sec";
console.log( _vars["logMsg"] );
//console.log( xhr.getAllResponseHeaders() );
				_vars["requestFormat"] = xhr.getResponseHeader("content-type");
				
				if( data && data.length > 0){
					//_parseAjax( data );
				}
				
			}//end __postFunc()
			
		};//end _getAdress()
		

		var _runAjaxRequest = function( url, callback ){
			
			var xhr = new XMLHttpRequest();
			
			var timeStart = new Date();
			
			xhr.open("GET", url, true);
			
			xhr.onreadystatechange = function(){
//console.log("state:", xhr.readyState);
				if( xhr.readyState === 4){
console.log("end request, state ", xhr.readystate, ", status: ", xhr.status);
//console.log( "xhr.responseText: ", xhr.responseText );
//console.log( "xhr.responseXML: ", xhr.responseXML );

					if( xhr.status === 200){
						//ajax_content.innerHTML += xhr.responseText;
//console.log( xhr.responseText );

						//if browser not define callback "onloadend"
						var test = "onloadend" in xhr;
						if( !test ){
							_loadEnd();
						}

					}
					
					if( xhr.status !== 200){
console.log("Ajax load error, url: " + xhr.responseURL);
console.log("status: " + xhr.status);
console.log("statusText:" + xhr.statusText);

						//if browser not define callback "onloadend"
						var test = "onloadend" in xhr;
						if( !test ){
							_loadEnd();
						}
						
					}
					
				}
			};
			
			if( "onerror" in xhr ){
//console.log( "xhr.onerror = ", xhr.onerror  );
				xhr.onerror = function(e){
//console.log(arguments);
console.log("event type:" + e.type);
console.log("time: " + e.timeStamp);
console.log("total: " + e.total);
console.log("loaded: " + e.loaded);
				}
			};
			
			if( "onloadend" in xhr ){
				xhr.onloadend = function(e){
		//console.log(arguments);
//console.log("event type:" + e.type);
		// console.log("time: " + e.timeStamp);
		// console.log("total: " + e.total);
		// console.log("loaded: " + e.loaded);
					_loadEnd();
				}//end event callback
			};
			
			function _loadEnd(){
				var timeEnd = new Date();
				var runtime = (timeEnd.getTime() - timeStart.getTime()) / 1000;
				
				if( typeof callback === "function"){
					var data = xhr.responseText;
					callback( data, runtime, xhr );
				}
			}//end _loadEnd()
			
			xhr.send();
			
		};//_runAjaxRequest

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

