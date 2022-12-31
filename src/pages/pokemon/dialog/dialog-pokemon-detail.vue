<template>
   <q-dialog>
      <q-card class="card">
         <div class="container-image">
            <q-img :src="pokemon.image" class="image" fit="contain"></q-img>
         </div>
         <div class="container-section">
            <q-card-section class="section-title">
               <h4 class="text-center">{{ pokemon.name }}</h4>
            </q-card-section>
            <q-card-section class="progress-bar">
               <q-linear-progress stripe rounded size="20px" :value="calculateProgressBasValue(pokemon.baseExperience)" color="warning" class="q-mt-sm" />

               <p class="text-center text-h6">Force</p>
            </q-card-section>
            <q-card-section class="row no-wrap justify-around">
               <div>
                  <p class="text-center">{{ pokemon.weight }} hg</p>
                  <p class="text-center text-subtitle1">Poids</p>
               </div>
               <q-separator vertical inset></q-separator>
               <div>
                  <p class="text-center">{{ pokemon.height }} dm</p>
                  <p class="text-center text-subtitle1">Grandeur</p>
               </div>
               <q-separator vertical inset></q-separator>
               <div>
                  <p class="text-center">{{ pokemon.species.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}</p>
                  <p class="text-center text-subtitle1">Espèce</p>
               </div>
            </q-card-section>
            <q-separator inset></q-separator>
            <q-card-section class="row no-wrap justify-around">
               <div class="col-6">
                  <div class="row justify-center">
                     <pre v-for="(ability, index) in pokemon.abilities" :key="index" class="roboto">{{ ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1) }} </pre>
                  </div>
                  <p class="text-center text-subtitle1">Habilités</p>
               </div>
               <q-separator vertical inset></q-separator>
               <div class="col-6">
                  <div class="row justify-center">
                     <pre v-for="(form, index) in pokemon.forms" :key="index" class="roboto">{{ form.name.charAt(0).toUpperCase() + form.name.slice(1) }}</pre>
                  </div>
                  <p class="text-center text-subtitle1">Forme</p>
               </div>
            </q-card-section>
            <q-card-section></q-card-section>
            <q-card-actions align="right">
               <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
         </div>
      </q-card>
   </q-dialog>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

export interface IPokemonData {
   data: IPokemon
}

export interface IPokemon {
   id: number
   name: string
   url: string
   isLoaded: boolean
   getSort: (PokemonList: IPokemon) => IPokemon[]
   species: IPokemonSpecies
   height?: number
   weight?: number
   abilities?: IPokemonAbilities[]
   image?: string
   forms?: IPokemonForms[]
   baseExperience?: number
}

//console.log(pokemon.sprites?.front_default)
export interface IPokemonSpecies {
   name: string
}
export interface IPokemonAbilities {
   ability: {
      name: string
      url: string
   }
}

export interface IPokemonForms {
   name: string
}

const props = defineProps({
   pokemon: {
      type: Object as PropType<IPokemon>,
      required: true
   }
})
props.pokemon

const calculateProgressBasValue = function (value: number | undefined) {
   if (typeof value === 'number') {
      return value / 400
   }
}
</script>

<style lang="scss" scoped>
.roboto {
   font-family: roboto;
}
.card {
   width: 100%;
   border-radius: 20px;
   background-color: rgb(153, 153, 153);
}
.container-image {
   width: 100%;
   height: 100%;
   min-height: 180px;
   position: relative;
}
.card .image {
   width: 70%;
   position: absolute;
   left: 20%;
}
.card .container-section {
   background-color: rgb(255, 255, 255);
   border-radius: 20px;
}
.card .container-section .progress-bar {
   width: 75%;
   margin: 0 auto;
}
.card .container-section h4 {
   margin-bottom: 0;
}

@media screen and (min-width: 420px) {
   .card .container-section h4 {
      margin-top: 60px;
   }
}

@media screen and (min-width: 450px) {
   .card .container-section h4 {
      margin-top: 80px;
   }
}

@media screen and (min-width: 480px) {
   .container-image {
      height: 200px;
   }
   .card .container-section h4 {
      margin-top: 80px;
   }
}
@media screen and (min-width: 500px) {
   .container-image {
      height: 250px;
   }
   .card .container-section h4 {
      margin-top: 90px;
   }
}
@media screen and (min-width: 600px) {
   .card .container-section h4 {
      margin-top: 100px;
   }
}
@media screen and (min-width: 768px) {
   .container-image {
      height: 300px;
   }
   .card .container-section h4 {
      margin-top: 10%;
   }
}
@media screen and (min-width: 1366px) {
}
</style>
