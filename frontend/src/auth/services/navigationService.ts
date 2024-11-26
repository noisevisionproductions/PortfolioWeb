let navigate: ((path: string) => void) | null = null;

export const redirectTo = (path: string) => {
    if (navigate) {
        navigate(path);
    } else {
        window.location.href = path;
    }
};