<template>
  <GeoErrorModal v-if="geoError" :geoErrorMsg="geoErrorMsg" @closeGeoError="closeGeoError" />
  <MapFeatures />
  <div class="h-screen relative">
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import { onMounted, ref } from 'vue';
import leaflet from 'leaflet'
import GeoErrorModal from '@/components/GeoErrorModal.vue';
import MapFeatures from '@/components/MapFeatures.vue';

export default {
  name: 'HomeView',
  components: {
    GeoErrorModal,
    MapFeatures,
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
    const geoError = ref(true)
    const geoErrorMsg = ref('Fuck')

    const getGeoLocation = () => {
      // check session storage for coords
      if (sessionStorage.getItem('coords')) {
        coords.value = JSON.parse(sessionStorage.getItem('coords'))
        plotGeoLocation(coords.value)
        return
      }
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
      plotGeoLocation(coords.value)


    }
    const getLocError = (error) => {
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMsg.value = error.message

    }

    const plotGeoLocation = (coords) => {
      // Create custom marker
      const customMarker = leaflet.icon({
        iconUrl: require('../assets/map-marker-red.svg'),
        iconSize: [35, 35]
      })
      // Create new marker with coords and custom maker
      geoMarker.value = leaflet.marker([coords.lat, coords.lng], { icon: customMarker }).addTo(map)

      // Set mapView to current location
      map.setView([coords.lat, coords.lng], 10)

    }

    const closeGeoError = () => {
      geoError.value = null
      geoErrorMsg.value = null

    }
    return { coords, geoMarker, getLocError, closeGeoError, geoError, geoErrorMsg }
  }
}
</script>
