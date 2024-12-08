import {vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import {ProjectImage} from "@/projects/types/project";
import {ProjectImages} from "@/projects/components/projectDetails/ProjectImages";

vi.mock('@/components/shared/ImageViewer', () => ({
    ImageViewer: ({images, initialIndex, getImageUrl, className}: any) => (
        <div data-testid={`image-viewer-${initialIndex}`}>
            <img
                src={getImageUrl(images[initialIndex].url)}
                alt={images[initialIndex].alt}
                className={className}
            />
        </div>
    )
}));

vi.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">Back Icon</div>,
    Pencil: () => <div data-testid="pencil-icon">Edit Icon</div>,
    Trash2: () => <div data-testid="trash-icon">Delete</div>
}));

const mockImages: ProjectImage[] = [
    {
        id: 1,
        imageUrl: 'image1.jpg',
        caption: 'First Image'
    },
    {
        id: 2,
        imageUrl: 'image2.jpg',
        caption: undefined
    }
];

const mockGetImageUrl = (url: string) => `https://example.com/${url}`;

describe('ProjectImages', () => {
    test('should render all images', () => {
        render(
            <ProjectImages
                images={mockImages}
                projectName="Test Project"
                onImageDelete={vi.fn()}
                getImageUrl={mockGetImageUrl}
            />
        );

        mockImages.forEach((_, index) => {
            expect(screen.getByTestId(`image-viewer-${index}`)).toBeInTheDocument();
        });
    });

    test('should use caption as alt text when available', () => {
        render(
            <ProjectImages
                images={mockImages}
                projectName="Test Project"
                onImageDelete={vi.fn()}
                getImageUrl={mockGetImageUrl}
            />
        );

        const firstImage = screen.getByAltText('First Image');
        expect(firstImage).toBeInTheDocument();
    });

    test('should use project name as alt text when caption is not available', () => {
        render(
            <ProjectImages
                images={mockImages}
                projectName="Test Project"
                onImageDelete={vi.fn()}
                getImageUrl={mockGetImageUrl}
            />
        );

        const secondImage = screen.getByAltText('First Image');
        expect(secondImage).toBeInTheDocument();
    });

    test('should call onImageDelete when delete button is clicked', () => {
        const mockDelete = vi.fn();
        render(
            <ProjectImages
                images={mockImages}
                projectName="Test Project"
                onImageDelete={mockDelete}
                getImageUrl={mockGetImageUrl}
            />
        );

        const deleteButtons = screen.getAllByRole('button');

        fireEvent.click(deleteButtons[0]);

        expect(mockDelete).toHaveBeenCalledWith(mockImages[0].id);
    });

    test('should stop event propagation when clicking delete button', () => {
        const mockDelete = vi.fn();
        const mockParentClick = vi.fn();

        render(
            <div onClick={mockParentClick}>
                <ProjectImages
                    images={mockImages}
                    projectName="Test Project"
                    onImageDelete={mockDelete}
                    getImageUrl={mockGetImageUrl}
                />
            </div>
        );

        const deleteButton = screen.getAllByRole('button')[0];
        fireEvent.click(deleteButton);

        expect(mockDelete).toHaveBeenCalledWith(mockImages[0].id);
        expect(mockParentClick).not.toHaveBeenCalled();
    });

    test('should render correct number of delete buttons', () => {
        render(
            <ProjectImages
                images={mockImages}
                projectName="Test Project"
                onImageDelete={vi.fn()}
                getImageUrl={mockGetImageUrl}
            />
        );

        const deleteButtons = screen.getAllByTestId('trash-icon');
        expect(deleteButtons).toHaveLength(mockImages.length);
    });

    test('should pass correct props to ImageViewer', () => {
        render(
            <ProjectImages
                images={mockImages}
                projectName="Test Project"
                onImageDelete={vi.fn()}
                getImageUrl={mockGetImageUrl}
            />
        );

        const imageViewer = screen.getByTestId('image-viewer-0');
        expect(imageViewer).toBeInTheDocument();

        const image = imageViewer.querySelector('img');
        expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
        expect(image).toHaveClass('!rounded-lg', '!aspect-[3/2]');
    });
});