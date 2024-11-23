export const translations = {
    pl: {
        header: {
            title: "Moje Portfolio",
            navigation: {
                about: "O mnie",
                projects: "Projekty",
                contact: "Kontakt",
                login: "Zaloguj się",
                logout: "Wyloguj się"
            }
        },
        login: {
            email: "Wprowadź e-mail",
            password: "Wprowadź hasło",
            submit: "Zaloguj",
            register: "Kliknij, aby utworzyć nowe konto",
            title: "Logowanie",
            errors: {
                emailRequired: "Email jest wymagany",
                passwordRequired: "Hasło jest wymagane",
                invalidCredentials: "Nieprawidłowy email lub hasło",
                passwordLength: "Hasło musi mieć co najmniej 6 znaków",
                generic: "Wystąpił błąd podczas logowania"
            },
            success: {
                title: "Zalogowano pomyślnie",
                description: "Zostaniesz przekierowany do strony głównej"
            }
        },
        logout: {
            success: {
                title: "Wylogowano pomyślnie",
                description: "Zostałeś pomyślnie wylogowany"
            }
        },
        register: {
            email: "Wprowadź e-mail",
            name: "Imię (opcjonalnie)",
            companyName: "Nazwa firmy (opcjonalnie)",
            programmingLanguages: "Języki programowania (opcjonalnie)",
            password: "Wprowadź hasło",
            confirmPassword: "Potwierdź hasło",
            submit: "Utwórz konto",
            title: "Tworzenie nowego konta",
            success: {
                title: "Konto zostało utworzone",
                description: "Twoje konto zostało pomyślnie utworzone."
            },
            errors: {
                emailExists: "Ten email jest już zajęty",
                passwordLength: "Hasło musi mieć co najmniej 6 znaków",
                emailRequired: "Email jest wymagany",
                passwordRequired: "Hasło jest wymagane",
                invalidEmail: "Nieprawidłowy format email",
                generic: "Wystąpił błąd podczas rejestracji",
                registrationBlocked: "Nie możesz utworzyć nowego konta przez godzinę od ostatniej rejestracji.",
            }
        },
        heroSection: {
            title: "Software Developer",
            description: "Specjalizuję się w tworzeniu aplikacji Android oraz Web."
        },
        projectSection: {
            title: "Projekty",
        },
        contactSection: {
            contact: "Kontakt",
            message: "Wiadomość",
            submit: "Wyślij"
        }
    },
    en: {
        header: {
            title: "My Portfolio",
            navigation: {
                about: "About",
                projects: "Projects",
                contact: "Contact",
                login: "Log in",
                logout: "Log out"
            }
        },
        login: {
            email: "Enter e-mail",
            password: "Enter password",
            submit: "Login",
            register: "Click here to create a new account",
            title: "Log in",
            errors: {
                emailRequired: "Email is required",
                passwordRequired: "Password is required",
                passwordLength: "Password must be at least 6 characters long",
                invalidCredentials: "Invalid email or password",
                generic: "An error occurred while logging in"

            },
            success: {
                title: "Logged in successfully",
                description: "You will be redirected to the home page"

            }
        },
        logout: {
            success: {
                title: "Successfully logged out",
                description: "You have been successfully logged out"
            }
        },
        register: {
            email: "Enter e-mail",
            name: "Name (optional)",
            companyName: "Company name (optional)",
            programmingLanguages: "Programming languages (optional)",
            password: "Enter password",
            confirmPassword: "Confirm password",
            submit: "Create account",
            title: "New account creating",
            success: {
                title: "Account created",
                description: "Your account has been successfully created."
            },
            errors: {
                emailExists: "This email is already taken",
                passwordLength: "Password must be at least 6 characters long",
                emailRequired: "Email is required",
                passwordRequired: "Password is required",
                invalidEmail: "Invalid email format",
                generic: "Registration failed",
                registrationBlocked: "You cannot create a new account for one hour after the last registration.",
            }
        },
        heroSection: {
            title: "Software Developer",
            description: "I specialize in creating Android and Web applications."
        },
        projectSection: {
            title: "Projects"
        },
        contactSection: {
            contact: "Contact",
            message: "Message",
            submit: "Submit"
        }
    }
};

export type Language = 'pl' | 'en'