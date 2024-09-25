

export default {
  routes: [
    {
      method: 'POST',
      path: '/messages/custom-create',
      handler: 'custom-controller.customCreate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/messages/custom-all', // Rotta personalizzata
      handler: 'custom-controller.getAllMessages',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/messages/custom-update/:id',
      handler: 'custom-controller.updateMessage',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/messages/custom-delete/:id',
      handler: 'custom-controller.deleteMessage',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
