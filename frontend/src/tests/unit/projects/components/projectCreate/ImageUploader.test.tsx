import {expect, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import {ImageUploader} from "@/projects/components/projectCreate/ImageUploader";

vi.mock('@/components/shared/ActionButton', () => ({
    ActionButton: ({label, onClick}: any) => (
        <button
            onClick={onClick}
            data-testid={`action-button-${label}`}
        >
            {label}
        </button>
    )
}));

vi.mock('@/components/shared/FormInput', () => ({
    FormInput: ({value, onChange, id}: any) => (
        <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            data-testid={id}
        />
    )
}));

describe('ImageUploader', () => {
    const mockOnImageAdd = vi.fn();
    const mockT = (key: string) => key;
    const mockImageUrl = 'blob:http://localhost:3000/mock-image';

    const createObjectURLMock = vi.fn(() => mockImageUrl);
    URL.createObjectURL = createObjectURLMock;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('should render initial state correctly', () => {
        render(
            <ImageUploader
                onImageAdd={mockOnImageAdd}
                t={mockT}
            />
        );

        expect(screen.getByTestId('action-button-projectForm.addImage')).toBeInTheDocument();
        expect(screen.queryByTestId('newImageCaption')).not.toBeInTheDocument();
    });

    test('should handle file upload and show caption form', () => {
        render(
            <ImageUploader
                onImageAdd={mockOnImageAdd}
                t={mockT}
            />
        );

        const file = new File(['mock image'], 'test.png', {type: 'image/png'});
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        Object.defineProperty(input, 'files', {
            value: [file]
        });

        fireEvent.change(input);

        expect(createObjectURLMock).toHaveBeenCalledWith(file);
        expect(screen.getByTestId('newImageCaption')).toBeInTheDocument();
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
        expect(screen.getByTestId('action-button-common.cancel')).toBeInTheDocument();
        expect(screen.getByTestId('action-button-projectForm.saveImage')).toBeInTheDocument();
    });

    test('should handle adding image with caption', () => {
        render(
            <ImageUploader
                onImageAdd={mockOnImageAdd}
                t={mockT}
            />
        );

        const file = new File(['mock image'], 'test.png', {type: 'image/png'});
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        Object.defineProperty(input, 'files', {
            value: [file]
        });

        fireEvent.change(input);

        const captionInput = screen.getByTestId('newImageCaption');
        fireEvent.change(captionInput, {target: {value: 'Test Caption'}});

        fireEvent.click(screen.getByTestId('action-button-projectForm.saveImage'));

        expect(mockOnImageAdd).toHaveBeenCalledTimes(1);

        const calledArg = mockOnImageAdd.mock.calls[0][0];

        expect(calledArg).toMatchObject({
            imageUrl: mockImageUrl,
            caption: 'Test Caption',
            file: file
        });

        expect(calledArg).toHaveProperty('id');
        expect(typeof calledArg.id).toBe('number');
        expect(Number.isFinite(calledArg.id)).toBe(true);
    });

    test('should handle cancel and reset form', () => {
        render(
            <ImageUploader
                onImageAdd={mockOnImageAdd}
                t={mockT}
            />
        );

        const file = new File(['mock image'], 'test.png', {type: 'image/png'});
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        Object.defineProperty(input, 'files', {
            value: [file]
        });

        fireEvent.change(input);
        fireEvent.click(screen.getByTestId('action-button-common.cancel'));

        expect(screen.queryByTestId('newImageCaption')).not.toBeInTheDocument();
        expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    });
});