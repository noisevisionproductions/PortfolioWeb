import {fireEvent, render} from "@testing-library/react";
import {LanguageSelector} from "@/auth/components/register/ProgrammingLanguageSelector";
import {vi} from "vitest";


describe('ProgrammingLanguageSelector', () => {
    test('should add language when not selected', () => {
        const onChangeMock = vi.fn();
        const {getByText} = render(
            <LanguageSelector
                label="Languages"
                options={['Java', 'Python']}
                selected={['Java']}
                onChange={onChangeMock}
            />
        );

        fireEvent.click(getByText('Python'));
        expect(onChangeMock).toHaveBeenCalledWith(['Java', 'Python']);
    });

    test('should remove language when already selected', () => {
        const onChangeMock = vi.fn();
        const {getByText} = render(
            <LanguageSelector
                label="Languages"
                options={['Java', 'Python']}
                selected={['Java', 'Python']}
                onChange={onChangeMock}
            />
        );

        fireEvent.click(getByText('Java'));
        expect(onChangeMock).toHaveBeenCalledWith(['Python']);
    });
    test('should render all provided options', () => {
        const {getByText} = render(
            <LanguageSelector
                label="Languages"
                options={['Java', 'Python', 'JavaScript']}
                selected={[]}
                onChange={() => {
                }}
            />
        );

        expect(getByText('Java')).toBeInTheDocument();
        expect(getByText('Python')).toBeInTheDocument();
        expect(getByText('JavaScript')).toBeInTheDocument();
    });

    test('should display correct label', () => {
        const {getByText} = render(
            <LanguageSelector
                label="Select Programming Languages"
                options={['Java']}
                selected={[]}
                onChange={() => {
                }}
            />
        );

        expect(getByText('Select Programming Languages')).toBeInTheDocument();
    });
});
