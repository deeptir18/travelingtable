
      var map;
      var currentID;
      function initialize() {
        
         //var locations = [];
        var new_locations = [];
        var mapArea = document.getElementById('map');
        var mapOptions = {
          center: new google.maps.LatLng(42.3598, -71.0921),
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
    		  minZoom: 3,
    		  maxZoom:7,
    		  mapTypeControl: false,
    		  streetViewControl: false,
    		  zoomControl: false,
    		  panControl: false,
          //v:2.184,
          styles: [

            {
              "featureType": "landscape.natural",
              "elementType": "geometry.fill",
              "stylers": [
                { "color": "#f5f5f2" },
                { "visibility": "on" }
              ]
            },{
              "featureType": "poi",
              "stylers": [
                { "visibility": "off" }
              ]
            },{
                  "featureType": "poi.park",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "visibility": "on"
                      },
                      {
                          "color": "#9BE4C4"
                      }
                  ]
              },{
              "featureType": "transit",
              "stylers": [
                { "visibility": "off" }
              ]
            },{
              "featureType": "landscape.man_made",
              "elementType": "geometry.fill",
              "stylers": [
                { "color": "#ffffff" },
                { "visibility": "on" }
              ]
            },{
              "featureType": "road.arterial",
              "stylers": [
                { "visibility": "simplified" },
                { "color": "#fee379" }
              ]
            },{
              "featureType": "road.highway",
              "elementType": "labels.icon",
              "stylers": [
                { "visibility": "off" }
              ]
            },{
              "featureType": "landscape",
              "stylers": [
                { "color": "#F7F8FF" }
              ]
            },{
              "featureType": "road",
              "stylers": [
                { "color": "#ffffff" }
              ]
            },{
              "featureType": "water",
              "stylers": [
                { "color": "#A9D5F1" }
              ]
            },{
              "featureType": "landscape",
              "stylers": [
                { "visibility": "off" }
              ]
            },
          ],

      }
		
      var map = new google.maps.Map(mapArea, mapOptions);

      google.maps.event.addListener(map, 'idle', function()  {
            console.log('function refreshmap called')
            //console.log(locations)
          // get edges
          var edges = map.getBounds();
          console.log(edges);
          var left_coord = edges.getSouthWest().lng();
          var top_coord = edges.getNorthEast().lat();
          var right_coord = edges.getNorthEast().lng();
          var bottom_coord = edges.getSouthWest().lat();
          console.log('got all the edges');
          console.log(left_coord, top_coord, right_coord, bottom_coord);

          //ajax post edges
            $.ajax({
                type: "POST",
                url: "/findMarkers",
                data: '&left_coord='+left_coord+'&top_coord='+top_coord+'&right_coord='+right_coord+'&bottom_coord='+bottom_coord,
                success: function(data) {
                  console.log('recieving the data of markers');
                  console.log(data.new_markers)
                  new_locations = data.new_markers
                }
          });



          //iterate through them if within bounds, and not already in locations (already loaded) markers, then display
          //append to locations
          var setMarkers = function(locObj) {
              $.each(locObj, function (index, loc) {
                    console.log(loc)
                  
                      loc.marker = new google.maps.Marker({
                          position: new google.maps.LatLng(loc[1], loc[2]),
                          map: map,
                          customInfo: loc[0]
                      });

                      setListener(loc.marker);
                     
                      //Remember loc in the `locations` so its info can be displayed and so its marker can be deleted.
                      //locations.push(loc[0]);
                  
           });
           }

          setMarkers(new_locations); //Create markers from the initial dataset served with the document.
          //ajaxObj.get(); //Start the get cycle.
        });




       setInterval(function(){ 
    
      google.maps.event.addDomListener(map, 'load', function()  {
            console.log('function refreshmap called')
            //console.log(locations)
          var edges = map.getBounds();
          console.log(edges);
          var left_coord = edges.getSouthWest().lng();
          var top_coord = edges.getNorthEast().lat();
          var right_coord = edges.getNorthEast().lng();
          var bottom_coord = edges.getSouthWest().lat();
          console.log('got all the edges');
          console.log(left_coord, top_coord, right_coord, bottom_coord);
          //ajax post edges
            $.ajax({
                type: "POST",
                url: "/findMarkers",
                data: '&left_coord='+left_coord+'&top_coord='+top_coord+'&right_coord='+right_coord+'&bottom_coord='+bottom_coord,
                success: function(data) {
                  console.log('recieving the data of markers');
                  console.log(data.new_markers)
                  new_locations = data.new_markers
                }
          });
          var setMarkers = function(locObj) {
              $.each(locObj, function (index, loc) {
                    console.log(loc)
                      loc.marker = new google.maps.Marker({
                          position: new google.maps.LatLng(loc[1], loc[2]),
                          map: map,
                          customInfo: loc[0]
                      });
                      setListener(loc.marker);
           });
           }
          setMarkers(new_locations); //Create markers from the initial dataset served with the document.
          //ajaxObj.get(); //Start the get cycle.
        });
      }, 5000);

    var setListener = function(marker) {

      var recipe_name 
      var recipe_type 
      var recipe_image
      var vegetarian
      var vegan
      var gluten
      var allergies
      var upvotes
      var steps
      var ingredients
      var est_time
      var views
      google.maps.event.addListener(marker,'click',function() {
            console.log('marker info');
            console.log(this.customInfo);
            currentID = marker.customInfo;
            $.ajax({
                type: "POST",
                url: "/viewRecipe",
                data: '&markerID='+marker.customInfo,
                success: function(data) {
                  console.log('recieving the marker ID');
                  console.log(data);
                  recipe_name = data.recipe_name
                  recipe_type = data.recipe_type
                  recipe_image = data.recipe_image
                  vegetarian = data.vegetarian
                  vegan = data.vegan
                  gluten = data.gluten
                  allergies = data.allergies
                  upvotes = data.upvotes
                  steps = data.instructions
                  ingredients = data.ingredients
                  views = data.views
                  est_time = data.prep_time
                  console.log('stuff', views, ingredients, steps, est_time);
                       
            if (vegetarian===true) {
              vegetarian='checked="checked">';
            } else {
              vegetarian='>';
            }
            if (vegan===true) {
              vegan='checked="checked">';
            } else {
              vegan='>';
            }
            if (gluten===true) {
              gluten='checked="checked">';
            } else {
              gluten='>';
            }
            if (allergies===true) {
              allergies ='checked="checked">';
            } else {
              allergies ='>';
            }
             /*
     var contentString = '<div id="window"><div id="title">'+recipe_name+'</div><div id="inside"><div class="label">
     Dish type:</div></br>'+recipe_type+'</br><div class="label">Recipe Image</div></br><img src="'+recipe_image
     ' class="image"></br><div class="label">Dietary Restrictions:</div></br>'+'<input type="checkbox" class="checkbox"
      disabled="disabled" '+vegetarian+' Vegetarian <input type="checkbox" class="checkbox" disabled="disabled" '+vegan+
      'Vegan <input type="checkbox" class="checkbox" disabled="disabled" '+gluten+'Gluten-Free <input type="checkbox"
       class="checkbox" disabled="disabled" '+allergies+'No peanuts/soy <div class="label">Upvotes: </div>'+upvotes+'</div></div>';
       */

//check if you can upvote or no, if not, itll replace it with a thing that says you voted luls no button nemorez
    $.ajax({
        type: "POST",
        url: "/Refresh",
        data: "&markerID="+marker.customInfo,
        success: function(data) {
          console.log('LOGGED in var below')
          console.log(data.authenticated);
           if (data.authenticated) {
                $.ajax({
                        type: "POST",
                        url: "/canUpvote",
                        data: "&markerID="+marker.customInfo,
                        success: function(data) {
                          //console.log(data.upvoted+" = upvoted or not");
                           if (data.upvoted) {
                            //$('.upvotebutton').html('You upvoted this!');
                            $('.voted').show();
                            $('.upvotebutton').hide();
                           } else {
                            //$('.upvotebutton').html('<a href="#" class="upvotebutton2">Upvote</a>');
                            $('.voted').hide();
                            $('.upvotebutton').show();
                           }
                         }
                       })
              }}});



  



      var contentString = recipe_name + recipe_image;
      //<div class="checkbox"><label><input type="checkbox" name="upvote" value="">Upvote</label></div>'; 
      var infowindow = new google.maps.InfoWindow({
      content: contentString
       });   
      //infowindow.open(map,marker);
      map.panTo(marker.getPosition());
      $('.recipetitle').html('<div>'+recipe_name+'</div>');
      $('.recipeimage').html('<img src="'+recipe_image+'" style="width:20vw;height:auto" />');     
      $('.recipetype').html('<div>'+recipe_type+'</div>'); 
      $('.upvotes').html('<div>'+upvotes+' upvotes</div>') 

      }
      });

      });
    }

  }

      google.maps.event.addDomListener(window, 'load', initialize);

//if you can vote and you choose to...
$(function() {
    $(".upvotebutton2").click(function() {
      console.log('are we gettitng here', currentID);
    $.ajax({
        type: "POST",
        url: "/Upvote",
        data: "&markerID="+currentID,
        success: function(data) {
          upvotes = data.current_upvotes;
          //$('.upvotebutton').html('You upvoted this!');
          $('.voted').show();
          $('.upvotebutton').hide();
          $('.upvotes').html('<div>'+upvotes+' upvotes</div>') 
        }
      });
  });
});

      