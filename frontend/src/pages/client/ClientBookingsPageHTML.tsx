import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

interface Booking {
  id: string;
  bookingDate: string;
  status: string;
  clientComment?: string;
  service: {
    id: string;
    name: string;
    description: string;
  };
  serviceProvider: {
    id: string;
    email: string;
    phone: string;
    serviceProfile: {
      name: string;
      address: string;
      city: {
        name: string;
      };
    };
  };
}

const ClientBookingsPageHTML = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await apiClient.get('/booking/client');
      console.log('ClientBookingsPageHTML - Bookings loaded:', response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Не удалось загрузить записи');
    } finally {
      setLoading(false);
    }
  };

  console.log('ClientBookingsPageHTML - State:', { loading, bookingsCount: bookings.length, error });

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'blue', 
        color: 'white',
        minHeight: '100vh'
      }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  console.log('ClientBookingsPageHTML - About to render, bookings count:', bookings.length);

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>DEBUG: HTML Version Rendered!</h1>
      
      <button 
        onClick={() => navigate('/client')}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: 'white',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Назад в личный кабинет
      </button>

      <h2>Мои записи ({bookings.length})</h2>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: 'orange',
          color: 'black',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          Ошибка: {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          color: 'black',
          textAlign: 'center',
          borderRadius: '8px'
        }}>
          <p>У вас пока нет записей</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                padding: '20px',
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            >
              <h3>{booking.service.name}</h3>
              <p><strong>Автосервис:</strong> {booking.serviceProvider.serviceProfile.name}</p>
              <p><strong>Адрес:</strong> {booking.serviceProvider.serviceProfile.address}, {booking.serviceProvider.serviceProfile.city.name}</p>
              <p><strong>Дата:</strong> {new Date(booking.bookingDate).toLocaleString('ru-RU')}</p>
              <p><strong>Статус:</strong> {booking.status}</p>
              {booking.clientComment && (
                <p><strong>Комментарий:</strong> {booking.clientComment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientBookingsPageHTML;
