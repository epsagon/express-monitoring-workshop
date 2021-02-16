const express = require('express');
const got = require('got');
const slshttp = require('serverless-http')

const WEATHER_API_URL = 'https://weather.node-congress.workshop.epsagon.com/weather';
const NEWS_API_URL = 'https://news.node-congress.workshop.epsagon.com/news';
const FACT_API_URL = 'https://facts.node-congress.workshop.epsagon.com/facts';


function getWeather(city = '') {
  const URL = `${WEATHER_API_URL}/${city}`
    return got(URL).json().catch((err) => null); // json
}
function getNews(city = '') {
    const URL = `${NEWS_API_URL}/${city}`
    return got(URL).json().catch((err) => null); // json
}
function getFactForToday() {
    const d = new Date();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const URL = `${FACT_API_URL}/${month}/${day}`;
  return got(URL).text().catch((err) => null); // string
}


const app = express();
app.get('/digest/:city', async (req, res) => {
    const city = req.params.city;
    const [weather, news, fact] = await Promise.all([
            getWeather(city),
            getNews(city),
            getFactForToday()
        ]);
    res.json({ weather, news, fact });
});
app.use('*', (req, res) => {
    res.status(404).send('Not Found');
})
app.listen(3000, () => console.log('App is now online at port 3000'));

module.exports.handler = slshttp(app)



