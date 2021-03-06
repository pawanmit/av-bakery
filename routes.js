const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.redirect('/login');
});

routes.get('/customerSearch', (req, res) => {
  res.render('customer/search.ejs');
});

routes.get('/signup', (req, res) => {
  res.render('customer/signup.ejs', { pageTitle: 'Sign Up' });
});

module.exports = routes;
