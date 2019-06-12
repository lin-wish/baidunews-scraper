const express = require('express');
const superagent= require('superagent');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');

const app = express();
const nightmare = Nightmare({ show: true }); 

// Initialize server
let server = app.listen(3000, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(`Server is running at ${host}:${port}`);
});

// Global news list
let gHotNews = [];                       
let gLocalNews = [];    

superagent.get('http://news.baidu.com/').end(async (err, res) => {
  if (err) {
    console.log(`Error fetching hot news: ${err}`)
  } else {
    gHotNews = await getHotNews(res)
  }
});

nightmare
.goto('http://news.baidu.com/')
.wait("div#local_news")
.evaluate(() => document.querySelector("div#local_news").innerHTML)
.then(res => {
  gLocalNews = getLocalNews(res)
})
.catch(error => {
  console.log(`Error fetching local news: ${error}`);
})

app.get('/', async (req, res, next) => {
    res.json({
        hotNews: gHotNews,
        localNews: gLocalNews
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

// Parse local news
let getLocalNews = (res) => {
  let localNews = [];
  let $ = cheerio.load(res.text);
  $('ul#localnews-focus li a').each((_, elem) => {
    localNews.push(getNews(elem))
  });
  $('div#localnews-zixun ul li a').each((_, elem) => {
    localNews.push(getNews(elem));
  });
  return localNews
};

let getNews = (elem) => {
    let news = {
        title: $(elem).text(),
        href: $(elem).attr('href'),
    };
    return news
}