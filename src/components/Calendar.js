import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calendar = ({ tasks }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Convertissez les tâches en événements pour le calendrier
        const convertedEvents = tasks.map((task) => ({
            title: task.title,
            start: `${task.startDate}T${task.startTime}`,
            end: `${task.endDate}T${task.endTime}`,
            backgroundColor: getPriorityColor(task.priority),
        }));

        setEvents(convertedEvents);
    }, [tasks]);

    // Fonction pour obtenir la couleur de priorité
    const getPriorityColor = (priority) => {
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
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
            />
        </div>
    );
};

export default Calendar;