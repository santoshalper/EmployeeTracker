import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
    user: 'postgres',
    password: 'vijay',
    host: 'localhost',
    database: 'employees_db',
    port: 5432,
});
const connectToDb = async () => {
    try {
        await pool.connect();
    }
    catch (err) {
        console.error('error connecting to database:', err);
        process.exit(1);
    }
};
export { pool, connectToDb };
