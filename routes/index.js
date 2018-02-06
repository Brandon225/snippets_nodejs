// Routes

const express = require('express');
const router = express.Router();

const path = 'http://localhost:3000'


router.get('/', (req, res, next) => {

    const date = new Date();
    const year = date.getFullYear();
    const code = `<snippet><content><![CDATA[
console.log('$1: ', $2);
]]></content>
	<tabTrigger>log</tabTrigger>
	<scope>source.js</scope>
	<description>Log to the Console</description>
</snippet>`;
    return res.render('home', {title: 'Home', canonical: path, year: year, bgColor: '#222', code});
});

router.get('/details', (req, res, next) => {
    return res.send('Details!');
});

router.get('/about', (req, res, next) => {
    return res.send('About!');
});

module.exports = router;