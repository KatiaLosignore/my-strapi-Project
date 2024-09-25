/**
 * message router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::message.message');


//api create custom

// export default {
//   routes: [
//     {
//       method: 'POST',
//       path: '/messages/custom-create',  // Rotta personalizzata per creare messaggi
//       handler: 'message.customCreate',
//       config: {
//         policies: [],
//         middlewares: [],
//       },
//     },
//     {
//       method: 'GET',
//       path: '/messages/custom-all',  // Rotta personalizzata per ottenere tutti i messaggi in modo diverso
//       handler: 'message.getAllMessages',
//       config: {
//         policies: [],
//         middlewares: [],
//       },
//     },
//     {
//       method: 'PUT',
//       path: '/messages/custom-update/:id',  // Rotta personalizzata per aggiornare un messaggio
//       handler: 'message.updateMessage',
//       config: {
//         policies: [],
//         middlewares: [],
//       },
//     },
//     {
//       method: 'DELETE',
//       path: '/messages/custom-delete/:id',  // Rotta personalizzata per eliminare un messaggio
//       handler: 'message.deleteMessage',
//       config: {
//         policies: [],
//         middlewares: [],
//       },
//     },
//   ],
// };



