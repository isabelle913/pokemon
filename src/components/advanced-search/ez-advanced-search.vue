<template>
   <div>
      <q-card>
         <q-card-section>
            <div>
               <h6 class="q-my-xs text-search">Recherche avancée:</h6>
               <div class="q-my-sm">
                  <div class="group-input-choice">
                     <q-select outlined v-model="genderSelected" :options="genderOptions" label="Outlined" class="q-my-sm input-choice" />

                     <q-select outlined v-model="habitatSelected" :options="habitatsOptions" label="Outlined" class="q-my-sm input-choice input-choice-right" />
                  </div>
                  <div class="q-gutter-sm">
                     <q-radio v-model="searchOptionSelected" val="and" label="Sélectionner tous ces attributs" />
                     <q-radio v-model="searchOptionSelected" val="or" label="Sélectionner au moins l'un de ces attributs" />
                  </div>
                  <div class="row justify-center">
                     <q-btn @click="submitAdvancedSearch" class="btn-search">Rechercher</q-btn>
                     <q-btn @click="reset" class="btn-search">Reinitialiser</q-btn>
                     <q-btn @click="closeAdvancedSearch" class="btn-search">Fermer recherche avancé</q-btn>
                  </div>
               </div>
            </div>
         </q-card-section>
      </q-card>
   </div>
</template>

<script setup lang="ts">
import { requestPokemonApi } from 'src/services/services'
import { ref } from 'vue'

const emit = defineEmits(['advancedSearch', 'changeadvanceSearchToggle'])

interface Options {
   label: string
   value: string
   url: string
   name: string
}

interface IPokemonGender {
   pokemon_species: {
      name: string
      url: string
   }
}
interface IPokemonHabitat {
   name: string
   url: string
}

const genderSelected = ref<Options[]>()
const habitatSelected = ref<Options[]>()
const searchOptionSelected = ref('and')

let genderOptions = ref<Options>()
let habitatsOptions = ref<Options>()
let pokemonsListToSearch: Set<string>

const getOptions = async function () {
   const responseGender = await requestPokemonApi('gender/')
   genderOptions.value = formatResponse(responseGender.data.results.map((gender: Options) => gender))

   const responseHabitats = await requestPokemonApi('pokemon-habitat/')
   habitatsOptions.value = formatResponse(responseHabitats.data.results.map((habitat: Options) => habitat))
}

const formatResponse = function (arrOptions: Options) {
   const tempo = getSort(
      arrOptions.map((item: Options) => {
         return {
            label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
            value: item.name,
            url: item.url
         }
      })
   )

   tempo.unshift({
      label: 'Tous',
      value: 'tous',
      url: ''
   })
   return tempo
}

const getSort = function (arr: Options) {
   arr.sort((a: Options, b: Options) => {
      if (a.label < b.label) {
         return -1
      }
      if (a.label > b.label) {
         return 1
      }
   })

   return arr
}

const submitAdvancedSearch = async function () {
   let genderPokemonsListName: string[] = []
   let habitatPokemonsListName: string[] = []

   if (genderSelected.value && genderSelected.value.value !== 'tous') {
      const response = await requestPokemonApi(formatUrl(genderSelected.value.url))
      genderPokemonsListName = response.data.pokemon_species_details.map((pokemon: IPokemonGender) => {
         return pokemon.pokemon_species.name
      })
   }

   if (habitatSelected.value && habitatSelected.value.value !== 'tous') {
      const response = await requestPokemonApi(formatUrl(habitatSelected.value.url))
      habitatPokemonsListName = response.data.pokemon_species.map((pokemon: IPokemonHabitat) => {
         return pokemon.name
      })
   }

   if (searchOptionSelected.value === 'or') {
      if (genderPokemonsListName && habitatPokemonsListName) {
         pokemonsListToSearch = new Set(genderPokemonsListName.concat(habitatPokemonsListName))
      } else if (genderPokemonsListName) {
         pokemonsListToSearch = new Set(genderPokemonsListName)
      } else if (habitatPokemonsListName) {
         pokemonsListToSearch = new Set(habitatPokemonsListName)
      }
   } else {
      pokemonsListToSearch = new Set()
      if (genderPokemonsListName.length > 0) {
         if (habitatPokemonsListName.length > 0) {
            genderPokemonsListName.forEach((pokemon) => {
               if (habitatPokemonsListName.includes(pokemon)) {
                  pokemonsListToSearch.add(pokemon)
               }
            })
         } else {
            genderPokemonsListName.forEach((pokemon) => pokemonsListToSearch.add(pokemon))
         }
      } else if (habitatPokemonsListName.length > 0) {
         habitatPokemonsListName.forEach((pokemon) => pokemonsListToSearch.add(pokemon))
      }
   }

   emit('advancedSearch', pokemonsListToSearch)
}

const formatUrl = function (url: string) {
   return url.replace('https://pokeapi.co/api/v2/', '')
}
getOptions()

const reset = function () {
   genderSelected.value = undefined
   habitatSelected.value = undefined
   searchOptionSelected.value = 'and'

   if (pokemonsListToSearch !== undefined) {
      pokemonsListToSearch.clear()
   }
   emit('advancedSearch', pokemonsListToSearch)
}

const closeAdvancedSearch = function () {
   reset()
   emit('changeadvanceSearchToggle')
}
</script>

<style scoped>
.btn-search {
   margin: 10px;
}

@media screen and (min-width: 768px) {
   .group-input-choice {
      display: flex;
      flex-direction: row;
   }
   .input-choice {
      flex-grow: 1;
   }
   .input-choice-right {
      margin-left: 10px;
   }
}
</style>
