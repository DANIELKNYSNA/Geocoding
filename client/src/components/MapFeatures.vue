<template>
  <div
    class="w-full md:w-auto absolute md:top-[80px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent">

    <div :class="{'bg-slate-600': coords }" class="px-4 bg-white flex items-center shadow-md rounded-md min-h-[45px]">
      <i class="fas fa-location-arrow text-[18px]" :class="{'text-white': coords, 'animate-pulse': fetchCoords }"></i>
    </div>
  </div>
</template>
<script>
export default {
  props: ['coords', 'fetchCoords']
}
</script>