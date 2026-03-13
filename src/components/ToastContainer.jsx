export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <button className="toast-close" onClick={() => onDismiss(t.id)}>x</button>
          <div className="toast-title">Notifikasi</div>
          <div className="toast-body">{t.message}</div>
          <div className="toast-time">
            {new Date(t.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
}
