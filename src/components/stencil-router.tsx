import { Component, h } from '@stencil/core';

/**
 * Root router component
 * Manages routing state using hash-based navigation
 */
@Component({
    tag: 'stencil-router',
    shadow: false,
})
export class StencilRouter {
    render() {
        return <slot />;
    }
}
