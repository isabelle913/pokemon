<template>
   <q-layout view="hhh lpR lFr">
      <q-header elevated>
         <q-toolbar>
            <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

            <q-toolbar-title>Ezmax Test App</q-toolbar-title>
            <q-img src="../assets/izou-inverse.png" style="max-width: 150px"></q-img>
         </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
         <q-list class="q-mt-lg">
            <ez-menu-link-item v-for="link in theLinks" :key="link.title" v-bind="link" class="text-h6" />
         </q-list>
      </q-drawer>

      <q-page-container>
         <router-view />
      </q-page-container>

      <q-footer elevated class="footer-nav">
         <q-tabs align="center">
            <q-route-tab v-for="link in theLinks" :key="link.title" :to="link.link" :label="link.title" />
         </q-tabs>
      </q-footer>
   </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EzMenuLinkItem from 'src/components/menu-link-item/ez-menu-link-item.vue'

const theLinks = [
   {
      title: 'Accueil',
      caption: 'On vous aime!',
      icon: 'home',
      link: '/accueil'
   },
   {
      title: 'Liste des Pokémons',
      caption: 'Atrappez-les tous!',
      icon: 'catching_pokemon',
      link: '/pokemon'
   },
   {
      title: 'About',
      caption: "Qu'est-ce que c'est?",
      icon: 'info',
      link: '/about'
   }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
   leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style>
.container {
   width: 80%;
   margin: 10% auto;
}
@media screen and (min-width: 1007px) {
   .footer-nav {
      display: none;
   }
}
</style>
