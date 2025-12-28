export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading">
      <div>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>{message}</p>
      </div>
    </div>
  );
}



