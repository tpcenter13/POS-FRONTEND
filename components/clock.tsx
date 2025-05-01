import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaPowerOff } from 'react-icons/fa'; // Added FaPowerOff for the icon

const ClockWithCalendar = () => {
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function formatTime(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  function formatDate(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    return `${day}, ${dayNum} ${month} ${year}`;
  }

  return (
    <div style={styles.container}>
      {/* Calendar with date */}
      <div style={styles.section}>
        <FaCalendarAlt size={18} color="#4a90e2" />
        <span style={styles.text}>{currentDate}</span>
      </div>

      {/* Divider */}
      <div style={styles.divider}>-</div>

      {/* Clock with time */}
      <div style={styles.section}>
        <FaClock size={18} color="#4a90e2" />
        <span style={{ ...styles.text, color: '#4a90e2' }}>{currentTime}</span>
      </div>

      {/* Cancel Order Button */}
      <button style={styles.cancelOrderButton}>
        <span style={styles.cancelOrderText}>Cancel Order</span>
        <FaPowerOff size={14} color="#ff0000" style={{ marginLeft: 6 }} />
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: '8px 16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '6px 12px',
    marginRight: 8,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 500,
    color: '#222',
    whiteSpace: 'nowrap',
  },
  divider: {
    marginRight: 8,
    fontSize: 18,
    color: '#d0d0d0',
    fontWeight: 'bold',
  },
  cancelOrderButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '6px 12px',
    border: 'none',
    cursor: 'pointer',
  },
  cancelOrderText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#ff0000',
    whiteSpace: 'nowrap',
  },
};

export default ClockWithCalendar;