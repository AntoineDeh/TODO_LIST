import React, {useEffect, useState} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Button, ActionIcon } from '@mantine/core';
import { MoonStars, Sun } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
    const [tasks, setTasks] = useState([]);
    const events = tasks.map((task) => ({
        title: task.title,
        start: new Date(task.startDate + 'T' + task.startTime),
        end: new Date(task.endDate + 'T' + task.endTime),
    }));

    const navigate = useNavigate();

    const [colorScheme, setColorScheme] = useLocalStorage({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    function loadTasks() {
        let loadedTasks = localStorage.getItem('tasks');

        let tasks = JSON.parse(loadedTasks);

        if (tasks) {
            tasks = tasks.map(task => ({ ...task, done: task.done || false }));
            setTasks(tasks);
        }
    }
    useEffect(() => {
        loadTasks();
    }, []);

    console.log(tasks);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme, defaultRadius: 'md' }} withGlobalStyles withNormalizeCSS>
                <div>
                    <h1>Calendar Page</h1>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />

                    {/* Ajout des boutons */}
                    <Button
                        onClick={() => {
                            navigate('/todo_react_app');
                        }}
                        style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 999 }}
                    >
                        TodoList
                    </Button>
                    <ActionIcon
                        color={'blue'}
                        onClick={() => toggleColorScheme()}
                        size="lg"
                        style={{ position: 'fixed', left: 120, bottom: 16, zIndex: 999 }}
                    >
                        {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
                    </ActionIcon>
                </div>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}
