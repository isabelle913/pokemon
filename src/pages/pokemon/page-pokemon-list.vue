<template>
   <q-page>
      <div class="container">
         <div v-if="!msgErrorToggle">
            <div class="text-h4 q-mt-xl text-center">{{ titlePagePokemonList }}</div>
            <div class="container q=mt-xs">
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
                        <q-btn class="col-3">Avancé</q-btn>
                     </div>
                  </q-card-section>
               </q-card>
            </div>
            <div class="container q-mb-xs">
               <q-table :title="tableTitle" :rows="pokemonsListFiltered" :columns="columns" row-key="name" @row-click="onRowClick" :pagination="initialPagination">
                  <template v-slot:pagination="scope">
                     <q-btn v-if="scope.pagesNumber > 2" icon="first_page" color="grey-8" round dense flat :disable="scope.isFirstPage" @click="scope.firstPage" />

                     <q-btn icon="chevron_left" color="grey-8" round dense flat :disable="scope.isFirstPage" @click="scope.prevPage" />

                     <q-btn icon="chevron_right" color="grey-8" round dense flat :disable="scope.isLastPage" @click="scope.nextPage" />

                     <q-btn v-if="scope.pagesNumber > 2" icon="last_page" color="grey-8" round dense flat :disable="scope.isLastPage" @click="scope.lastPage" />
                  </template>
               </q-table>
            </div>
         </div>
         <div v-else>
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
- TODO  Créer une pagination. Boutons (Voir plus)

TODO faire recherche avancée
TODO ajouter un loading -> récupération des données

*/
import { api } from 'boot/axios'
import { ref, reactive } from 'vue'
import { QTableColumn } from 'quasar'
import { IPokemon, IPokemonData } from './dialog/dialog-pokemon-detail.vue'
import DialogPokemonDetail from '../../pages/pokemon/dialog/dialog-pokemon-detail.vue'

const titlePagePokemonList = 'Grande famille des Pokemons'
const tableTitle = 'Liste des Pokemons'
const initialPagination = {
   sortBy: 'desc',
   descending: false,
   page: 2,
   rowsPerPage: 5
}
//TODO réviser les colonnes du tableau
const columns: QTableColumn<IPokemon>[] = [
   {
      name: 'name',
      required: true,
      label: 'Nom',
      align: 'left',
      field: (row: IPokemon) => row.name,
      format: (val: number | string) => `${val}`,
      sortable: true
   },
   { name: 'height', align: 'center', label: 'Grandeur', field: 'height', sortable: true },
   { name: 'weight', align: 'center', label: 'Poids', field: 'weight', sortable: true },
   { name: 'nbAbilities', align: 'center', label: 'Nb habilité(s)', field: 'nbAbilities', sortable: true },
   { name: 'nbForms', align: 'center', label: 'Nb formes', field: 'nbForms', sortable: true }
]
//const nbPokemeonToGet = 20

let pokemonsList = ref<IPokemon[]>([])
let pokemonsListFiltered = ref<IPokemon[]>([])
let pokemon = reactive<IPokemon>({ name: '', url: '' })
let msgErrorToggle = ref(false)
let msgErrorToggleDetails = ref(false)
let msgError = reactive({})
let openDialogToggle = ref(false)
let searchValue = ref('')

function fetchPokemons() {
   // TODO faire pagination

   api.get('pokemon/?limit=60&offset=20"')
      .then((res) => {
         return Promise.all(
            res.data.results.map((pokemon: IPokemon) => {
               return getPokemonDetails(pokemon.url)
            })
         )
      })
      .then((res) => {
         pokemonsList.value = res.map((pokemon: IPokemonData) => {
            return pokemon.data
         })
         pokemonsListFiltered.value = pokemonsList.value
      })
      .catch((error) => {
         msgErrorToggle.value = true
         msgError = error.config
         console.log('error.config', error.config)
      })
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
</script>

<style scoped>
.card {
   width: 80%;
}
.margin-null {
   margin: 0;
}
</style>
