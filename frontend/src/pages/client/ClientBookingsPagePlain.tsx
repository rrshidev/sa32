const ClientBookingsPagePlain = () => {
  console.log('ClientBookingsPagePlain - Component rendered');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Мои записи - Plain версия</h1>
      <p>Если видите этот текст, то проблема в MUI!</p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}>
        <h2>Тестовый блок</h2>
        <p>Это должен быть виден белый блок с текстом.</p>
      </div>
    </div>
  );
};

export default ClientBookingsPagePlain;
