function Button({ children, isLoading, variant = "primary", ...props }) {
  const baseStyles =
    "w-full py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent text-background hover:bg-accent/90",
    secondary: "bg-sidebar border border-border text-textPrimary hover:bg-surfaceHover",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}

export default Button;