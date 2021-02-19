import levelup from 'levelup';
import leveljs from 'level-js';
import encode from 'encoding-down';

const db = levelup(encode(leveljs('tigo'), { valueEncoding: 'json' }));

export default db;
