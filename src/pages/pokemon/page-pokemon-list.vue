<template>
   <q-page>
      <div class="container">
         <div v-if="!msgErrorToggle">
            <div class="text-h4 q-my-xl text-center">{{ titlePagePokemonList }}</div>
            <div class="container">
               <q-card>
                  <q-card-section>
                     <h6 class="q-my-xs">Vous chercher un pokemon en particulier?</h6>
                  </q-card-section>
                  <q-card-section>
                     <div class="row justify-between">
                        <q-input outlined v-model="searchValue" @keyup="submitSearch" class="col-8">
                           <template v-if="searchValue" v-slot:append>
                              <q-icon name="cancel" @click.stop.prevent="reset" class="cursor-pointer" />
                           </template>
                        </q-input>
                        <q-btn class="col-3">Recherche avancé</q-btn>
                     </div>
                  </q-card-section>
               </q-card>
            </div>
            <div class="container q-mb-xs">
               <q-card>
                  <q-card-section>
                     <q-table :grid="$q.screen.xs" v-model:pagination="pagination" :columns="columns" :loading="loading" :rows="pokemonsListFiltered" :title="tableTitle" @row-click="onRowClick" row-key="name" hide-pagination></q-table>
                  </q-card-section>
                  <q-card-section>
                     <div class="flex flex-center">
                        <q-pagination v-model="pagination.page" :max="pagesNumber" :max-pages="5" size="lg" boundary-links @click="getPokemonDetailsNewPage"></q-pagination>
                     </div>
                  </q-card-section>
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
/*

TODO faire recherche avancée
TODO ajouter un loading -> récupération des données
TODO mettre card message erreur dans un component


*/
import { api } from 'boot/axios'
import { ref, reactive, computed } from 'vue'
import { QTableColumn } from 'quasar'
import { IPokemon } from './dialog/dialog-pokemon-detail.vue'
import DialogPokemonDetail from '../../pages/pokemon/dialog/dialog-pokemon-detail.vue'

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
   rowsPerPage: 10
})
const pokemonsList = ref<IPokemon[]>([])
const pokemonsListFiltered = ref<IPokemon[]>([])
const msgErrorToggle = ref(false)
const msgErrorToggleDetails = ref(false)
const openDialogToggle = ref(false)
const searchValue = ref('')
const loading = ref(false)

let pokemon = reactive<IPokemon>({ name: '', url: '', isLoaded: false })
let msgError = reactive({})

function fetchPokemons() {
   api.get('pokemon/?limit=30&offset=20"') // TODO changer limite pour tous les charger au début
      .then((res) => {
         pokemonsList.value = res.data.results.map((pokemon: IPokemon) => {
            return {
               name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
               url: pokemon.url,
               isLoaded: false
            }
         })

         pokemonsListFiltered.value = getSort(pokemonsList.value) // TODO Corriger
         console.log('fetch Pokemon', pokemonsListFiltered.value) // TODO enlever
         getPokemonDetailsNewPage()
      })
      .catch((error) => {
         msgErrorToggle.value = true
         msgError = error.config
         console.log('error.config', error.config)
      })
}

const getSort = function (arr: IPokemon) {
   arr.sort((a: IPokemon, b: IPokemon) => {
      // TODO corriger TS
      if (a.name < b.name) {
         return -1
      }
      if (a.name > b.name) {
         return 1
      }
   })
   return arr
}

function getPokemonDetailsNewPage() {
   const indexStartToSearch = (pagination.value.page - 1) * pagination.value.rowsPerPage
   const indexStopToSearch = (pagination.value.page - 1) * pagination.value.rowsPerPage - 1 + pagination.value.rowsPerPage

   pokemonsListFiltered.value.map(async (pokemon: IPokemon, index) => {
      if (index >= indexStartToSearch && index <= indexStopToSearch && !pokemon.isLoaded) {
         try {
            const results = await getPokemonDetails(pokemon.url)
            pokemon.id = results.data.id
            pokemon.isLoaded = true
            pokemon.species = results.data.species
            pokemon.height = results.data.height
            pokemon.weight = results.data.weight
            pokemon.abilities = results.data.abilities
            pokemon.forms = results.data.forms
            pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${results.data.id}.png`
            pokemon.baseExperience = results.data.base_experience

            return pokemon
         } catch (err) {
            console.log(err)
         }
      } else {
         return pokemon
      }
   })
   console.log('Details', pokemonsListFiltered.value) //TODO enlever
}

const formatUrl = function (url: string) {
   return url.split('/')[6]
}

const getPokemonDetails = function (url: string) {
   return api
      .get(`pokemon/${formatUrl(url)}`)
      .then((resp) => {
         return Promise.resolve(resp)
      })
      .catch((err) => {
         return Promise.reject(err)
      })
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
   // TODO ajouter un message que la recherche est infructueuse
}

const reset = function () {
   searchValue.value = ''
   load()
}

function load() {
   fetchPokemons()
}

load()

const pagesNumber = computed(() => {
   return Math.ceil(pokemonsList.value.length / pagination.value.rowsPerPage)
})
</script>

<style scoped></style>
