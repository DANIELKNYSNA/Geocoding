<template>
  <div class="h-screen relative">
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import { onMounted } from 'vue';
import leaflet from 'leaflet'

export default {
  name: 'HomeView',
  components: {
  },
  setup() {
    let map;
    onMounted(() => {
      map = leaflet.map('map').setView([51.505, -0.09], 9);
      leaflet.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_API_KEY}`,
        {
          attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          tileSize: 512,
          zoomOffset: -1
        }).addTo(map);
    })
  }
}
</script>
