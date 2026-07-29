function Input({ label, error, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm text-textSecondary mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-surface border rounded-lg px-4 py-2.5 text-textPrimary placeholder:text-textSecondary/50 outline-none transition-colors focus:border-accent ${
          error ? "border-red-500" : "border-border"
        }`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1.5">{error}</p>}
    </div>
  );
}

export default Input;