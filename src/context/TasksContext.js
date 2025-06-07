import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDB, insertTask, fetchTasks, updateTask, deleteTask } from '../database/database';

const TasksContext = createContext();

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
    const [tasksByDate, setTasksByDate] = useState({});

    useEffect(() => {
        initDB();
    }, []);

    const loadTasks = async (date) => {
        const key = date.toISOString().split('T')[0];
        const tasks = await fetchTasks(key);
        setTasksByDate((prev) => ({
            ...prev,
            [key]: tasks,
        }));
    };

    const addTask = async (date, text) => {
        const key = date.toISOString().split('T')[0];
        await insertTask(key, text);
        await loadTasks(date);
    };

    const editTask = async (id, text, date) => {
        const key = date.toISOString().split('T')[0];
        await updateTask(id, text);
        await loadTasks(date);
    };

    const removeTask = async (id, date) => {
        const key = date.toISOString().split('T')[0];
        await deleteTask(id);
        await loadTasks(date);
    };

    return (
        <TasksContext.Provider value={{ tasksByDate, loadTasks, addTask, editTask, removeTask }}>
            {children}
        </TasksContext.Provider>
    );
};
