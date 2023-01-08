<template>
   <div>
      <q-card>
         <q-card-section>
            <div>
               <h6 class="q-my-xs text-search">Recherche avancée:</h6>
               <div class="q-my-sm">
                  <div class="group-input-choice">
                     <q-select outlined v-model="genderSelected" :options="genderOptions" label="Sélectionner le genre" class="q-my-sm input-choice" />

                     <q-select outlined v-model="habitatSelected" :options="habitatsOptions" label="Sélectionner l'habitat" class="q-my-sm input-choice input-choice-right" />
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
import { api } from 'boot/axios'
import { ref } from 'vue'

const emit = defineEmits(['advancedSearch', 'changeAdvanceSearchToggle'])

interface OptionsConfig {
   data: {
      results: Options[]
   }
   config: { url: string }
}

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
const genderAddressRequest = 'gender/'
const habitatAddressRequest = 'pokemon-habitat/'

const genderSelected = ref<Options>()
const habitatSelected = ref<Options>()
const searchOptionSelected = ref('and')

let genderOptions = ref<Options[]>([])
let habitatsOptions = ref<Options[]>([])
let pokemonsListToSearch: Set<string>

const getOptions = function () {
   //?? Est-ce préférable de mettre les 2 requests dans un seule demande Promise.all?
   const requestAPIList: Promise<OptionsConfig>[] = [api.get(genderAddressRequest), api.get(habitatAddressRequest)]

   Promise.all(requestAPIList)
      .then((res) => {
         res.map((response) => {
            if (response.config.url === genderAddressRequest) {
               genderOptions.value = formatResponse(response.data.results)
            }
            if (response.config.url === habitatAddressRequest) {
               habitatsOptions.value = formatResponse(response.data.results)
            }
         })
      })
      .catch((err) => {
         console.log('err', err)
      })

   /*
//?? Ou faire demande séparément puisque juste 2 request?
   api.get(genderAddressRequest)
      .then((res) => {
         genderOptions.value = formatResponse(res.data.results)
      })
      .catch((err) => {
         console.log(err)
      })
   api.get(habitatAddressRequest)
      .then((res) => {
         habitatsOptions.value = formatResponse(res.data.results)
      })
      .catch((err) => {
         console.log(err)
      })
*/
   //TODO ajouter gestion erreur
}

const formatResponse = function (arrOptions: Options[]) {
   const tempo = getSort(
      arrOptions.map((item) => {
         return {
            label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
            value: item.name,
            url: item.url,
            name: item.name
         }
      })
   )

   tempo.unshift({
      label: 'Tous',
      value: 'tous',
      url: '',
      name: 'tous'
   })
   return tempo
}

const getSort = function (arr: Options[]) {
   arr.sort((a: Options, b: Options) => {
      if (a.label < b.label) {
         return -1
      }
      if (a.label > b.label) {
         return 1
      }
      return 0
   })

   return arr
}

const submitAdvancedSearch = async function () {
   let genderPokemonsListName: string[] = []
   let habitatPokemonsListName: string[] = []

   if (genderSelected.value && genderSelected.value.value !== 'tous') {
      api.get(formatUrl(genderSelected.value.url))
         .then((res) => {
            genderPokemonsListName = res.data.pokemon_species_details.map((pokemon: IPokemonGender) => {
               return pokemon.pokemon_species.name
            })
            console.log('genderPokemonsListName', genderPokemonsListName)
         })
         .catch((err) => {
            console.log(err)
         })
   }
   if (habitatSelected.value && habitatSelected.value.value !== 'tous') {
      api.get(formatUrl(habitatSelected.value.url))
         .then((res) => {
            habitatPokemonsListName = res.data.pokemon_species.map((pokemon: IPokemonHabitat) => {
               return pokemon.name
            })
            console.log('habitatPokemonsListName', habitatPokemonsListName)
         })
         .catch((err) => {
            console.log(err)
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
   emit('changeAdvanceSearchToggle')
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
