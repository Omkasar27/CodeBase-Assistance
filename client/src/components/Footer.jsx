import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="font-semibold text-textPrimary mb-2">AI Codebase Assistant</p>
            <p className="text-sm text-textSecondary max-w-xs">
              Connect a GitHub repository and understand it in minutes — chat,
              architecture insights, and an onboarding roadmap, generated
              automatically.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-textSecondary uppercase tracking-wide mb-3">
              Product
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="text-textSecondary hover:text-textPrimary">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-textSecondary hover:text-textPrimary">
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-textSecondary uppercase tracking-wide mb-3">
              Resources
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/Omkasar27/CodeBase-Assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-textSecondary hover:text-textPrimary"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Omkasar27/CodeBase-Assistance#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-textSecondary hover:text-textPrimary"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-textSecondary">
            © {new Date().getFullYear()} AI Codebase Assistant. Built as a
            portfolio project.
          </p>
          <p className="text-xs font-mono text-textSecondary">
            React · Node.js · Python · MongoDB · ChromaDB · Groq
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;