<template>
  <q-page class="q-ma-lg text-center">
    <div class="container">
      <h1>Bienvenue {{ theName }}</h1>
      <p class="text-h4">Connaissez-vous les Pokemons?</p>
      <p class="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia laboriosam sunt atque corrupti, et eum! Omnis inventore veniam dolorem, error earum deleniti saepe accusantium molestias rem quibusdam! Perferendis cumque minus voluptatem, voluptatibus suscipit totam error ducimus nisi laudantium amet sint delectus, atque rem, exercitationem vero enim qui accusantium tempore similique eius vel? Eligendi eaque repellat nulla voluptatum dicta? Animi accusantium molestias aspernatur temporibus tempore ducimus optio voluptatibus repellat molestiae mollitia ipsum, perferendis at voluptas quis minima ex voluptate quia cum? Ea et quasi aperiam ipsa harum eveniet, saepe, dolorem corporis earum culpa exercitationem commodi id quae sunt non est debitis.</p>
      <q-btn
        color="primary"
        icon="my_location"
        class="button"
        label="Liste des Pokemons"
        to="/pokemon"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// To Do Changer pour votre nom
const theName = ref('Pokemon friends')

</script>

<style>
.description{
  max-width: 70%;
  margin: 5% auto;
}
.button{
  max-width: 70%;
  font-size: 3rem;
  border-radius: 20px;
}
.button:hover{
   transform: scale(1.02);
   box-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
}
</style>
