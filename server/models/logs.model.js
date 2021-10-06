import bookshelf from '../config/bookshelf';

const TABLE_NAME = 'logs';

/**
 * Logs model.
 */
class Logs extends bookshelf.Model {

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

export default Logs;