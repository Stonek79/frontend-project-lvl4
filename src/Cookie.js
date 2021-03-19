import Cookies from 'js-cookie';

const faker = require('faker');

if (!Cookies.get('username')) {
    Cookies.set('username', faker.name.findName());
  }

export default Cookies.get('username');
