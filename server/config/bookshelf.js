// import bookshelf from 'bookshelf';
import knex from './knex';
knex.debug(true);
// var bookshelf = bookshelf(knex);
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('pagination');
export default bookshelf;
// export default bookshelf(knex);