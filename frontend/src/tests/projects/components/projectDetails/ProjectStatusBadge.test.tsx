import {describe, test, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ProjectStatusBadge} from "@/projects/components/projectDetails/ProjectStatusBadge";
import {ProjectStatus} from '@/projects/types/project';
import '@testing-library/jest-dom';

const mockTranslation = (key: string) => key;

describe('ProjectStatusBadge', () => {
    test('should render badge with IN_PROGRESS status', () => {
        render(
            <ProjectStatusBadge
                status={ProjectStatus.IN_PROGRESS}
                t={mockTranslation}
            />
        );

        const badge = screen.getByText('projectForm.statuses.inProgress');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    test('should render badge with COMPLETED status', () => {
        render(
            <ProjectStatusBadge
                status={ProjectStatus.COMPLETED}
                t={mockTranslation}
            />
        );

        const badge = screen.getByText('projectForm.statuses.completed');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    test('should render badge with COMPLETED status', () => {
        render(
            <ProjectStatusBadge
                status={ProjectStatus.ARCHIVED}
                t={mockTranslation}
            />
        );

        const badge = screen.getByText('projectForm.statuses.archived');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
    });

    test('should render badge with common styles for all statuses', () => {
        render(
            <ProjectStatusBadge
                status={ProjectStatus.IN_PROGRESS}
                t={mockTranslation}
            />
        );

        const badge = screen.getByText('projectForm.statuses.inProgress');
        expect(badge).toHaveClass(
            'px-3',
            'py-1',
            'rounded-full',
            'text-sm',
            'font-medium'
        );
    });

    test('should use default styles for unknown status', () => {
        const unknownStatus = 'UNKNOWN_STATUS' as ProjectStatus;
        render(
            <ProjectStatusBadge
                status={unknownStatus}
                t={mockTranslation}
            />
        );

        const badge = screen.getByText('projectForm.statuses.unknown');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
    });

    test('should call translation function with correct keys', () => {
        const mockT = vi.fn((key: string) => key);

        render(
            <ProjectStatusBadge
                status={ProjectStatus.IN_PROGRESS}
                t={mockT}
            />
        );

        expect(mockT).toHaveBeenCalledWith('projectForm.statuses.inProgress');
    });
});