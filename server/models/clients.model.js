import bookshelf from '../config/bookshelf';

const TABLE_NAME = 'clients';

/**
 * Clients model.
 */
class Clients extends bookshelf.Model {

    /**
     * Get table name.
     */
    get tableName() {
        return TABLE_NAME;
    }

    /**
     * Table has timestamps.
     */
    get hasTimestamps() {
        return true;
    }

    verifyPassword(password) {
        return this.get('password') === password;
    }
}

export default Clients;