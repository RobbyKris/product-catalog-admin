import { useEffect, useState } from "react";

export function useDebounce<T>(
    value: T,
    delay = 400,
): T {
    // Menyimpan value yang sudah melewati waktu debounce.
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Setiap value berubah, mulai timer baru.
        const timeoutId = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Timer sebelumnya dibatalkan jika user
        // mengetik lagi sebelum waktu delay selesai.
        return () => { window.clearTimeout(timeoutId); };
    }, [value, delay]);

    return debouncedValue;
}