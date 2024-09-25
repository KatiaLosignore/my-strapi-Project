/**
 * message controller
 */


import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::message.message');



// // creato controller custom

// import { factories } from '@strapi/strapi';

// // Le rotte predefinite di Strapi sono gestite automaticamente quando si utilizza factories.createCoreController

// export default factories.createCoreController('api::message.message', ({ strapi }) => ({
//   async customCreate(ctx) {
//     try {
//       const { name, surname, message, email } = ctx.request.body;

//       if (!name || !surname || !message || !email) {
//         return ctx.badRequest('Name, Surname, Message and Email are required');
//       }

//       await strapi.entityService.create('api::message.message', {
//         data: { name, surname, message, email },
//       });

//       ctx.send({ message: 'Messaggio inviato con successo' }, 201);
//     } catch (err) {
//       ctx.throw(500, 'Errore durante la creazione del messaggio');
//     }
//   },

//   async getAllMessages(ctx) {
//     try {
//       const messages = await strapi.entityService.findMany('api::message.message');
//       ctx.send(messages, 200);
//     } catch (err) {
//       ctx.throw(500, 'Errore durante il recupero dei messaggi');
//     }
//   },

//   async updateMessage(ctx) {
//     try {
//       const { id } = ctx.params;
//       const { name, surname, message, email } = ctx.request.body;

//       if (!id) {
//         return ctx.badRequest('Message ID is required');
//       }

//       const updatedMessage = await strapi.entityService.update('api::message.message', id, {
//         data: { name, surname, message, email },
//       });

//       if (!updatedMessage) {
//         return ctx.notFound('Message not found');
//       }

//       ctx.send({ message: 'Messaggio aggiornato con successo' }, 200);
//     } catch (err) {
//       ctx.throw(500, 'Errore durante l\'aggiornamento del messaggio');
//     }
//   },

//   async deleteMessage(ctx) {
//     try {
//       const { id } = ctx.params;

//       if (!id) {
//         return ctx.badRequest('Message ID is required');
//       }

//       const deletedMessage = await strapi.entityService.delete('api::message.message', id);

//       if (!deletedMessage) {
//         return ctx.notFound('Message not found');
//       }

//       ctx.send({ message: 'Messaggio cancellato con successo' }, 200);
//     } catch (err) {
//       ctx.throw(500, 'Errore durante la cancellazione del messaggio');
//     }
//   },
// }));



