import React, {useEffect, useState} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Button, ActionIcon, Modal} from '@mantine/core';
import { MoonStars, Sun } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import './CalendarPage.css';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
    const [tasks, setTasks] = useState([]);
    const [showCompletedTasks, setShowCompletedTasks] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null); // Nouvel état pour la tâche sélectionnée
    const [isTaskModalOpen, setTaskModalOpen] = useState(false); // Nouvel état pour le modal

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low':
                return 'green';
            case 'medium':
                return 'orange';
            case 'high':
                return 'red';
            default:
                return 'gray';
        }
    };

    const getPriorityTextColor = (priority) => {
        switch (priority) {
            case 'low':
                return 'green-text';
            case 'medium':
                return 'orange-text';
            case 'high':
                return 'red-text';
            default:
                return 'gray-text';
        }
    };

    const filteredTasks = showCompletedTasks ? tasks : tasks.filter(task => !task.done);

    const events = filteredTasks.map((task) => ({
        title: task.title,
        start: new Date(task.startDate + 'T' + task.startTime),
        end: new Date(task.endDate + 'T' + task.endTime),
        backgroundColor: getPriorityColor(task.priority),
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

        if (loadedTasks !== null) {
            try {
                let tasks = JSON.parse(loadedTasks);

                if (Array.isArray(tasks)) {
                    tasks = tasks.map(task => ({ ...task, done: task.done || false }));
                    setTasks(tasks);
                } else {
                    console.error("'tasks' is not an array:", tasks);
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }
    }

    const handleEventClick = (event) => {
        const selectedTask = tasks.find(task => task.title === event.title);
        setSelectedTask(selectedTask);
        setTaskModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setTaskModalOpen(false);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme, defaultRadius: 'md' }} withGlobalStyles withNormalizeCSS>
                <div>
                    <h1>Calendar Page</h1>

                    <label>
                        <input
                            type="checkbox"
                            checked={showCompletedTasks}
                            onChange={() => setShowCompletedTasks(!showCompletedTasks)}
                        />
                        Show Completed Tasks
                    </label>

                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{height: 500}}
                        eventPropGetter={(event) => ({
                            style: {
                                backgroundColor: event.backgroundColor,
                            },
                        })}
                        onSelectEvent={handleEventClick}
                    />

                    {selectedTask && (
                        <Modal
                            opened={isTaskModalOpen}
                            size={'md'}
                            title={
                                <div className={`task-details-title ${getPriorityTextColor(selectedTask.priority)}`}>
                                    {selectedTask.title}
                                </div>
                            }
                            withCloseButton
                            onClose={handleCloseTaskModal}
                            centered
                        >
                            <div className="task-details">
                                <div className="task-details-item">
                                    <span>Priority:</span>
                                    <span>{selectedTask.priority}</span>
                                </div>
                                <div className="task-details-item">
                                    <span>Summary:</span>
                                    <span>{selectedTask.summary || 'No summary provided'}</span>
                                </div>
                                <div className="task-details-item">
                                    <span>Start Date:</span>
                                    <span>{selectedTask.startDate || 'Not specified'}</span>
                                </div>
                                <div className="task-details-item">
                                    <span>Start Time:</span>
                                    <span>{selectedTask.startTime || 'Not specified'}</span>
                                </div>
                                <div className="task-details-item">
                                    <span>End Date:</span>
                                    <span>{selectedTask.endDate || 'Not specified'}</span>
                                </div>
                                <div className="task-details-item">
                                    <span>End Time:</span>
                                    <span>{selectedTask.endTime || 'Not specified'}</span>
                                </div>
                            </div>
                        </Modal>
                    )}

                    <Button
                        onClick={() => {
                            navigate('/todo_react_app');
                        }}
                        style={{position: 'fixed', left: 16, bottom: 16, zIndex: 999}}
                    >
                        TodoList
                    </Button>
                    <ActionIcon
                        color={'blue'}
                        onClick={() => toggleColorScheme()}
                        size="lg"
                        style={{position: 'fixed', left: 120, bottom: 16, zIndex: 999}}
                    >
                        {colorScheme === 'dark' ? <Sun size={16}/> : <MoonStars size={16}/>}
                    </ActionIcon>
                </div>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}