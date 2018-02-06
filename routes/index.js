// Routes

const express = require('express');
const router = express.Router();

const path = 'http://localhost:3000'

// create constants
const date = new Date();
const year = date.getFullYear();

router.get('/', (req, res, next) => {

    // create constants
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
    return res.render('details', {title: 'Details', canonical: `${path}details`, year: year, bgColor: '#ffffff', scroll: 'scroll', scrollTarget: '#sidebar-content'});
});

router.get('/about', (req, res, next) => {
    return res.render('about', {title: 'About', canonical: `${path}about`, year: year, bgColor: '#ffffff'});
});

module.exports = router;