<template>
   <q-page class="q-ma-lg text-center">
      <div class="container-image">
         <div class="container container-home">
            <div class="section-main">
               <h1>
                  Bienvenue
                  <span class="text-display">{{ theName }}</span>
               </h1>
               <q-btn color="primary" class="button" to="/pokemon">Liste des Pokemons</q-btn>
            </div>
            <div class="section-text q-mt-lg">
               <p class="text-h4">Connaissez-vous les Pokemons?</p>
               <p class="description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia laboriosam sunt atque corrupti, et eum! Omnis inventore veniam dolorem, error earum deleniti saepe accusantium molestias rem quibusdam! Perferendis cumque minus voluptatem, voluptatibus suscipit totam error ducimus
                  nisi laudantium amet sint delectus, atque rem, exercitationem vero enim qui accusantium tempore similique eius vel? Eligendi eaque repellat nulla voluptatum dicta? Animi accusantium molestias aspernatur temporibus tempore ducimus optio voluptatibus repellat molestiae mollitia
                  ipsum, perferendis at voluptas quis minima ex voluptate quia cum? Ea et quasi aperiam ipsa harum eveniet, saepe, dolorem corporis earum culpa exercitationem commodi id quae sunt non est debitis.
               </p>
            </div>
            <div class="section-carousel">
               <ez-carousel-images></ez-carousel-images>
            </div>
         </div>
      </div>
   </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EzCarouselImages from '../components/carousel-images/ez-carousel-images.vue'

const theName = ref('Pokemon friends')
</script>

<style scoped>
.description {
   max-width: 100%;
   margin: 5% auto;
   text-align: justify;
}
.button {
   font-size: 2rem;
   border-radius: 20px;
}
.button:hover {
   transform: scale(1.02);
   box-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
}

.section-main h1 {
   font-size: 4rem;
   font-weight: 400;
   margin-top: 0;
}
.section-main .text-display,
.section-carousel {
   display: none;
}
@media screen and (min-width: 768px) {
   .section-main .text-display {
      display: inline;
   }
   .container-image {
      margin-top: 0;
      background-image: url('src/assets/pokemon-25.png');
      background-position: top right;
      background-repeat: no-repeat;
      background-size: 30%;
   }
}

@media screen and (min-width: 1366px) {
   .section-main .text-display {
      display: inline;
   }
   .container-image {
      background-image: none;
   }
   .container-home {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr 1fr;
   }
   .section-main {
      grid-area: 1/1/2/2;
   }

   .section-text {
      grid-row: 2/3;
      grid-column: 1 / span 2;
   }
   .section-carousel {
      display: block;
      grid-area: 1/2/2/3;
   }
   .section-text .text-h4 {
      text-align: left;
   }
   .description {
      width: 100%;
      margin: auto 0;
   }
}
</style>
