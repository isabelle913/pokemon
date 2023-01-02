<template>
   <div class="container">
      <q-card>
         <q-card-section>
            <div>
               <div class="q-my-sm">
                  <div>
                     <q-select outlined v-model="genderSelected" :options="genderOptions" label="Outlined" class="q-my-sm" />

                     <q-select outlined v-model="habitatSelected" :options="habitatsOptions" label="Outlined" class="q-my-sm" />
                  </div>
                  <div class="q-gutter-sm">
                     <q-radio v-model="searchOptionSelected" val="and" label="Sélectionner tous ces attributs" />
                     <q-radio v-model="searchOptionSelected" val="or" label="Sélectionner au moins l'un de ces attributs" />
                  </div>
                  <div class="row justify-center">
                     <q-btn @click="submitAdvancedSearch" class="btn-search">Rechercher</q-btn>
                     <q-btn @click="reset" class="btn-search">Reinitialiser</q-btn>
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

const emit = defineEmits(['advancedSearch'])

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
// console.log('ici', genderOptions)
// console.log(typeof genderOptions.value)
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
      console.log('genderSelected.value', genderSelected.value)
      console.log(typeof genderSelected.value)
      console.log('genderSelected.value,value', genderSelected.value.value)
      console.log(typeof genderSelected.value.value)
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
      } else {
         console.log('rien OR')
      }
   } else {
      console.log('Je suis ici')

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
   //console.log('A chercher', pokemonsListToSearch)

   //  return pokemonsListToSearch
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
}
</script>

<style scoped>
.btn-search {
   margin: 10px;
}
</style>
