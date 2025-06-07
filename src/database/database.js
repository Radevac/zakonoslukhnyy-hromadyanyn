import { openDatabaseAsync } from 'expo-sqlite';

let db;

export const openDatabase = async () => {
    if (!db) {
        db = await openDatabaseAsync('violations.db');
    }
    return db;
};

export const initDB = async () => {
    const database = await openDatabase();
    await database.withTransactionAsync(async () => {
        await database.execAsync(`
      CREATE TABLE IF NOT EXISTS violations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT,
        geoLocation TEXT
      );
    `);
    });
};

export const insertTask = async (dateKey, { description, category, geoLocation }) => {
    const database = await openDatabase();
    await database.withTransactionAsync(async () => {
        await database.runAsync(
            'INSERT INTO violations (date, description, category, geoLocation) VALUES (?, ?, ?, ?)',
            [dateKey, description, category, geoLocation]
        );
    });
};

export const fetchTasks = async (dateKey) => {
    const database = await openDatabase();
    return await database.getAllAsync('SELECT * FROM violations WHERE date = ?', [dateKey]);
};

export const updateTask = async (id, { description, category, geoLocation }) => {
    const database = await openDatabase();
    await database.withTransactionAsync(async () => {
        await database.runAsync(
            'UPDATE violations SET description = ?, category = ?, geoLocation = ? WHERE id = ?',
            [description, category, geoLocation, id]
        );
    });
};

export const deleteTask = async (id) => {
    const database = await openDatabase();
    await database.withTransactionAsync(async () => {
        await database.runAsync('DELETE FROM violations WHERE id = ?', [id]);
    });
};
