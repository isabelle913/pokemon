<template>
   <q-page>
      <div class="container">
         <div v-if="!msgErrorToggle">
            <div class="text-h4 q-my-xl text-center">{{ titlePagePokemonList }}</div>
            <div>
               <q-card v-if="!advanceSearchToggle">
                  <q-card-section>
                     <h6 class="q-my-xs text-search">Vous chercher un Pokémon en particulier?</h6>
                  </q-card-section>
                  <q-card-section>
                     <div>
                        <q-input outlined v-model="searchValue" @keyup="submitSearch">
                           <template v-if="searchValue" v-slot:append>
                              <q-icon name="cancel" @click.stop.prevent="reset" class="cursor-pointer" />
                           </template>
                        </q-input>
                     </div>
                     <q-btn @click="changeAdvanceSearchToggle" class="btn-searchAdvanced">Recherche avancé</q-btn>
                  </q-card-section>
               </q-card>
               <EzAdvancedSearch v-if="advanceSearchToggle" @advancedSearch="advancedSearch" @changeAdvanceSearchToggle="changeAdvanceSearchToggle" class="q-mt-md"></EzAdvancedSearch>
            </div>
            <div class="q-mt-md">
               <q-card>
                  <div v-if="qTableToggle">
                     <q-card-section>
                        <q-table :grid="$q.screen.xs" v-model:pagination="pagination" :columns="columns" :loading="loading" :rows="pokemonsListFiltered" :title="tableTitle" @row-click="onRowClick" row-key="name" hide-pagination></q-table>
                     </q-card-section>
                     <q-card-section>
                        <div class="flex flex-center">
                           <q-pagination v-model="pagination.page" :max="pagesNumber" :max-pages="5" size="lg" boundary-links @click="getPokemonDetailsNewPage"></q-pagination>
                        </div>
                     </q-card-section>
                  </div>
                  <div v-else>
                     <h6 class="msg-not-found">Nous n'avons pas trouvé de Pokémons corespondent à votre demande</h6>
                  </div>
               </q-card>
            </div>
         </div>
         <div v-else class="q-my-xl">
            <q-card class="container">
               <q-card-section class="text-center text-h4">
                  <p>Un problème est survenu</p>
                  <q-btn align="center" size="md" label="Pour plus de détails" @click="msgErrorToggleDetails = true" v-if="!msgErrorToggleDetails" />
               </q-card-section>
            </q-card>
            <q-card class="container" v-if="msgErrorToggleDetails">
               <q-card-section>
                  <p class="text-h6">Details:</p>
                  <div v-for="(err, index) in msgError" :key="index">
                     <p>{{ index }}: {{ err }}</p>
                  </div>
               </q-card-section>
               <q-card-section align="right">
                  <q-btn flat size="lg" label="Fermer" @click="msgErrorToggleDetails = false" />
               </q-card-section>
            </q-card>
         </div>
         <dialog-pokemon-detail v-model="openDialogToggle" :pokemon="pokemon"></dialog-pokemon-detail>
      </div>
   </q-page>
</template>

<script setup lang="ts">
import { api } from 'boot/axios'
import { ref, reactive, computed } from 'vue'
import { QTableColumn } from 'quasar'
import { IPokemon, IPokemonNew } from './dialog/dialog-pokemon-detail.vue'
import DialogPokemonDetail from '../../pages/pokemon/dialog/dialog-pokemon-detail.vue'
import EzAdvancedSearch from 'src/components/advanced-search/ez-advanced-search.vue'

const titlePagePokemonList = 'Grande famille des Pokemons'
const tableTitle = 'Liste des Pokemons'
const columns: QTableColumn<IPokemon>[] = [
   {
      name: 'name',
      required: true,
      label: 'Nom',
      align: 'left',
      field: (row: IPokemon) => row.name,
      format: (val: number | string) => `${val}`
   },
   { name: 'height', align: 'center', label: 'Grandeur', field: 'height' },
   { name: 'weight', align: 'center', label: 'Poids', field: 'weight' },
   { name: 'baseExperience', align: 'center', label: 'Force', field: 'baseExperience' }
]
const pagination = ref({
   sortBy: 'desc',
   descending: false,
   page: 1,
   rowsPerPage: 3
   // TODO modifier rowsPerPage
})
const pokemonsList = ref<IPokemon[]>([])
const pokemonsListFiltered = ref<IPokemon[]>([])
const advanceSearchToggle = ref(false)
const msgErrorToggle = ref(false)
const msgErrorToggleDetails = ref(false)
const openDialogToggle = ref(false)
const searchValue = ref('')
const loading = ref(false)

let pokemon: IPokemon = reactive({ name: '', url: '', isLoaded: false })
let msgError = reactive({})

function fetchPokemons() {
   loading.value = true
   // TODO modifier limite
   api.get('pokemon/?limit=20&offset=0"')
      .then((res) => {
         pokemonsList.value = res.data.results.map((pokemon: IPokemon) => {
            return {
               name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
               url: pokemon.url,
               isLoaded: false
            }
         })

         pokemonsListFiltered.value = getSort(pokemonsList.value)
         //pokemonsListFiltered.value = pokemonsList.value.sort()

         getPokemonDetailsNewPage()
      })
      .catch((error) => {
         msgErrorToggle.value = true
         msgError = error.config
         console.log('error.config', error.config)
      })
   loading.value = false
}

const getSort = function (arr: IPokemon[]) {
   arr.sort((a: IPokemon, b: IPokemon) => {
      if (a.name < b.name) {
         return -1
      }
      if (a.name > b.name) {
         return 1
      }
      return 0
   })
   return arr
}

function getPokemonDetailsNewPage() {
   loading.value = true
   const indexStartToSearch = (pagination.value.page - 1) * pagination.value.rowsPerPage
   const indexStopToSearch = (pagination.value.page - 1) * pagination.value.rowsPerPage - 1 + pagination.value.rowsPerPage

   // Pour récupérer seulement les détails des Pokémons n'ayant pas encore récupérer ses détails
   let pokemonToLoad: Promise<IPokemonNew>[] = []
   pokemonsListFiltered.value.map((pokemon: IPokemon, index) => {
      if (index >= indexStartToSearch && index <= indexStopToSearch && !pokemon.isLoaded) {
         pokemonToLoad.push(api.get(`pokemon/${formatUrl(pokemon.url)}`))
      }
   })

   Promise.all(pokemonToLoad)
      .then((res) => {
         res.map((newPokemon) => {
            console.log('newPokemon', newPokemon)
            pokemonsListFiltered.value.map((pokemon) => {
               if (newPokemon.data.name === pokemon.name.toLocaleLowerCase()) {
                  console.log('Pokemon', pokemon)
                  pokemon.id = newPokemon.data.id
                  pokemon.isLoaded = true
                  pokemon.species = newPokemon.data.species
                  pokemon.height = newPokemon.data.height
                  pokemon.weight = newPokemon.data.weight
                  pokemon.abilities = newPokemon.data.abilities
                  pokemon.forms = newPokemon.data.forms
                  pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${newPokemon.data.id}.png`
                  pokemon.baseExperience = newPokemon.data.base_experience
               }
            })
         })
      })
      .catch((err) => {
         console.log(err)
      })

   loading.value = false
   console.log('Details', pokemonsListFiltered.value)
}

const formatUrl = function (url: string) {
   return url.split('/')[6]
}

const onRowClick = function (evt: object, row: IPokemon) {
   pokemon = row
   openDialogToggle.value = true
}

const submitSearch = function () {
   const searchString = searchValue.value.toLowerCase().trim()

   pokemonsListFiltered.value = pokemonsList.value.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(searchString)
   })

   getPokemonDetailsNewPage()
}

const reset = function () {
   searchValue.value = ''
   pokemonsListFiltered.value = getSort(pokemonsList.value)
}

const advancedSearch = function (pokemonsListToSearch: Set<string>) {
   searchValue.value = ''
   pokemonsListFiltered.value = getSort(pokemonsList.value)

   if (pokemonsListToSearch === undefined) {
      return
   }
   if (!pokemonsListToSearch.size) {
      return
   }

   pokemonsListFiltered.value = pokemonsListFiltered.value.filter((pokemon) => {
      if (pokemonsListToSearch.has(pokemon.name.toLocaleLowerCase())) {
         return pokemon
      }
   })

   getPokemonDetailsNewPage()
}

const changeAdvanceSearchToggle = function () {
   advanceSearchToggle.value = !advanceSearchToggle.value
   searchValue.value = ''
}

function load() {
   fetchPokemons()
}

load()

const pagesNumber = computed(() => {
   return Math.ceil(pokemonsListFiltered.value.length / pagination.value.rowsPerPage)
})

const qTableToggle = computed(() => {
   if (!pokemonsListFiltered.value.length) {
      return false
   } else {
      return true
   }
})
</script>

<style scoped>
.text-search {
   font-size: 18px;
}
.btn-searchAdvanced {
   display: block;
   margin: 10px auto;
}
.msg-not-found {
   padding: 16px;
}

@media screen and (min-width: 500px) {
   .text-search {
      font-size: 20px;
   }
}
</style>
