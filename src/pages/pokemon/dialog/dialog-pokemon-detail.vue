<template>
   <q-dialog>
      <h4>Card</h4>
      <q-card class="card">
         <q-card-section class="row q-pb-xs">
            <div class="col-9">
               <h4 class="text-center">{{ pokemon.name }}</h4>
            </div>
            <div class="col-3">
               <q-img :src="pokemon.sprites.front_default" style="max-width: 150px"></q-img>
            </div>
         </q-card-section>
         <q-card-section class="q-pt-xs">
            <p class="text-subtitle2">Caratéristiques:</p>
            <div>
               <p>Grandeur: {{ pokemon.height }}</p>
               <p>poids: {{ pokemon.weight }}</p>
               <p class="text-weight-bold q-mt-lg">Habilités:</p>
               <q-list>
                  <q-item clickable v-ripple v-for="(ability, index) in pokemon.abilities" :key="index">
                     <q-item-section avatar>
                        <q-icon color="primary" name="star" />
                     </q-item-section>
                     <q-item-section>{{ ability.ability.name }}</q-item-section>
                  </q-item>
               </q-list>
               <p class="text-weight-bold q-mt-md">Formes:</p>
               <q-list>
                  <q-item clickable v-ripple v-for="(form, index) in pokemon.forms" :key="index">
                     <q-item-section avatar>
                        <q-icon color="primary" name="star" />
                     </q-item-section>
                     <q-item-section>{{ form.name }}</q-item-section>
                  </q-item>
               </q-list>
            </div>
         </q-card-section>
         <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
         </q-card-actions>
      </q-card>
   </q-dialog>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

export interface IPokemonData {
   data: IPokemon
}

export interface IPokemon {
   name: string
   url: string
   height?: number
   weight?: number
   abilities?: IPokemonAbilities[]
   sprites?: IPokemonSprites
   forms?: IPokemonForms[]
}

export interface IPokemonAbilities {
   ability: {
      name: string
      url: string
   }
}

export interface IPokemonSprites {
   back_default: string
   back_shiny?: string
   front_default?: string
   front_shiny?: string
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

</script>

<style lang="scss" scoped>
// TODO: Styliser l'affichage dans le popup
</style>
