type EmptyStateProps = {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    isActionDisabled?: boolean;
};

export function EmptyState({
    title,
    description,
    actionLabel = "Clear Filters",
    onAction,
    isActionDisabled = false,
}: EmptyStateProps) {
    return (
        <section className=" rounded-card border border-border bg-surface px-6 py-10 text-center shadow-soft">
            <div aria-hidden="true" className="text-4xl leading-none text-primary">□</div>
            <h3 className="mt-2.5 text-xl font-semibold text-text">{title}</h3>

            {description && (
                <p className="mt-1 text-muted">{description}</p>
            )}

            {onAction && (
                <button
                    className="
            mt-4 inline-flex min-h-10
            items-center justify-center
            rounded-field border border-border
            bg-surface px-4 font-bold text-text
            transition hover:-translate-y-px
            hover:bg-surface-2
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