let navigate: ((path: string) => void) | null = null;

export const setNavigationFunction = (fn: (path: string) => void) => {
    navigate = fn;
};

export const redirectTo = (path: string) => {
    if (navigate) {
        navigate(path);
    } else {
        window.location.href = path;
    }
};