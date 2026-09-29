import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showClose = true,
  closeOnOverlay = true,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  const handleOverlayClick = (event) => {
    if (
      closeOnOverlay &&
      event.target === event.currentTarget
    ) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-[modalOverlay_0.2s_ease-out]"
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`relative w-full ${sizeClasses[size] || sizeClasses.md} max-h-[90vh] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl animate-[modalContent_0.25s_ease-out] dark:border-slate-700 dark:bg-slate-900`}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
            <div className="min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={() => onClose?.()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-200 hover:rotate-90 hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                aria-label="Close modal"
              >
                <X size={17} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5 scrollbar-hide sm:p-6">
          {children}
        </div>
      </div>

      <style>
        {`
          @keyframes modalOverlay {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes modalContent {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .scrollbar-hide {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}