const ClientBookingsPageStatic = () => {
  console.log('ClientBookingsPageStatic - Component called');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>STATIC: This should be visible!</h1>
      <p>If you see this text, React is working!</p>
      <div style={{
        backgroundColor: 'white',
        color: 'black',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Test Content</h2>
        <p>This is a test to see if static rendering works.</p>
      </div>
    </div>
  );
};

export default ClientBookingsPageStatic;
