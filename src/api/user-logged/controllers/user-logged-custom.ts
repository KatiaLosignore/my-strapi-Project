import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::user-logged.user-logged', ({ strapi }) => ({
  // Metodo personalizzato per ottenere gli utenti loggati con campi filtrati
  async findCustom(ctx: Context) {
    try {
      strapi.log.debug('findCustom: Metodo chiamato');

      // Recupero gli utenti loggati con le relazioni specificate
      const users = await strapi.entityService.findMany('api::user-logged.user-logged', {
        populate: [
          'photo',
          // 'login_id',
          'wishlists_id',
          // 'tickets_id',
          // 'products_cart_id',
          // 'reviews_id',
        ],
      });

      strapi.log.debug('findCustom: Utenti recuperati', users);

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

      // Mappa gli utenti e filtra i campi richiesti
      const customResponse = users.map((user: any) => {
        // Aggiunta di un controllo per verificare se user e attributes sono definiti
        if (!user || !user.attributes) {
          strapi.log.debug('findCustom: Utente o attributi mancanti', user);
          return null; // Oppure gestisci il caso come preferisci
        }

        const { attributes } = user;

        return {
          name: attributes.name || null, // null se name è undefined
          surname: attributes.surname || null, // null se surname è undefined
          photo: filterImageFields(attributes.photo),
          // login_id: attributes.login_id?.data?.attributes?.email || null,
          wishlists_id: attributes.wishlists_id?.data || [],
          // tickets_id: attributes.tickets_id?.data || [],
          // products_cart_id: attributes.products_cart_id?.data || [],
          // reviews_id: attributes.reviews_id?.data || [],
        };
      }).filter(user => user !== null); // Rimuovo gli utenti null dalla risposta

      strapi.log.debug('findCustom: Risposta personalizzata creata', customResponse);

      // Struttura della risposta
      const response = {
        data: customResponse,
        meta: {
          total: customResponse.length,  // Numero totale di utenti trovati
        },
      };

      return ctx.send(response);  // Invia la risposta
    } catch (error) {
      strapi.log.error('findCustom: Errore durante l\'esecuzione', error);
      ctx.throw(500, error);
    }
  },
}));
