import fetch from 'node-fetch';
import cheerio from 'cheerio';

class Oploverz {
  async searchAnime(query) {
    try {
      const url = 'https://oploverz.life/?s=' + query;
      const response = await fetch(url);
      const body = await response.text();
      const $ = cheerio.load(body);

      const animeArray = $('article.animpost').map((index, element) => {
        const animeInfo = {
          title: $(element).find('.content-thumb img').attr('title'),
          image: $(element).find('.content-thumb img').attr('src'),
          type: $(element).find('.content-thumb .type').text(),
          score: parseFloat($(element).find('.content-thumb .score').text().trim()) || 0,
          status: $(element).find('.data .type').text(),
          link: $(element).find('.animposx a').attr('href'),
        };
        return animeInfo;
      }).get();

      return animeArray;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  async episodeList(url) {
    try {
      const response = await fetch(url);
      const body = await response.text();
      const $ = cheerio.load(body);

      return {
        animeInfo: {
          title: $('.entry-title').text(),
          synopsis: $('.entry-content').text(),
          genres: $('.genre-info a').map((_, elem) => $(elem).text()).get(),
          totalEpisodes: $('.lstepsiode .scrolling li').length,
        },
        episodeList: $('.lstepsiode .scrolling li').map((_, elem) => ({
          number: $(elem).find('.eps a').text(),
          title: $(elem).find('.lchx a').text(),
          date: $(elem).find('.date').text(),
          link: $(elem).find('.lchx a').attr('href'),
        })).get(),
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  async episodeInfo(url) {
    try {
      const response = await fetch(url);
      const body = await response.text();
      const $ = cheerio.load(body);

      const episodeInfo = {
        title: $('.entry-title').text(),
        episodeNumber: parseInt($('.epx span[itemprop="episodeNumber"]').text(), 10),
        image: $('.thumb img').attr('src'),
        synopsis: $('.entry-content').text(),
        genres: $('.genre-info a').map((_, elem) => $(elem).text()).get(),
        downloadLinks: $('.links_table tbody tr').map((_, elem) => ({
          server: $(elem).find('td:first-child').text(),
          quality: $(elem).find('td:nth-child(2) strong').text(),
          link: $(elem).find('td:nth-child(3) a').attr('href'),
        })).get(),
      };

      return episodeInfo;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
}

export default Oploverz;