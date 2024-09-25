import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::message.message', ({ strapi }) => ({

  // Funzione personalizzata per creare un messaggio
  async customCreate(ctx) {
    try {
      const { name, surname, message, email } = ctx.request.body;

      // Controllo dei campi obbligatori
      if (!name || !surname || !message || !email) {
        return ctx.badRequest('Name, Surname, Message, and Email are required');
      }

      // Creazione del messaggio
      await strapi.entityService.create('api::message.message', {
        data: { name, surname, message, email },
      });

      // Risposta di successo
      ctx.send({ message: 'Messaggio inviato con successo' }, 201);
    } catch (err) {
      // Errore durante la creazione
      ctx.throw(500, 'Errore durante la creazione del messaggio');
    }
  },

  // Funzione per ottenere tutti i messaggi
  async getAllMessages(ctx) {
    try {
      // Recupero di tutti i messaggi
      const messages = await strapi.entityService.findMany('api::message.message');

      // Risposta con i messaggi
      ctx.send(messages, 200);
    } catch (err) {
      // Errore durante il recupero
      ctx.throw(500, 'Errore durante il recupero dei messaggi');
    }
  },

  // Funzione per aggiornare un messaggio
  async updateMessage(ctx) {
    try {
      const { id } = ctx.params;
      const { name, surname, message, email } = ctx.request.body;

      // Controllo ID del messaggio
      if (!id) {
        return ctx.badRequest('Message ID is required');
      }

      // Aggiornamento del messaggio
      const updatedMessage = await strapi.entityService.update('api::message.message', id, {
        data: { name, surname, message, email },
      });

      if (!updatedMessage) {
        // Se il messaggio non esiste
        return ctx.notFound('Message not found');
      }

      // Risposta di successo
      ctx.send({ message: 'Messaggio aggiornato con successo' }, 200);
    } catch (err) {
      // Errore durante l'aggiornamento
      ctx.throw(500, 'Errore durante l\'aggiornamento del messaggio');
    }
  },

  // Funzione per cancellare un messaggio
  async deleteMessage(ctx) {
    try {
      const { id } = ctx.params;

      // Controllo ID del messaggio
      if (!id) {
        return ctx.badRequest('Message ID is required');
      }

      // Eliminazione del messaggio
      const deletedMessage = await strapi.entityService.delete('api::message.message', id);

      if (!deletedMessage) {
        // Se il messaggio non esiste
        return ctx.notFound('Message not found');
      }

      // Risposta di successo
      ctx.send({ message: 'Messaggio cancellato con successo' }, 200);
    } catch (err) {
      // Errore durante la cancellazione
      ctx.throw(500, 'Errore durante la cancellazione del messaggio');
    }
  },
}));
