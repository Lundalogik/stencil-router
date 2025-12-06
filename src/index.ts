// Components
export { StencilRouter } from './components/stencil-router';
export { StencilRoute } from './components/stencil-route';
export { StencilRouteSwitch } from './components/stencil-route-switch';

// Utilities
export {
    MatchResults,
    parseRoute,
    matchRoute,
    getHashPath,
} from './utils/route-matching';
export {
    RouteElement,
    isRouteElement,
    hasPreviousMatchingSibling,
} from './utils/route-switch-logic';
export { generateComponentKey } from './utils/component-key';
