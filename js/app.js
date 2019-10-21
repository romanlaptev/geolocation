//(function(){
	
	var App =  App || function(){
	
		// private variables and functions

		_vars = {
			"logMsg" : "",
			"ya_apiKey" : "6868d08d-fea9-41c7-8f32-f3a3a33495ed",
			//"ya_templateUrl" : "https://geocode-maps.yandex.ru/1.x/?apikey={{apiKey}}&geocode={{lng}},{{lat}}",
"ya_templateUrl" : "https://geocode-maps.yandex.ru/1.x/?apikey={{apiKey}}&format=json&geocode={{lng}},{{lat}}&kind=district",
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

			_getCoordinates( success_fn, fail_fn );

			function success_fn( posObj ){
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
			
			function fail_fn( error ){
				var errorTypes = {
					1: "Permission denied",
					2: "Position is not available",
					3: "Request timeout"
				};
				_vars["logMsg"] = "Error code: " + error.code + ", " + errorTypes[error.code] + ", " + error.message;
console.log(error);
				func.logAlert(_vars["logMsg"], "error");
			}//end fail_fn()

			
		};//_handleCoordinateBtn()
		

		var _handleMapBtn = function(opt){

			if( !_vars["position"] ){
				_vars["waitOverlay"].classList.remove("open");
				_vars["waitOverlay"].style.display="none";
				
				_vars["logMsg"] = "Error, get coordinates first...";
				func.logAlert(_vars["logMsg"], "error");
				
				return false;
			}

//--------------------------------- yandex map API
console.log("ymaps: ", ymaps);
			
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


		var  _getCoordinates = function(success_fn, fail_fn){
//console.log(arguments);

			var opts = {
				enableHighAccuracy: true,  // high accuracy
				maximumAge: 0,  // no cache
				timeout: ( GPS_TIMEOUT_POSITION * 1000) // timeout
			};
			navigator.geolocation.getCurrentPosition(
				success_fn,
				fail_fn,
				opts);
		};//end _getCoordinates()
		
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
			
			func.runAjaxCorrect( dataUrl, __postFunc );
			
			function __postFunc( data, runtime, xhr ) {
_vars["logMsg"] = "ajax load url: <b>" + dataUrl + "</b>, runtime: " + runtime +" sec";
console.log( _vars["logMsg"] );

//console.log( xhr.getAllResponseHeaders() );
				_vars["requestFormat"] = xhr.getResponseHeader("content-type");
				if( _vars["requestFormat"].indexOf("application/xml")  !== -1 || 
						_vars["requestFormat"].indexOf("text/xml") !== -1){
//console.log( "xhr.responseXML: ", xhr.responseXML );
					data = xhr.responseXML;
				}
				
//console.log( data );
//console.log( typeof data );
//console.log( data.length );
				//if( data && data.length > 0){
					_parseAjax( data );
				//}
				
			}//end __postFunc()

			function _parseAjax( data ){
				
				if( _vars["requestFormat"].indexOf("application/xml") !== -1){
					_parseXML( data );
				}
				if( _vars["requestFormat"].indexOf("text/xml") !== -1){
					_parseXML( data );
				}
				
				if( _vars["requestFormat"].indexOf("application/json") !== -1){
					_parseJSON( data );
				}
				
			}//_parseAjax()


			function _parseXML(xml){
console.log("function _parseXML()");

_vars["xml"] = xml;

		var timeStart = new Date();

				try{
					xmlObj = func.convertXmlToObj( xml );
console.log(xmlObj);
		delete xml;
/*		
					webApp.vars["DB"]["nodes"] = _data_formNodesObj(xmlObj);
		//delete xmlObj;
					
					//_vars["hierarchyList"] = __formHierarchyList();
					//webApp.vars["loadDataRes"] = true;
		var timeEnd = new Date();
		var runTime = (timeEnd.getTime() - timeStart.getTime()) / 1000;
		webApp.vars["logMsg"] = "- convertXmlToObj(), runtime: <b>" + runTime  + "</b> sec";
		_message( webApp.vars["logMsg"], "info");
		console.log( webApp.vars["logMsg"] );
*/
				} catch(error) {
console.log( error );
_vars["logMsg"] = "convertXmlToObj(), error parse XML..." ;
func.logAlert( _vars["logMsg"], "error");
				}//end catch

			}//end _parseXML()

			
			function _parseJSON( jsonStr ){
				try{
					var jsonObj = JSON.parse( jsonStr, function(key, value) {
			//console.log( key, value );
						return value;
					});
console.log( jsonObj );
/*
					//correct departure, duration, arrival
					for( var n = 0; n < jsonObj["segments"].length; n++){
						var record = jsonObj["segments"][n];
						record["duration"] = Math.round( record["duration"] / 60);
						// if( record["duration"] > 60){
							// record["duration"] = record["duration"] / 60;
						// }
						var _d = new Date( record["departure"] );
						record["departure_day"] = _d.getDate() +" "+ func.getMonthByNameNum( _d.getMonth(), "ru" );
						var _min = _d.getMinutes();
						if( _min < 10){
							_min = "0" + _min;
						}
						record["departure_time"] = _d.getHours() +":"+_min;
						delete record["departure"];
						
						var _d = new Date( record["arrival"] );
						record["arrival_day"] = _d.getDate() +" "+ func.getMonthByNameNum( _d.getMonth(), "ru" );
						var _min = _d.getMinutes();
						if( _min < 10){
							_min = "0" + _min;
						}
						record["arrival_time"] = _d.getHours() +":"+_min;
						delete record["arrival"];
					}//next
					
					webApp.vars["DB"]["data"] = jsonObj;
*/
				} catch(error) {
_vars["logMsg"] = "error, error JSON.parse server response data...." ;
console.log( error );
func.logAlert(_vars["logMsg"],"error");
					return;
				}//end catch

			}//end _parseJSON()
			
		};//end _getAdress()
		
		

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