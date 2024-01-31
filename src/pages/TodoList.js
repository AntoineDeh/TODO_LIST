import {
    Button,
    Container,
    Text,
    Title,
    Modal,
    TextInput,
    Group,
    Card,
    ActionIcon,
    Select,
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoonStars, Sun, Trash } from 'tabler-icons-react';

import {
    MantineProvider,
    ColorSchemeProvider,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [opened, setOpened] = useState(false);
    const [filter, setFilter] = useState('all');
    const [taskPriority, setTaskPriority] = useState('low');

    const [colorScheme, setColorScheme] = useLocalStorage({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });
    const toggleColorScheme = value =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    const taskTitle = useRef('');
    const taskSummary = useRef('');
    const taskStartDate = useRef('');
    const taskStartTime = useRef('');
    const taskEndDate = useRef('');
    const taskEndTime = useRef('');

    const navigate = useNavigate();

    function initApp() {
        if (!localStorage.hasOwnProperty('tasks')) {
            localStorage.setItem('tasks', JSON.stringify([]));
        }
    }

    function createTask() {
        const newTask = {
            title: taskTitle.current.value,
            summary: taskSummary.current.value,
            startDate: taskStartDate.current.value,
            startTime: taskStartTime.current.value,
            endDate: taskEndDate.current.value,
            endTime: taskEndTime.current.value,
            done: false,
            priority: taskPriority,
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);  // Utilisez la fonction de mise à jour de l'état
        saveTasks((prevTasks) => [...prevTasks, newTask]);
    }

    function deleteTask(index) {
        var clonedTasks = [...tasks];

        clonedTasks.splice(index, 1);

        setTasks(clonedTasks);

        saveTasks([...clonedTasks]);
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        if (localStorage.hasOwnProperty('tasks')) {
            let loadedTasks = localStorage.getItem('tasks');

            console.log(loadedTasks);

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
        } else {
            setTasks([]);
        }
    }

    function getPriorityColor(priority) {
        switch (priority) {
            case 'low':
                return 'green';
            case 'medium':
                return 'yellow';
            case 'high':
                return 'red';
            default:
                return 'gray';
        }
    }

    useEffect(() => {
        initApp();
        loadTasks();
    }, []);

    console.log(tasks);


    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}>

            <MantineProvider
                theme={{ colorScheme, defaultRadius: 'md' }}
                withGlobalStyles
                withNormalizeCSS>

                <div className='App'>
                    <Button
                        onClick={() => {
                            navigate('/CalendarPage'); // Utilisez la fonction de navigation pour rediriger
                        }}
                        style={{ position: 'fixed', left: 120, bottom: 16, zIndex: 999 }}
                    >
                        Calendar
                    </Button>
                    <Button
                        onClick={() => {
                            setOpened(true);
                        }}
                        style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 999 }}
                    >
                        New Task
                    </Button>
                    <ActionIcon
                        color={'blue'}
                        onClick={() => toggleColorScheme()}
                        size='lg'
                        style={{ position: 'fixed', left: 220, bottom: 16, zIndex: 999 }}
                    >
                        {colorScheme === 'dark' ? (
                            <Sun size={16} />
                        ) : (
                            <MoonStars size={16} />
                        )}
                    </ActionIcon>
                    <Modal
                        opened={opened}
                        size={'md'}
                        title={'New Task'}
                        withCloseButton={false}
                        onClose={() => {
                            setOpened(false);
                        }}
                        centered
                    >
                        <TextInput
                            mt={'md'}
                            ref={taskTitle}
                            placeholder={'Task Title'}
                            required
                            label={'Title'}
                        />
                        <TextInput
                            ref={taskSummary}
                            mt={'md'}
                            placeholder={'Task Summary'}
                            label={'Summary'}
                        />
                        <Select
                            label="Priority"
                            placeholder="Select priority"
                            value={taskPriority}
                            onChange={(value) => setTaskPriority(value)}
                            data={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' },
                            ]}
                        />
                        <TextInput
                            ref={taskStartDate}
                            mt={'md'}
                            type="date"
                            placeholder={'Start Date'}
                            label={'Start Date'}
                        />
                        <TextInput
                            ref={taskStartTime}
                            mt={'md'}
                            type="time"
                            placeholder={'Start Time'}
                            label={'Start Time'}
                        />
                        <TextInput
                            ref={taskEndDate}
                            mt={'md'}
                            type="date"
                            placeholder={'End Date'}
                            label={'End Date'}
                        />
                        <TextInput
                            ref={taskEndTime}
                            mt={'md'}
                            type="time"
                            placeholder={'End Time'}
                            label={'End Time'}
                        />
                        <Group mt={'md'} position={'apart'}>
                            <Button
                                onClick={() => {
                                    setOpened(false);
                                }}
                                variant={'subtle'}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    createTask();
                                    setOpened(false);
                                }}
                            >
                                Create Task
                            </Button>
                        </Group>
                    </Modal>

                    <div className='title-container'>
                        {/* Titre "My Tasks" à gauche */}
                        <Title
                            sx={{
                                fontFamily: 'Greycliff CF',
                                fontWeight: 900,
                            }}
                        >
                            My Tasks
                        </Title>
                    </div>

                    {/* Conteneur pour les filtres à droite */}
                    <div className='filter-container' style={{ flexDirection: 'column' }}>
                        <Group>
                            {/* Filtre 1 */}
                            <Button
                                onClick={() => setFilter('all')}
                                variant={filter === 'all' ? 'filled' : 'outline'}
                            >
                                All
                            </Button>
                            <Button
                                onClick={() => setFilter('inProgress')}
                                variant={filter === 'inProgress' ? 'filled' : 'outline'}
                            >
                                In Progress
                            </Button>
                            <Button
                                onClick={() => setFilter('done')}
                                variant={filter === 'done' ? 'filled' : 'outline'}
                            >
                                Done
                            </Button>
                        </Group>

                        <Group>
                            {/* Filtre 2 */}
                            <Button
                                onClick={() => setFilter('lowPriority')}
                                variant={filter === 'lowPriority' ? 'filled' : 'outline'}
                            >
                                Low Priority
                            </Button>
                            <Button
                                onClick={() => setFilter('mediumPriority')}
                                variant={filter === 'mediumPriority' ? 'filled' : 'outline'}
                            >
                                Medium Priority
                            </Button>
                            <Button
                                onClick={() => setFilter('highPriority')}
                                variant={filter === 'highPriority' ? 'filled' : 'outline'}
                            >
                                High Priority
                            </Button>
                        </Group>
                    </div>

                    <Container size={550} my={20}>
                        {tasks.length > 0 ? (
                            tasks.map((task, index) => {
                                if (
                                    (filter === 'all') ||
                                    (filter === 'inProgress' && !task.done) ||
                                    (filter === 'done' && task.done) ||
                                    (filter === 'lowPriority' && task.priority === 'low') ||
                                    (filter === 'mediumPriority' && task.priority === 'medium') ||
                                    (filter === 'highPriority' && task.priority === 'high')
                                ) {
                                    return (
                                        <Card withBorder key={index} mt={'sm'} style={{ borderLeft: `7px solid ${getPriorityColor(task.priority)}` }}>
                                            <Group position={'apart'}>
                                                <Text weight={'bold'}>{task.title}</Text>
                                                <ActionIcon
                                                    onClick={() => {
                                                        deleteTask(index);
                                                    }}
                                                    color={'red'}
                                                    variant={'transparent'}>
                                                    <Trash />
                                                </ActionIcon>
                                            </Group>
                                            <input
                                                type="checkbox"
                                                checked={task.done}
                                                onChange={() => {
                                                    const updatedTasks = [...tasks];
                                                    updatedTasks[index].done = !updatedTasks[index].done;
                                                    setTasks(updatedTasks);
                                                    saveTasks(updatedTasks);
                                                }}
                                            />
                                            <Text color={'dimmed'} size={'md'} mt={'sm'}>
                                                Priority: {task.priority}
                                            </Text>
                                            <Text color={'dimmed'} size={'md'} mt={'sm'}>
                                                {task.summary
                                                    ? task.summary
                                                    : 'No summary was provided for this task'}
                                            </Text>
                                            <Text color={'dimmed'} size={'md'} mt={'sm'}>
                                                {task.startDate
                                                    ? `Start Date: ${task.startDate}`
                                                    : 'No date specified'}
                                            </Text>
                                            <Text color={'dimmed'} size={'md'} mt={'sm'}>
                                                {task.startTime
                                                    ? `Start Time: ${task.startTime}`
                                                    : 'No time specified'}
                                            </Text>
                                            <Text color={'dimmed'} size={'md'} mt={'sm'}>
                                                {task.endDate
                                                    ? `End Date: ${task.endDate}`
                                                    : 'No date specified'}
                                            </Text>
                                            <Text color={'dimmed'} size={'md'} mt={'sm'}>
                                                {task.endTime
                                                    ? `End Time: ${task.endTime}`
                                                    : 'No date specified'}
                                            </Text>
                                        </Card>
                                    );
                                }
                            })
                        ) : (
                            <Text size={'lg'} mt={'md'} color={'dimmed'}>
                                You have no tasks
                            </Text>
                        )}
                    </Container>
                </div>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}
