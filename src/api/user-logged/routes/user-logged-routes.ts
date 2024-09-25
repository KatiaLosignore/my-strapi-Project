export default {
  routes: [
    {
      method: 'GET',
      path: '/users-loggeds/custom-all',          // Definisce la rotta
      handler: 'user-logged-custom.findCustom',  // Metodo creato nel Controller custom
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};


