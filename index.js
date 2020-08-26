const puppeteer = require("puppeteer");

const langs = ["es", "en", "de"];

const scrape = async () => {
  await Promise.all(
    langs.map(async (lang) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      /* This URL redirects to the URL of the specific language E.G:
       *              es.wikipedia.org/wiki/Special:Statistics
       * redirects to es.wikipedia.org/wiki/Especial:Estadísticas
       */
      const url = `https://${lang}.wikipedia.org/wiki/Special:Statistics`;

      try {
        await page.goto(url);
        const langActiveRegisteredUsers = await page.evaluate(() => {
          // I had to declare this string here because it became undefined in this scope somehow.
          // I have no idea why that is and I'm questioning everything I know
          const a = document.querySelector(
            "#mw-content-text > table > tbody > tr.mw-statistics-users-active > td.mw-statistics-numbers"
          );
          return a.textContent;
        });
        console.log(`${lang}: ${langActiveRegisteredUsers}`);
        await browser.close();
      } catch (e) {
        console.error(e);
        await browser.close();
      }
    })
  );
};

scrape();
