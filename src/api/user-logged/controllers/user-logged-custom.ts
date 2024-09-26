import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::user-logged.user-logged', ({ strapi }) => ({
  async findCustom(ctx: Context) {
    try {
      strapi.log.debug('findCustom: Metodo chiamato');

      // Recupero gli utenti loggati con le relazioni specificate
      const users = await strapi.entityService.findMany('api::user-logged.user-logged', {
        populate: ['photo', 'wishlists_id'],
      });

      strapi.log.debug('findCustom: Utenti recuperati:', users);

      // Se users è vuoto, aggiungi un log per controllare il contenuto
      if (users.length === 0) {
        strapi.log.debug('findCustom: Nessun utente trovato');
      } else {
        strapi.log.debug(`findCustom: Utenti trovati: ${users.length}`);
      }

      // Funzione per filtrare i campi dell'immagine
      const filterImageFields = (photo: any) => {
        if (!photo || !photo.data) {
          strapi.log.debug('findCustom: Foto mancante o dati mancanti');
          return null;
        }

        const { formats } = photo.data.attributes;
        return {
          small: formats?.small?.url || null,
          medium: formats?.medium?.url || null,
          thumbnail: formats?.thumbnail?.url || null,
        };
      };

      const customResponse = users.map((user: any) => {
        if (!user || !user.attributes) {
          strapi.log.debug('findCustom: Utente o attributi mancanti:', user);
          return null;
        }

        const { attributes } = user;
        return {
          name: attributes.name || null,
          surname: attributes.surname || null,
          photo: filterImageFields(attributes.photo),
          wishlists_id: attributes.wishlists_id?.data || [],
        };
      }).filter(user => user !== null);

      strapi.log.debug('findCustom: Risposta personalizzata creata:', customResponse);

      // Struttura della risposta
      const response = {
        data: customResponse,
        meta: {
          total: customResponse.length,
        },
      };

      return ctx.send(response);
    } catch (error) {
      strapi.log.error('findCustom: Errore durante l\'esecuzione', error);
      ctx.throw(500, error);
    }
  },
}));
