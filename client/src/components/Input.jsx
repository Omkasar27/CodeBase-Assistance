function Input({ label, error, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm text-textSecondary mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-sidebar border rounded px-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary/60 outline-none transition-colors focus:border-accent ${
          error ? "border-red-400" : "border-border"
        }`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1.5">{error}</p>}
    </div>
  );
}

export default Input;