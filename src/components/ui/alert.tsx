type AlertProps = {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    isActionDisabled?: boolean;
};

export function Alert({
    title,
    description,
    actionLabel = "Try Again",
    onAction,
    isActionDisabled = false,
}: AlertProps) {
    return (
        <section aria-live="assertive" className="rounded-card border border-border bg-surface px-6 py-10 text-center shadow-soft" role="alert">
            <div aria-hidden="true" className="text-4xl leading-none text-danger">⚠</div>
            <h3 className="mt-2.5 text-xl font-semibold text-text">{title}</h3>

            {description && (
                <p className="mt-1 text-muted">{description}</p>
            )}

            {onAction && (
                <button
                    className="
            mt-4 inline-flex min-h-10
            items-center justify-center
            rounded-field border border-primary
            bg-primary px-4 font-bold text-white
            transition hover:-translate-y-px
            hover:border-primary-strong
            hover:bg-primary-strong
            disabled:translate-y-0
          "
                    disabled={isActionDisabled}
                    onClick={onAction}
                    type="button"
                >
                    {actionLabel}
                </button>
            )}
        </section>
    );
}