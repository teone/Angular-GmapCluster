'use strict';

var app = angular.module('storylabApp');

app.directive('googleMaps', function () {
    return {
      	template: '<div>{{googleMarkers}}</div>',
      	replace: true,
      	restrict: 'A',
      	scope: {
		    center: "=",        // Center point on the map
		    markers: "=",       // Array of map markers
		    mybound: "=",
		    options: "=",
		    width: "@",         // Map width in pixels.
		    height: "@",        // Map height in pixels.
		    zoom: "@",          // Zoom level (from 1 to 25).
		    mapTypeId: "@",      // roadmap, satellite, hybrid, or terrain
		    cluster: "@",
		    clusteropt: "=",
		    callback: "&",
		    icon: "@"
		  },
    	link: function (scope, element, attrs) {
			var toResize, toCenter;
			var map;
			var currentMarkers;
			


			// listen to changes in scope variables and update the control
			var arr = ["width", "height", "markers", "mapTypeId"];
			for (var i = 0, cnt = arr.length; i < arr.length; i++) {
			    scope.$watch(arr[i], function () {
			    	if (--cnt <= 0)
			        	updateControl();
			    });
			}

			// update zoom and center without re-creating the map
			scope.$watch("zoom", function () {
			    if (map && scope.zoom)
			      map.setZoom(scope.zoom * 1);
			});
			scope.$watch("center", function () {
			    if (map && scope.center)
			    map.setCenter(getLocation(scope.center));
			});
			/*scope.$watch("mybound", function () {
			    if (map && scope.mybound){
			    	map.fitBounds(scope.mybound);
			    	console.log(scope.mybound);
			    }
			    	
			});*/

			function updateControl () {
				// get map options
				var options = {
				    center: new google.maps.LatLng(40, -73),
				    zoom: 10,
				    mapTypeId: "roadmap"
				};
				if (scope.center) options.center = getLocation(scope.center);
				if (scope.zoom) options.zoom = scope.zoom * 1;
  				if (scope.mapTypeId) options.mapTypeId = scope.mapTypeId;

  				map = new google.maps.Map(element[0], scope.options);

  				updateMarkers();
			}

			// convert current location to Google maps location
            function getLocation(loc) {
                if (loc == null) return new google.maps.LatLng(40, -73);
                if (angular.isString(loc)) loc = scope.$eval(loc);
                return new google.maps.LatLng(loc.lat, loc.lon);
            }

            // update map markers to match scope marker collection
            function updateMarkers() {
                if (map && scope.markers) {
                	
                	

                    // clear old markers
                    if (currentMarkers != null) {
                        for (var i = 0; i < currentMarkers.length; i++) {
                            currentMarkers[i] = m.setMap(null);
                        }
                    }
                    var markers = scope.markers;
                    if(!scope.cluster || scope.cluster == "false"){
                    	// create new markers
	                    currentMarkers = [];
	                    
	                    /*if (angular.isString(markers)) markers = scope.$eval(scope.markers);*/
	                    for (var i = 0; i < markers.length; i++) {
	                        var m = markers[i];
	                        var loc = new google.maps.LatLng(m.latitude, m.longitude);
	                        var marker = new google.maps.Marker({ position: loc, map: map, title: m.name, id: m.id, icon: scope.icon });
	                        currentMarkers.push(marker);
	                        scope.mybound.extend(loc);

	                        //bind Click
	                        if(scope.callback)
				          		addListener(marker, m);
	                    }
                    }
                    else{
                    	console.log("cluster: "+scope.cluster);
                    	var currentMarkers = [];
				        for (var i = 0; i < markers.length; i++) {
				          var m = markers[i];
	                      var loc = new google.maps.LatLng(m.latitude, m.longitude);
				          var marker = new google.maps.Marker({position: loc, title: m.name, icon: scope.icon});
				          currentMarkers.push(marker);
				          scope.mybound.extend(loc);

				          //bind Click
				          if(scope.callback)
				          	addListener(marker, m);
				        }
				        if(currentMarkers.length > 0)
				        	var markerCluster = new MarkerClusterer(map, currentMarkers, scope.clusteropt);
                    }

                    map.fitBounds(scope.mybound);
                    
                }
            }

            function addListener(marker, m){
            	google.maps.event.addListener(marker, 'click', function() {
				          	console.log(m.id);
				          	console.log(scope.callback);
						    scope.callback({id: m.id});
						    console.info('aaa');
						  });
            }

	    }
	};
});
