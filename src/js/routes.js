export const routes = {
  '/': 'Home',
  '/books': {
    '/': 'Books',
    '/fantasy': 'FantasyBooks',
    '/cooking': 'CookingBooks',
  },
  '/about-us': 'AboutUs',
  '/shop/:category/:id': {
    'page': 'ShopProduct',
    'parameters': {
      'category': '[a-zA-Z]+',
      'id': '\\d+',
    },
  },
};
