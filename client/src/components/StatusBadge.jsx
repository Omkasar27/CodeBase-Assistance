const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  indexing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  completed: "bg-accent/10 text-accent border-accent/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
};

const STATUS_LABELS = {
  pending: "Not Indexed",
  indexing: "Indexing...",
  completed: "Indexed",
  failed: "Indexing Failed",
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${style}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;