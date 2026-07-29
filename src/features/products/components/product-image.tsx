import { useState, type ComponentPropsWithoutRef } from "react";
import { FiImage } from "react-icons/fi";

import { joinClasses } from "../../../components/classnames";

type ProductImageProps = Omit<
    ComponentPropsWithoutRef<"img">,
    "alt" | "src" | "onError"
> & {
    alt: string;
    src?: string | null;
    fallbackLabel?: string;
};

export function ProductImage({
    alt,
    className,
    fallbackLabel = "No image",
    loading = "lazy",
    src,
    ...props
}: ProductImageProps) {
    const normalizedSrc = src?.trim() ?? "";
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const hasError = normalizedSrc === "" || failedSrc === normalizedSrc;

    if (hasError) {
        return (
            <div
                aria-label={`${alt}. ${fallbackLabel}`}
                className={joinClasses(
                    "flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-2 px-3 text-center text-muted",
                    className,
                )}
                role="img"
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-3 text-primary">
                    <FiImage aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold">{fallbackLabel}</span>
            </div>
        );
    }

    return (
        <img
            {...props}
            alt={alt}
            className={joinClasses(
                "h-full w-full",
                className,
            )}
            loading={loading}
            onError={() => {
                setFailedSrc(normalizedSrc);
            }}
            src={normalizedSrc}
        />
    );
}
