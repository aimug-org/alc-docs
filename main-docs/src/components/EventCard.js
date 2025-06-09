import React from 'react';
import styles from './EventCard.module.css';

const EventCard = ({ event }) => {
  const getBadgeClass = (type) => {
    const typeMap = {
      'showcase': 'showcase-badge',
      'office-hours': 'office-hours-badge',
      'hacky-hour': 'hacky-hour-badge',
      'field-trip': 'field-trip-badge',
      'workshop': 'workshop-badge',
      'special': 'special-badge'
    };
    return typeMap[type] || 'showcase-badge';
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'live': 'status-live',
      'upcoming': 'status-upcoming',
      'past': 'status-past'
    };
    return statusMap[status] || 'status-upcoming';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const addToCalendar = () => {
    const startDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className={`${styles.eventCard} event-card`}>
      <div className={styles.eventHeader}>
        <span className={`event-badge ${getBadgeClass(event.type)}`}>
          <i className={`fas fa-${event.icon || 'calendar'}`}></i>
          {event.type.replace('-', ' ')}
        </span>
        {event.status && (
          <span className={`status-indicator ${getStatusClass(event.status)}`}>
            {event.status === 'live' && <i className="fas fa-circle"></i>}
            {event.status === 'upcoming' && <i className="fas fa-clock"></i>}
            {event.status === 'past' && <i className="fas fa-check"></i>}
            {event.status}
          </span>
        )}
      </div>
      
      <h3 className={styles.eventTitle}>{event.title}</h3>
      
      <div className={styles.eventMeta}>
        <div className="event-info">
          <i className="fas fa-calendar-alt"></i>
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="event-info">
          <i className="fas fa-clock"></i>
          <span>{formatTime(event.time)}</span>
        </div>
        <div className="event-info">
          <i className="fas fa-map-marker-alt"></i>
          <span>{event.location}</span>
        </div>
        {event.format && (
          <div className="event-info">
            <i className="fas fa-desktop"></i>
            <span>{event.format}</span>
          </div>
        )}
      </div>
      
      <p className={styles.eventDescription}>{event.description}</p>
      
      {event.speakers && event.speakers.length > 0 && (
        <div className={styles.speakers}>
          <h4>Speakers:</h4>
          <ul>
            {event.speakers.map((speaker, index) => (
              <li key={index}>{speaker}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className={styles.eventActions}>
        {event.rsvpLink && (
          <a 
            href={event.rsvpLink} 
            className="button button--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-user-plus"></i>
            RSVP Now
          </a>
        )}
        
        {event.status !== 'past' && (
          <button 
            onClick={addToCalendar}
            className="button button--secondary"
          >
            <i className="fas fa-calendar-plus"></i>
            Add to Calendar
          </button>
        )}
        
        {event.recordingLink && (
          <a 
            href={event.recordingLink} 
            className="button button--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-play"></i>
            Watch Recording
          </a>
        )}
        
        {event.resourcesLink && (
          <a 
            href={event.resourcesLink} 
            className="button button--secondary"
          >
            <i className="fas fa-file-alt"></i>
            Resources
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;
