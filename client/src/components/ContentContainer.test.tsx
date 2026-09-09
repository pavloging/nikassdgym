import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ContentContainer from './ContentContainer';
import { renderWithProviders } from '../test/utils';

describe('ContentContainer', () => {
    it('оборачивает содержимое шапкой и подвалом', () => {
        renderWithProviders(
            <ContentContainer className="test-page">
                <p>содержимое</p>
            </ContentContainer>
        );
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getByText('содержимое')).toBeInTheDocument();
    });

    it('вешает переданный класс вместе с общим', () => {
        renderWithProviders(
            <ContentContainer className="test-page">
                <p>содержимое</p>
            </ContentContainer>
        );
        expect(screen.getByRole('main')).toHaveClass('test-page', 'content');
    });

    it('содержимое лежит внутри main, а не рядом с ним', () => {
        renderWithProviders(
            <ContentContainer className="test-page">
                <p>содержимое</p>
            </ContentContainer>
        );
        expect(screen.getByRole('main')).toContainElement(screen.getByText('содержимое'));
    });
});
