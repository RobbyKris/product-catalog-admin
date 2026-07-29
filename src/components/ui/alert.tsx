import { FiAlertTriangle, FiCheckCircle, FiX } from "react-icons/fi";
import { Button } from "./button";
import { joinClasses } from "../classnames";

type AlertVariant =
    | "success"
    | "danger";

type AlertProps = {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    onDismiss?: () => void;
    isActionDisabled?: boolean;
    variant?: AlertVariant;
};

const variantClassNames: Record<
    AlertVariant,
    {
        container: string;
        icon: string;
    }
> = {
    success: {
        container: "border-success/25 bg-success-soft",
        icon: "bg-success text-white",
    },

    danger: {
        container: "border-danger/25 bg-danger-soft",
        icon: "bg-danger text-white",
    },
};

export function Alert({
    title,
    description,
    actionLabel = "Try Again",
    onAction,
    onDismiss,
    isActionDisabled = false,
    variant = "danger",
}: AlertProps) {
    const styles = variantClassNames[variant];

    const Icon =
        variant === "success"
            ? FiCheckCircle
            : FiAlertTriangle;

    return (
        <section
            aria-live={
                variant === "danger"
                    ? "assertive"
                    : "polite"
            }
            className={joinClasses("flex items-start gap-3 rounded-card border px-4 py-3 shadow-soft", styles.container)}
            role={
                variant === "danger"
                    ? "alert"
                    : "status"
            }
        >
            <span className={joinClasses("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", styles.icon)}>
                <Icon aria-hidden="true" className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-text">{title}</h3>

                {description ? (
                    <p className="mt-1 text-sm leading-5 text-muted">{description}</p>
                ) : null}

                {onAction ? (
                    <Button
                        className="mt-3"
                        disabled={isActionDisabled}
                        onClick={onAction}
                        size="sm"
                        type="button"
                        variant="secondary"
                    >
                        {actionLabel}
                    </Button>
                ) : null}
            </div>

            {onDismiss ? (
                <button
                    aria-label="Dismiss notification"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface/70 hover:text-text"
                    onClick={onDismiss}
                    type="button"
                >
                    <FiX aria-hidden="true" className="h-4 w-4" />
                </button>
            ) : null}
        </section>
    );
}