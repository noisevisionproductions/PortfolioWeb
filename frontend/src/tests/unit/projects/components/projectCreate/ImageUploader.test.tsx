import {expect, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import {ImageUploader} from "@/projects/components/projectCreate/ImageUploader";

interface ActionButtonProps {
    label: string;
    onClick: () => void;
}

interface FormInputProps {
    value: string;
    onChange: (value: string) => void;
    id: string;
}

const TEST_FILE_NAME = 'test.png';
const MOCK_IMAGE_URL = 'blob:http://localhost:3000/mock-image';
const TEST_CAPTION = 'Test Caption';
const MOCK_IMAGE_CONTENT = 'mock image';
const FILE_INPUT_SELECTOR = 'input[type="file"]';

const TEST_IDS = {
    ADD_IMAGE_BUTTON: 'action-button-projectForm.addImage',
    CAPTION_INPUT: 'newImageCaption',
    CANCEL_BUTTON: 'action-button-common.cancel',
    SAVE_BUTTON: 'action-button-projectForm.saveImage',
} as const;

vi.mock('@/components/shared/ActionButton', () => ({
    ActionButton: ({label, onClick}: ActionButtonProps) => (
        <button
            onClick={onClick}
            data-testid={`action-button-${label}`}
        >
            {label}
        </button>
    )
}));

vi.mock('@/components/shared/FormInput', () => ({
    FormInput: ({value, onChange, id}: FormInputProps) => (
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

    const createObjectURLMock = vi.fn(() => MOCK_IMAGE_URL);
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

        expect(screen.getByTestId(TEST_IDS.ADD_IMAGE_BUTTON)).toBeInTheDocument();
        expect(screen.queryByTestId(TEST_IDS.CAPTION_INPUT)).not.toBeInTheDocument();
    });

    test('should handle file upload and show caption form', () => {
        render(
            <ImageUploader
                onImageAdd={mockOnImageAdd}
                t={mockT}
            />
        );

        const file = new File([MOCK_IMAGE_CONTENT], TEST_FILE_NAME, {type: 'image/png'});
        const input = document.querySelector(FILE_INPUT_SELECTOR) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
            value: [file]
        });

        fireEvent.change(input);

        expect(createObjectURLMock).toHaveBeenCalledWith(file);
        expect(screen.getByTestId(TEST_IDS.CAPTION_INPUT)).toBeInTheDocument();
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
        expect(screen.getByTestId(TEST_IDS.CANCEL_BUTTON)).toBeInTheDocument();
        expect(screen.getByTestId(TEST_IDS.SAVE_BUTTON)).toBeInTheDocument();
    });

    test('should handle adding image with caption', () => {
        render(
            <ImageUploader
                onImageAdd={mockOnImageAdd}
                t={mockT}
            />
        );

        const file = new File([MOCK_IMAGE_CONTENT], TEST_FILE_NAME, {type: 'image/png'});
        const input = document.querySelector(FILE_INPUT_SELECTOR) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
            value: [file]
        });

        fireEvent.change(input);

        const captionInput = screen.getByTestId(TEST_IDS.CAPTION_INPUT);
        fireEvent.change(captionInput, {target: {value: TEST_CAPTION}});

        fireEvent.click(screen.getByTestId(TEST_IDS.SAVE_BUTTON));

        expect(mockOnImageAdd).toHaveBeenCalledTimes(1);

        const calledArg = mockOnImageAdd.mock.calls[0][0];

        expect(calledArg).toMatchObject({
            imageUrl: MOCK_IMAGE_URL,
            caption: TEST_CAPTION,
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

        const file = new File([MOCK_IMAGE_CONTENT], TEST_FILE_NAME, {type: 'image/png'});
        const input = document.querySelector(FILE_INPUT_SELECTOR) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
            value: [file]
        });

        fireEvent.change(input);
        fireEvent.click(screen.getByTestId(TEST_IDS.CANCEL_BUTTON));

        expect(screen.queryByTestId(TEST_IDS.CAPTION_INPUT)).not.toBeInTheDocument();
        expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    });
});