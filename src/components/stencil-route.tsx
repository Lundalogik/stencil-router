import { Component, h, Prop, Element, State } from '@stencil/core';
import { getHashPath, matchRoute, MatchResults } from '../utils/route-matching';
import { hasPreviousMatchingSibling } from '../utils/route-switch-logic';
import { generateComponentKey } from '../utils/component-key';

/**
 * Route component
 * Renders a component when the route matches
 */
@Component({
    tag: 'stencil-route',
    shadow: false,
})
export class StencilRoute {
    @Element()
    private el?: HTMLElement;

    @State()
    private currentPath: string = '/';

    @Prop()
    public url?: string;

    @Prop()
    public component?: string;

    @Prop()
    public componentProps?: Record<string, unknown>;

    @Prop()
    public routeRender?: (props: { match: MatchResults }) => unknown;

    constructor() {
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    connectedCallback(): void {
        window.addEventListener('hashchange', this.handleHashChange);
        this.handleHashChange();
    }

    disconnectedCallback(): void {
        window.removeEventListener('hashchange', this.handleHashChange);
    }

    private handleHashChange(): void {
        this.currentPath = getHashPath();
    }

    render() {
        // Element should always be available in render, but guard defensively
        if (!this.el) {
            return null;
        }

        // Check if a previous sibling route matches (first-match wins)
        if (hasPreviousMatchingSibling(this.el, this.currentPath)) {
            return null;
        }

        // Check if this route matches
        let match: MatchResults | null;
        if (this.url) {
            match = matchRoute(this.currentPath, this.url);
        } else {
            match = { params: {} }; // Catch-all route
        }

        if (!match) {
            return null;
        }

        // Render the matched route
        if (this.routeRender) {
            return this.routeRender({ match: match });
        }

        if (this.component) {
            const props = {
                ...this.componentProps,
                match: match,
            };

            // Create element dynamically using h() with string tag name
            // Use match params as key to force recreation when params change
            const key = generateComponentKey(match.params);

            return h(this.component, { key: key, ...props });
        }

        return <slot />;
    }
}
