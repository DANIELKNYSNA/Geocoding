<template>
  <div class="h-screen relative">
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import { onMounted, ref } from 'vue';
import leaflet from 'leaflet'

export default {
  name: 'HomeView',
  components: {
  },
  setup() {
    let map;
    onMounted(() => {
      map = leaflet.map('map').setView([-34.0553076, 23.0329035], 9);
      leaflet.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_API_KEY}`,
        {
          attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          tileSize: 512,
          zoomOffset: -1
        }).addTo(map);
      getGeoLocation()
    })

    const coords = ref(null)
    const fetchCoords = ref(null)
    const geoMarker = ref(null)

    const getGeoLocation = () => {
      fetchCoords.value = true
      navigator.geolocation.getCurrentPosition(setCoords, getLocError)

    }
    const setCoords = (pos) => {
      fetchCoords.value = null
      // Store the coords in sessionStorage
      const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }
      sessionStorage.setItem('coords', JSON.stringify(setSessionCoords))

      // Now set the coords value to the ref defined above
      coords.value = setSessionCoords

      //Now call the function to plot the location on the map
      plotGeoLocation(coords)


    }
    const getLocError = (error) => {
      console.log(error)
    }

    const plotGeoLocation = () => {

    }
    return { coords, geoMarker, getLocError }
  }
}
</script>
