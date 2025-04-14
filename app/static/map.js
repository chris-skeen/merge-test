const MAPKEY = 'AIzaSyBzxbu5AjBh5LWI3Ns5L_vJvdKawxV-w98'
const MAP_ID = '8d27f2d7194c07e7'
let map, autocomplete;
document.addEventListener("DOMContentLoaded", () => {
  let s = document.createElement("script");
  document.head.appendChild(s);


  s.addEventListener("load", () => {
    // script has loaded.
    console.log("script has loaded")
    map = new google.maps.Map(document.getElementById("map"), {
      // Map Settings
      center: {
        lat: 34.823986,
        lng: -89.993706
      },
      zoom: 14,
      mapId: MAP_ID, // Set the Map ID here
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      restriction: {
        latLngBounds: {
          north: 36.6,    // Northern boundary (around the northern border of Tennessee)
          south: 30.0,    // Southern boundary (around the southern border of Mississippi)
          west: -91.5,    // Western boundary (approximately the western edge of Mississippi)
          east: -80.0     // Eastern boundary (approximately the eastern edge of Tennessee)
        }
      },
      disableDoubleClickZoom: true,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      mapTypeControl: true,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      rotateControl: true,
      
    });

        // Marker Customization ---

        const infowindow = new google.maps.InfoWindow();

        // Initialize the Google Maps Geocoder
        let geocoder;
    
        // This function will be called to get the coordinates from the address
        async function geocodeAddress(Address, City, State) {
          var RealAddress;
          // Check if Address, City, or State is null/''.
          if (Address == '' || Address === null) {
            console.log(Address);
          } else if ((City === null || City === '') && (State === null || State === '')) {
            RealAddress = Address
          } else if ((City != null || City != '') && (State != null || State != '')) {
            RealAddress = Address + ', ' + City + ', ' + State
          } else if ((City != null || City != '') && (State === null || State === '')) {
            RealAddress = Address + ', ' + City
          } else if ((City === null || City === '') && (State != null || State != '')) {
            RealAddress = Address + ', ' + State
          }
    
          geocoder = new google.maps.Geocoder();
          return new Promise((resolve, reject) => {
            geocoder.geocode({ 'address': RealAddress }, function (results, status) {
              if (status === 'OK') {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                resolve({ latitude, longitude });
              } else {
                resolve({latitude, longitude });
              }
            });
          });
          }
    
        // ADD ALL MARKERS TO MAP!!!!!!!!
    
        async function GetAllCoordinates(Address, City, State) {
          try {
            const coordinates = await geocodeAddress(Address, City, State);
            return [coordinates.latitude, coordinates.longitude]
          } catch (error) {
            return [null,null]
          }
        }

    // Function to calculate distance between two lat/lon in miles
        function haversine(lat1, lon1, lat2, lon2) {
          // Radius of the Earth in miles
          const R = 3958.8; 

          // Convert degrees to radians
          const lat1Rad = degreesToRadians(lat1);
          const lon1Rad = degreesToRadians(lon1);
          const lat2Rad = degreesToRadians(lat2);
          const lon2Rad = degreesToRadians(lon2);

          // Haversine formula
          const dlat = lat2Rad - lat1Rad;
          const dlon = lon2Rad - lon1Rad;
          const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
                    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                    Math.sin(dlon / 2) * Math.sin(dlon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          // Distance in miles
          const distance = R * c;
          return distance;
        }

        // Helper function to convert degrees to radians
        function degreesToRadians(degrees) {
          return degrees * (Math.PI / 180);
        }

        // Function to check if two lat/long pairs are a mile apart
        function areOneMileApart(lat1, lon1, lat2, lon2) {
          const distance = haversine(lat1, lon1, lat2, lon2);
          return distance <= 1;  // Return true if within 1 mile
        }

    let markers = [];
    let pinViews = [];
    // Create the search input and autocomplete functionality
    const searchInput = document.createElement('input');
    searchInput.id = 'searchBox';
    searchInput.className = 'controls';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for a location';

    // Add the search box to the map controls (inside the map)
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);

    // Initialize the autocomplete feature
    autocomplete = new google.maps.places.Autocomplete(searchInput);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function() {
      document.getElementById('loading-overlay').style.display = 'flex';
      const place = autocomplete.getPlace();


      if (!place.geometry) {
        console.log("No details available for the selected place");
        return;
      }

      // If the place has a geometry, center the map on it
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Zoom in closer for better visualization
      }

      let parts = place.formatted_address.split(',')

      let searchAddress = parts[0].trim();
      let searchCity = parts[1].trim();
      let searchState = parts[2].trim();
      let vicinity = place.vicinity
      async function searchAlike(searchAddress, searchCity, searchState, vicinity) {
        // Await the coordinates from GetAllCoordinates function
        let [Slat, Slng] = await GetAllCoordinates(searchAddress, searchCity, searchState);

        try {
          const response = await fetch("/static/data.json");
          const data = await response.json();

          // Loop over the data and process each item
         let lengthOfData = data.length - 1;
          let counter = -1;
          for (let index = 0; index < data.length; index++) {
            if (index === lengthOfData){
              document.getElementById('loading-overlay').style.display = 'none';
            }
            try {
              if (data[index].City === vicinity) {
                let [lat, lng] = await GetAllCoordinates(data[index].Address, data[index].City, data[index].State);
                if (areOneMileApart(Slat, Slng, lat, lng)){
                  counter += 1

                  const bluePinView = new google.maps.marker.PinView({
                    background: '#4295C3',
                    borderColor: '#000000',
                    scale: 1.0,
                    glyphColor: '#5A5A5A'
                  });
      
                  pinViews.push(bluePinView)
                  // Proceed if lat and lng are valid
                  if (lat != null && lng != null) {
                    let marker = new google.maps.marker.AdvancedMarkerElement({
                      position: { lat: lat, lng: lng },
                      map: map,
                      title: data[index].Number,
                      content: pinViews[counter].element
                    });
          
                    markers.push(marker);
          
                    // Add event listener to the marker
                    marker.addListener("gmp-click", () => {
                      const content = document.createElement("div");
                      content.className = 'marker-box';
          
                      const nameElement = document.createElement("h2");
                      nameElement.className = 'marker-head';
                      nameElement.textContent = data[index].Number;
                      content.appendChild(nameElement);
          
                      const placeIdElement = document.createElement("p");
                      placeIdElement.textContent = data[index].DateOrdered;
                      content.appendChild(placeIdElement);
          
                      const placeAddressElement = document.createElement("p");
                      placeAddressElement.textContent = data[index].Address;
                      content.appendChild(placeAddressElement);
          
                      infowindow.setContent(content);
                      infowindow.open(map, marker);
                    });
                  }
                };  // Output: true or false)
                
              }else {
                continue;
              }
            } catch (error) {
              console.error(`Error processing coordinates for index ${index}:`, error);
            }
          }
        } catch (error) {
          console.error('Error fetching the data or processing the markers:', error);
        }
      }
      searchAlike(searchAddress, searchCity, searchState, vicinity)

    });

    // LOADS ALL SURVEYS
    
    // async function initMap() {
    //   try {
    //     const response = await fetch("/static/data.json");
    //     const data = await response.json();
    
    //     // Loop over the data and process each item
    //     for (let index = 0; index < data.length; index++) {
    //       try {
    //         // Await the coordinates from GetAllCoordinates function
    //         let [lat, lng] = await GetAllCoordinates(data[index].Address, data[index].City, data[index].State);

    //         const bluePinView = new google.maps.marker.PinView({
    //           background: '#4295C3',
    //           borderColor: '#000000',
    //           scale: 1.0,
    //           glyphColor: '#5A5A5A'
    //         });

    //         pinViews.push(bluePinView)
    
    //         // Proceed if lat and lng are valid
    //         if (lat != null && lng != null) {
    //           let marker = new google.maps.marker.AdvancedMarkerElement({
    //             position: { lat: lat, lng: lng },
    //             map: map,
    //             title: data[index].Number,
    //             content: pinViews[index].element
    //           });
    
    //           markers.push(marker);
    
    //           // Add event listener to the marker
    //           marker.addListener("gmp-click", () => {
    //             const content = document.createElement("div");
    //             content.className = 'marker-box';
    
    //             const nameElement = document.createElement("h2");
    //             nameElement.className = 'marker-head';
    //             nameElement.textContent = data[index].Number;
    //             content.appendChild(nameElement);
    
    //             const placeIdElement = document.createElement("p");
    //             placeIdElement.textContent = data[index].DateOrdered;
    //             content.appendChild(placeIdElement);
    
    //             const placeAddressElement = document.createElement("p");
    //             placeAddressElement.textContent = data[index].Address;
    //             content.appendChild(placeAddressElement);
    
    //             infowindow.setContent(content);
    //             infowindow.open(map, marker);
    //           });
    //         }
    //       } catch (error) {
    //         console.error(`Error processing coordinates for index ${index}:`, error);
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Error fetching the data or processing the markers:', error);
    //   }
    // }
    // initMap();
  });


  // ---



  s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPKEY}&v=beta&libraries=places,marker` 
});


