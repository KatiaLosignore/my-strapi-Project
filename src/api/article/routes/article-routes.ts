'use strict';

export default {
  routes: [
    {
      method: 'GET',
      path: '/articles/custom-all',  // Definisce la rotta
      handler: 'article-custom.findCustom',  // Associa il controller e il metodo
      config: {
        auth: false,  // Disabilita l'autenticazione
        middlewares: [],
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/articles/filter-by-title',  // Nuova rotta per il filtro
      handler: 'article-custom.findByTitle',  // Metodo associato nel controller
      config: {
        auth: false,  // Disabilita l'autenticazione
        middlewares: [],
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/articles/filter-by-category',
      handler: 'article-custom.findByCategory', // Nuovo metodo per filtrare per categoria
      config: {
        auth: false,    // Disabilita l'autenticazione
        middlewares: [],
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/articles/filter/:id',  // Percorso per ottenere il dettaglio di un singolo articolo
      handler: 'article-custom.findOne',  // Chiama il metodo findOne creato nel controller
      config: {
        auth: false,   // Disabilita l'autenticazione
        middlewares: [],
        policies: [],
      },
    },
  ],
};



