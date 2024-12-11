import {vi} from "vitest";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {useLanguageSwitch} from "@/utils/translations/LanguageContext";
import {LanguageSwitch} from "@/components/shared/LanguageSwitch";

vi.mock('@/utils/translations/LanguageContext', () => ({
    useLanguageSwitch: vi.fn()
}));

describe('LanguageSwitch', () => {
    const mockSwitchLanguage = vi.fn();
    const mockUseLanguageSwitch = useLanguageSwitch as unknown as ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks;
    });

    test('should render current language in uppercase', () => {
        mockUseLanguageSwitch.mockReturnValue({
            currentLanguage: 'pl',
            switchLanguage: mockUseLanguageSwitch
        });

        render(<LanguageSwitch/>);

        expect(screen.getByRole('button')).toHaveTextContent('PL');
    });

    test('should switch from PL to EN on click', () => {
        mockUseLanguageSwitch.mockReturnValue({
            currentLanguage: 'pl',
            switchLanguage: mockSwitchLanguage.mockResolvedValue(undefined)
        });

        render(<LanguageSwitch/>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockSwitchLanguage).toHaveBeenCalledWith('en');
    });

    test('should handle error when switching language fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        });
        const error = new Error('Switch language failed');

        mockUseLanguageSwitch.mockReturnValue({
            currentLanguage: 'pl',
            switchLanguage: mockSwitchLanguage.mockRejectedValue(error)
        });

        render(<LanguageSwitch/>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to change language:', error);
        });

        consoleErrorSpy.mockRestore();
    })
});