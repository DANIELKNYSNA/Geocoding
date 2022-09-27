<template>
  <div
    class="w-full md:w-auto absolute md:top-[80px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent">
    <!--Search-->
    <div class="relative flex-1 md:min-w-[350px]">
      <input class="pl-9 pr-4 py-3 text-sm focus:outline-none w-full shadow-md rounded-md"
        placeholder="Start your search" type="text" v-model="searchQuery" @input="search"
        @focus="$emit('toggleSearchResults')">
      <div class="absolute top-0 left-[8px] h-full flex items-center">
        <i class="fas fa-search"></i>
      </div>
      <div class="absolute mt-2 w-full">
        <div v-if="searchQuery && searchResults" class="h-[200px] overflow-scroll bg-white rounded-md">
          <loadingSpinner v-if="!searchData" />
          <div v-else>
            <div class="px-4 py-2 flex gap-x-2 cursor-pointer hover:bg-slate-600 hover:text-white"
              v-for="(result, index) in searchData" :key="index" @click="selectResult(result)">
              <i class="fas fa-map-marker-alt"></i>
              <p class="text-xs">{{ result.place_name_en }}</p>
            </div>
          </div>
        </div>
        <!-- Selected Search Result -->
        <div v-if="selectedResult" class="mt-2 px-4 py-3 bg-white rounded-md">
          <i @click="removeResult" class="far fa-times-circle flex justify-end cursor-pointer"></i>
          <h1 class="text-lg">{{selectedResult.text}}</h1>
          <p class="text-xs mb-1">{{selectedResult.properties.address}}, {{selectedResult.city}},
            {{selectedResult.state}}</p>
          <p class="text-sm">{{selectedResult.properties.category}}</p>
        </div>
      </div>
    </div>
    <!--Geolocation-->
    <div :class="{'bg-slate-600': coords }"
      class="cursor-pointer px-4 bg-white flex items-center shadow-md rounded-md min-h-[45px]"
      @click="$emit('getGeoLocation')">
      <i class="fas fa-location-arrow text-[18px]" :class="{'text-white': coords, 'animate-pulse': fetchCoords }"></i>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import axios from 'axios'
import loadingSpinner from './LoadingSpinner.vue'

export default {
  props: ['coords', 'fetchCoords', 'searchResults'],
  components: { loadingSpinner },
  setup(props, { emit }) {
    const searchQuery = ref(null)
    const searchData = ref(null)
    const queryTimeout = ref(null)
    const selectedResult = ref(null)


    const search = () => {
      clearTimeout(queryTimeout.value)
      searchData.value = null
      queryTimeout.value = setTimeout(async () => {
        if (searchQuery.value !== "") {
          const params = new URLSearchParams({
            fuzzyMatch: true,
            language: "en",
            limit: 10,
            proximity: props.coords ? `${props.coords.lng},${props.coords.lat}` : "0,0",
          })
          const getData = await axios.get(`api/search/${searchQuery.value}?${params}`)

          searchData.value = getData.data.features
        }
      }, 750)
    }
    const selectResult = (result) => {
      selectedResult.value = result
      emit('plotResult', result.geometry)
    }

    const removeResult = () => {
      selectedResult.value = null
      emit("removeResult")
    }

    return { searchData, searchQuery, queryTimeout, search, selectResult, selectedResult, removeResult }
  }
}
</script>