<template>
  <div>
    <nav class="border-b">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <router-link to="/" class="font-semibold">Moje Recepty</router-link>
        <div class="flex items-center gap-4">
          <router-link to="/" class="text-sm text-gray-700">Domů</router-link>
          <router-link to="/add" class="text-sm text-gray-700">Přidat</router-link>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
  
</template>

