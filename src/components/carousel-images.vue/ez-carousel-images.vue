<template>
   <div class="q-pa-md">
      <q-carousel v-model="slide" :autoplay="autoplay" transition-next="slide-left" transition-prev="slide-right" animated infinite>
         <!-- <q-carousel-slide v-for="image in imagesList" :key="image.id" :img-src="image.url" :name="image.id" class="image-size" width="80%" ></q-carousel-slide> -->
         <q-carousel-slide v-for="image in imagesList" :key="image.id" :name="image.id" class="image-size" width="100%">
            <q-img :src="image.url"></q-img>
         </q-carousel-slide>
      </q-carousel>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slide = ref<number>(1)
const autoplay = ref(true)

const imagesList = [
   { id: 1, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
   { id: 2, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png' },
   { id: 3, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png' },
   { id: 4, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png' },
   { id: 5, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png' },
   { id: 6, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
   { id: 7, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
   { id: 8, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png' },
   { id: 8, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png' },
   { id: 10, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png' }
]
</script>

<style></style>
