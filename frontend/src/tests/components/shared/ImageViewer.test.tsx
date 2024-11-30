import {vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import '@testing-library/jest-dom';
import {ImageViewer} from "@/components/shared/ImageViewer";
import {FC} from "react";

const originalError = console.error;

interface IconProps {
    'data-testid'?: string;
}

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

vi.mock('lucide-react', () => {
    const createIconMock = (testId: string, label: string): FC<IconProps> =>
        () => <div data-testid={testId}>{label}</div>;

    return {
        Image: createIconMock("image-icon", "Image Icon"),
        ChevronLeft: createIconMock("chevron-left", "Left"),
        ChevronRight: createIconMock("chevron-right", "Right"),
        X: createIconMock("close-icon", "Close")
    };
});

describe('ImageViewer', () => {
    const mockImages = [
        {url: 'test1.jpg', alt: 'Test Image 1', caption: 'Caption 1'},
        {url: 'test2.jpg', alt: 'Test Image 2', caption: 'Caption 2'},
        {url: 'test3.jpg', alt: 'Test Image 3', caption: 'Caption 3'}
    ];

    beforeAll(() => {
        console.error = (...args: any[]) => {
            if (args[0].includes('Error loading image:')) {
                return;
            }
            originalError(...args);
        };
    });

    afterAll(() => {
        console.error = originalError;
    });

    beforeEach(() => {
        vi.clearAllMocks;
    });

    test('should render nothing when no images provided', () => {
        const {container} = render(<ImageViewer images={[]}/>);
        expect(container.firstChild).toBeNull();
    });

    test('should render single image correctly', () => {
        render(<ImageViewer images={[mockImages[0]]}/>);
        const image = screen.getByAltText('Test Image 1');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'test1.jpg');
    });

    test('should show image count when multiple images', () => {
        render(<ImageViewer images={mockImages} showImageCount={true}/>);
        expect(screen.getByText('1/3')).toBeInTheDocument();
    });

    test('should not show image count when showImageCount is false', () => {
        render(<ImageViewer images={mockImages} showImageCount={false}/>);
        expect(screen.queryByText('1/3')).not.toBeInTheDocument();
    });

    test('should handle image error correctly', () => {
        render(<ImageViewer images={[mockImages[0]]}/>);
        const image = screen.getByAltText('Test Image 1');

        fireEvent.error(image);

        expect(screen.getByText('common.errorWhileLoading')).toBeInTheDocument();
        expect(screen.getByTestId('image-icon')).toBeInTheDocument();
    });

    test('should navigate through images in modal', () => {
        render(<ImageViewer images={mockImages}/>);

        const thumbnail = screen.getByRole('img');
        fireEvent.click(thumbnail);

        const nextButton = screen.getByTestId('chevron-right').parentElement;
        const prevButton = screen.getByTestId('chevron-left').parentElement;

        const getModalImage = () =>
            document.querySelector('img.max-h-\\[90vh\\]') as HTMLImageElement;

        if (nextButton) {
            fireEvent.click(nextButton);
            expect(getModalImage().alt).toBe('Test Image 2');
        }

        if (prevButton) {
            fireEvent.click(prevButton);
            expect(getModalImage().alt).toBe('Test Image 1');
        }
    });

    test('should apply correct aspect ratio class', () => {
        const {rerender} = render(<ImageViewer images={mockImages} aspectRatio="video"/>);
        expect(screen.getByRole('img').parentElement).toHaveClass('aspect-video');

        rerender(<ImageViewer images={mockImages} aspectRatio="square"/>);
        expect(screen.getByRole('img').parentElement).toHaveClass('aspect-square');

        rerender(<ImageViewer images={mockImages} aspectRatio="auto"/>);
        expect(screen.getByRole('img').parentElement).not.toHaveClass('aspect-video');
        expect(screen.getByRole('img').parentElement).not.toHaveClass('aspect-square');
    });

    test('should use custom getImageUrl function', () => {
        const customGetImageUrl = (url: string) => `https://example.com/${url}`;
        render(<ImageViewer
            images={mockImages}
            getImageUrl={customGetImageUrl}
        />);

        const image = screen.getByAltText('Test Image 1');
        expect(image).toHaveAttribute('src', 'https://example.com/test1.jpg');
    });

    test('should show caption in modal', () => {
        render(<ImageViewer images={mockImages}/>);
        const imageContainer = screen.getByRole('img');

        fireEvent.click(imageContainer);

        expect(screen.getByText('Caption 1')).toBeInTheDocument();
    });

    test('should close modal on backdrop click', () => {
        render(<ImageViewer images={mockImages}/>);
        const imageContainer = screen.getByRole('img');

        fireEvent.click(imageContainer);
        expect(screen.getByTestId('close-icon')).toBeInTheDocument();

        const modal = screen.getByTestId('close-icon').parentElement?.parentElement;
        if (modal) fireEvent.click(modal);

        expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
    });
});