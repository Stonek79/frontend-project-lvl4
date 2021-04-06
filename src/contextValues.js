import Cookies from 'js-cookie';
import faker from 'faker';

if (!Cookies.get('username')) {
  Cookies.set('username', faker.name.findName());
}

const user = Cookies.get('username');

export default {
  user,
};
