import {
    isRouteElement,
    hasPreviousMatchingSibling,
} from './route-switch-logic';

interface StencilRouteElement extends HTMLElement {
    url?: string;
}

describe('route-switch-logic', () => {
    describe('isRouteElement()', () => {
        it('returns true for stencil-route element with url property', () => {
            const element = document.createElement('stencil-route');
            (element as unknown as StencilRouteElement).url = '/test';

            expect(isRouteElement(element)).toBe(true);
        });

        it('returns true for stencil-route element without url property', () => {
            const element = document.createElement('stencil-route');
            (element as unknown as StencilRouteElement).url = undefined;

            expect(isRouteElement(element)).toBe(true);
        });

        it('returns false for non-route elements', () => {
            const element = document.createElement('div');
            (element as unknown as StencilRouteElement).url = '/test';

            expect(isRouteElement(element)).toBe(false);
        });

        it('returns true for route element regardless of url property presence', () => {
            const element = document.createElement('stencil-route');

            expect(isRouteElement(element)).toBe(true);
        });

        it('is case-insensitive for tag name', () => {
            const element = document.createElement('STENCIL-ROUTE');
            (element as unknown as StencilRouteElement).url = '/test';

            expect(isRouteElement(element)).toBe(true);
        });
    });

    describe('hasPreviousMatchingSibling()', () => {
        let parent: HTMLElement;
        let currentRoute: StencilRouteElement;

        beforeEach(() => {
            parent = document.createElement('stencil-route-switch');
            currentRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            currentRoute.url = '/current';
        });

        it('returns false when parent is not route-switch', () => {
            const nonSwitchParent = document.createElement('div');
            nonSwitchParent.appendChild(currentRoute);

            expect(hasPreviousMatchingSibling(currentRoute, '/test')).toBe(
                false,
            );
        });

        it('returns false when element has no parent', () => {
            expect(hasPreviousMatchingSibling(currentRoute, '/test')).toBe(
                false,
            );
        });

        it('returns false when there are no previous siblings', () => {
            parent.appendChild(currentRoute);

            expect(hasPreviousMatchingSibling(currentRoute, '/current')).toBe(
                false,
            );
        });

        it('returns false when previous sibling does not match', () => {
            const previousRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            previousRoute.url = '/other';

            parent.appendChild(previousRoute);
            parent.appendChild(currentRoute);

            expect(hasPreviousMatchingSibling(currentRoute, '/current')).toBe(
                false,
            );
        });

        it('returns true when previous sibling matches', () => {
            const previousRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            previousRoute.url = '/test';

            parent.appendChild(previousRoute);
            parent.appendChild(currentRoute);

            expect(hasPreviousMatchingSibling(currentRoute, '/test')).toBe(
                true,
            );
        });

        it('returns true for first matching sibling (first-match wins)', () => {
            const firstRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            firstRoute.url = '/test';

            const secondRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            secondRoute.url = '/other';

            parent.appendChild(firstRoute);
            parent.appendChild(secondRoute);
            parent.appendChild(currentRoute);

            expect(hasPreviousMatchingSibling(currentRoute, '/test')).toBe(
                true,
            );
        });

        it('ignores non-route siblings', () => {
            const divElement = document.createElement('div');
            const previousRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            previousRoute.url = '/test';

            parent.appendChild(divElement);
            parent.appendChild(previousRoute);
            parent.appendChild(currentRoute);

            expect(hasPreviousMatchingSibling(currentRoute, '/test')).toBe(
                true,
            );
        });

        it('handles catch-all routes (no URL)', () => {
            const catchAllRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            // No url property set - this is a catch-all

            parent.appendChild(catchAllRoute);
            parent.appendChild(currentRoute);

            // Catch-all routes match everything
            expect(hasPreviousMatchingSibling(currentRoute, '/anything')).toBe(
                true,
            );
        });

        it('matches routes with parameters', () => {
            const paramRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            paramRoute.url = '/component/:name';

            parent.appendChild(paramRoute);
            parent.appendChild(currentRoute);

            expect(
                hasPreviousMatchingSibling(currentRoute, '/component/test'),
            ).toBe(true);
        });

        it('returns false when route pattern does not match path', () => {
            const paramRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            paramRoute.url = '/component/:name';

            parent.appendChild(paramRoute);
            parent.appendChild(currentRoute);

            expect(hasPreviousMatchingSibling(currentRoute, '/type/test')).toBe(
                false,
            );
        });

        it('handles multiple non-matching siblings before matching one', () => {
            const nonMatch1 = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            nonMatch1.url = '/path1';

            const nonMatch2 = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            nonMatch2.url = '/path2';

            const matchingRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            matchingRoute.url = '/test';

            parent.appendChild(nonMatch1);
            parent.appendChild(nonMatch2);
            parent.appendChild(matchingRoute);
            parent.appendChild(currentRoute);

            expect(hasPreviousMatchingSibling(currentRoute, '/test')).toBe(
                true,
            );
        });

        it('is case-insensitive for parent tag name', () => {
            const upperCaseParent = document.createElement(
                'STENCIL-ROUTE-SWITCH',
            );
            const previousRoute = document.createElement(
                'stencil-route',
            ) as unknown as StencilRouteElement;
            previousRoute.url = '/test';

            upperCaseParent.appendChild(previousRoute);
            upperCaseParent.appendChild(currentRoute);

            expect(hasPreviousMatchingSibling(currentRoute, '/test')).toBe(
                true,
            );
        });
    });
});
