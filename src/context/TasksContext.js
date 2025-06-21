import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDB, insertTask, fetchTasks, updateTask, deleteTask } from '../database/database';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

        if (!isNaN(Number(id))) {
            await deleteTask(Number(id));
        }

        if (typeof id === 'string') {
            try {
                const token = await AsyncStorage.getItem('@token');
                await axios.delete(`http://192.168.0.105:3000/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (err) {
                console.error('Failed to delete from backend:', err.message);
            }
        }

        await fetchTasksFromBackendByDate(date);
    };

    const fetchTasksFromBackendByDate = async (date) => {
        const key = date.toISOString().split('T')[0];
        try {
            const res = await axios.get('http://192.168.0.105:3000/posts');
            const filtered = res.data.filter(post => {
                if (!post.createdAt) return false;
                const parsedDate = new Date(post.createdAt);
                if (isNaN(parsedDate.getTime())) return false;

                const postDate = parsedDate.toISOString().split('T')[0];
                return postDate === key;
            });

            setTasksByDate(prev => ({
                ...prev,
                [key]: filtered,
            }));
        } catch (err) {
            console.error('Failed to fetch posts from backend:', err);
        }
    };

    return (
        <TasksContext.Provider value={{
            tasksByDate,
            loadTasks,
            addTask,
            editTask,
            removeTask,
            fetchTasksFromBackendByDate
        }}>
            {children}
        </TasksContext.Provider>
    );
};
