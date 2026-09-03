export default function ImagePanel({ src, alt = '' }) {
  if (!src) return null;
  return (
    <div style={{
      width: '100%',
      maxHeight: 320,
      overflow: 'hidden',
      borderRadius: 8,
      marginBottom: 16,
      border: '1px solid #1e1e3f',
    }}>
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
}
