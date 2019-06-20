// Author: Linwish
// Description: A nodejs scraper for fetching Baidu news.

const express = require('express');
const superagent= require('superagent');
const cheerio = require('cheerio');

const app = express();

// Initialize server
let server = app.listen(3000, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(`Server is running at ${host}:${port}`);
});

// Global news list
let gHotNews = [];                       

superagent.get('http://news.baidu.com/').end(async (err, res) => {
  if (err) {
    console.log(`Error fetching hot news: ${err}`)
  } else {
    gHotNews = await getHotNews(res)
  }
});

app.get('/', async (req, res, next) => {
    res.json({
        hotNews: gHotNews,
    });
});

// Parse hot news
let getHotNews = (res) => {
    let hotNews = [];
    let $ = cheerio.load(res.text);
    $('div#pane-news ul li a').each((_, elem) => {
      let news = {
        title: $(elem).text(),       
        href: $(elem).attr('href')   
      };
      hotNews.push(news)    
    });
    return hotNews
  };

let getNews = (elem) => {
    let news = {
        title: $(elem).text(),
        href: $(elem).attr('href'),
    };
    return news
}