import { factories } from '@strapi/strapi';

// Questa riga permette di importare l'interfaccia o il tipo Context dal framework Koa, che è utile per gestire le richieste e risposte HTTP all'interno di un'app Strapi.
import { Context } from 'koa';         //CMS headless basato su Koa, importa l'oggetto chiamato Context dal modulo koa


// 'koa': nome del pacchetto. Qui si riferisce al framework Koa.
// Context: Rappresenta l'oggetto contesto di una richiesta in Koa.
// Quando viene gestita una richiesta HTTP, Koa crea un oggetto Context che contiene tutte le informazioni relative alla richiesta stessa, come i parametri della query, il corpo della richiesta, gli header e il contesto di risposta.
// Con questo oggetto, i middleware possono gestire e manipolare le richieste e le risposte HTTP.

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Metodo per ottenere tutti gli articoli con campi personalizzati e paginazione
  async findCustom(ctx: Context) {
    try {
      // Recupero dei parametri di query (ctx.query) per la paginazione, con valori predefiniti rispettivamente a 1 (prima pagina) e 10 (articoli per pagina).
      const { page = 1, pageSize = 10 } = ctx.query;

      // Calcolo l'offset (start) con la formula (page - 1) * pageSize, in modo che la paginazione funzioni correttamente.
      const start = (page - 1) * pageSize;

      // Recupera il numero totale di articoli
      // Utilizzo di strapi.entityService.count per ottenere il numero totale di articoli nel database. Questo serve a calcolare il numero di pagine totali.
      const totalArticles = await strapi.entityService.count('api::article.article');

      // Recupera gli articoli con i parametri di paginazione e le relazioni richieste
      const articles = await strapi.entityService.findMany('api::article.article', {
        populate: [
          'image',
          'category_id',
          'tags_id',
          'colors_id',
          'measure_id',
          'reviews_id',
        ],
        limit: pageSize,
        start,
      });

      // Funzione per filtrare i campi dell'immagine
      const filterImageFields = (image: any) => {
        if (!image) return null;

        return {
          id: image.id,
          name: image.name,
          alternativeText: image.alternativeText,
          caption: image.caption,
          width: image.width,
          height: image.height,
          formats: {
            thumbnail: image.formats?.thumbnail?.url || null,
            small: image.formats?.small?.url || null,
            medium: image.formats?.medium?.url || null,
          },
        };
      };

      // Mappa gli articoli e filtra i campi dell'immagine
      const customResponse = articles.map((article: any) => ({
        title: article.title,
        image: filterImageFields(article.image),
        price: article.price,
        available: article.available,
        slug: article.slug,
        description_long: article.description_long,
        description_short: article.description_short,
        amount: article.amount,
        category_id: article.category_id,
        tags_id: article.tags_id,
        colors_id: article.colors_id,
        measure_id: article.measure_id,
        reviews_id: article.reviews_id,
      }));

      // totalPages viene calcolato dividendo il numero totale di articoli per la dimensione della pagina (pageSize). Math.ceil arrotonda un numero per eccesso all'intero più vicino.
      // Math.floor => arrotonda un numero per difetto.
      const totalPages = Math.ceil(totalArticles / pageSize);



      // endpoint con parametri di query: '?page=2&pageSize=10'  per ottenere la seconda pagina con 10 articoli

      // Struttura della risposta con dati e informazioni di paginazione
      // Restituisce un oggetto response con i dati degli articoli e una sezione meta che include le informazioni di paginazione (pagina corrente, dimensione della pagina, numero totale di pagine e totale degli articoli).
      const response = {
        data: customResponse,
        meta: {
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            pageCount: totalPages,
            total: totalArticles,
          },
        },
      };

      return ctx.send(response);  // Metodo per inviare la risposta
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Metodo per filtrare articoli in base al Titolo
  async findByTitle(ctx: Context) {
    const { title } = ctx.query;

    console.log('Title from query:', title);  // Log per verificare se il titolo viene ricevuto

    // Verifica che il titolo sia presente e che non sia una stringa vuota
    if (!title || typeof title !== 'string') {
      console.log('No valid title provided');
      return ctx.badRequest('Title query parameter is required and must be a valid string');
    }

    // Converte il titolo in minuscolo per un confronto case-insensitive
    const normalizedTitle = title.toLowerCase();
    console.log('Normalized title:', normalizedTitle);

    try {
      const articles = await strapi.entityService.findMany('api::article.article', {
        filters: { title: { $containsi: normalizedTitle } },  // Filtro case-insensitive per il titolo
        populate: [
          'image',
          'category_id',
          'tags_id',
          'colors_id',
          'measure_id',
          'reviews_id',
        ],
      });

      console.log('Articles found:', articles.length);  // Log per verificare quanti articoli vengono trovati

      // Se non vengono trovati articoli, ritorna un messaggio
      if (articles.length === 0) {
        return ctx.send({ message: 'No articles found with the specified title' });
      }

      // Funzione per filtrare i campi dell'immagine
      const filterImageFields = (image: any) => {
        if (!image) return null;

        return {
          id: image.id,
          name: image.name,
          alternativeText: image.alternativeText,
          caption: image.caption,
          width: image.width,
          height: image.height,
          formats: {
            thumbnail: image.formats?.thumbnail?.url || null,
            small: image.formats?.small?.url || null,
            medium: image.formats?.medium?.url || null,
          },
        };
      };


      // Mappa gli articoli per restituire solo i campi desiderati
      const filteredResponse = articles.map((article: any) => ({
        title: article.title,
        image: filterImageFields(article.image),
        price: article.price,
        available: article.available,
        slug: article.slug,
        description_long: article.description_long,
        description_short: article.description_short,
        amount: article.amount,
        category_id: article.category_id,
        tags_id: article.tags_id,
        colors_id: article.colors_id,
        measure_id: article.measure_id,
        reviews_id: article.reviews_id,
      }));

      // Restituisce la risposta filtrata
      return ctx.send(filteredResponse);

    } catch (error) {
      // Logga l'errore e restituisce un errore di server
      console.error('Error while fetching articles:', error);
      return ctx.throw(500, 'An error occurred while fetching articles');
    }
  },

  // Metodo per filtrare articoli in base alla categoria
  async findByCategory(ctx: Context) {
    const { category } = ctx.query;

    console.log('Category from query:', category);  // Log per verificare se la categoria viene ricevuta

    if (!category) {
      console.log('No category provided');
      return ctx.badRequest('Category query parameter is required');
    }

    try {
      const articles = await strapi.entityService.findMany('api::article.article', {
        filters: {
          category_id: { name: { $containsi: category } } // Filtro per la categoria
        },
        populate: [
          'image',
          'category_id',
          'tags_id',
          'colors_id',
          'measure_id',
          'reviews_id',
        ],
      });

      console.log('Articles found:', articles.length);  // Log per verificare quanti articoli vengono trovati

      if (articles.length === 0) {
        return ctx.send({ message: 'No articles found with the specified category' });
      }

      // Funzione per filtrare i campi dell'immagine
      const filterImageFields = (image: any) => {
        if (!image) return null;

        return {
          id: image.id,
          name: image.name,
          alternativeText: image.alternativeText,
          caption: image.caption,
          width: image.width,
          height: image.height,
          formats: {
            thumbnail: image.formats?.thumbnail?.url || null,
            small: image.formats?.small?.url || null,
            medium: image.formats?.medium?.url || null,
          },
        };
      };

      const filteredResponse = articles.map((article: any) => ({
        title: article.title,
        image: filterImageFields(article.image),
        price: article.price,
        available: article.available,
        slug: article.slug,
        description_long: article.description_long,
        description_short: article.description_short,
        amount: article.amount,
        category_id: article.category_id,
        tags_id: article.tags_id,
        colors_id: article.colors_id,
        measure_id: article.measure_id,
        reviews_id: article.reviews_id,
      }));

      return ctx.send(filteredResponse);
    } catch (error) {
      console.error('Error while fetching articles:', error);  // Log per eventuali errori
      return ctx.throw(500, error);
    }
  },

  // Metodo che filtra la lista dei prodotti per ID o per Slug
  async findOne(ctx) {
    try {
      // Recupera il parametro id o slug dalla richiesta
      const { id } = ctx.params;

      // Cerca l'articolo nel database
      const entity = await strapi.db.query('api::article.article').findOne({
        where: {
          // Cerca l'articolo per id o slug
          $or: [
            { id: id },    // Ricerca per ID
            { slug: id }   // Ricerca per slug
          ]
        },
        // Inserisce le relazioni collegate
        populate: ['image', 'category_id', 'tags_id', 'colors_id', 'measure_id', 'reviews_id'],
      });

      // Se l'articolo non esiste, restituisce un errore
      if (!entity) {
        return ctx.notFound('Article not found!');
      }

        // Funzione per filtrare i campi dell'immagine
        const filterImageFields = (image) => {
          if (!image) return null;

          return {
            id: image.id,
            name: image.name,
            alternativeText: image.alternativeText,
            caption: image.caption,
            width: image.width,
            height: image.height,
            formats: {
              thumbnail: image.formats?.thumbnail?.url || null,
              small: image.formats?.small?.url || null,
              medium: image.formats?.medium?.url || null,
            },
          };
        };

      // Filtra i campi dell'immagine utilizzando la funzione filterImageFields
      if (entity.image) {
        entity.image = filterImageFields(entity.image);
      }

      // Restituisce l'articolo trovato con l'immagine filtrata
      return entity;

    } catch (err) {
      // Gestione degli errori
      ctx.badRequest('Error retrieving item details', err);
    }
  }


}));
