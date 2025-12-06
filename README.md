# @limetech/stencil-router

A lightweight hash-based router for Stencil applications.

## Installation

```bash
npm install @limetech/stencil-router
```

## Usage

### Basic Setup

```tsx
import { Component, h } from '@stencil/core';

@Component({
    tag: 'my-app',
})
export class MyApp {
    render() {
        return (
            <stencil-router>
                <stencil-route-switch>
                    <stencil-route url="/" component="home-page" />
                    <stencil-route url="/users/:id" component="user-page" />
                    <stencil-route url="/about" component="about-page" />
                    <stencil-route component="not-found-page" />
                </stencil-route-switch>
            </stencil-router>
        );
    }
}
```

### Navigation

Use hash-based URLs for navigation:

```html
<a href="#/users/123">View User</a>
```

Or programmatically:

```typescript
window.location.hash = '#/users/123';
```

## Components

### `<stencil-router>`

The root router component. Wrap your routes with this component.

### `<stencil-route-switch>`

Container for route components. Implements first-match-wins behavior.

| Property | Type | Description |
|----------|------|-------------|
| `scrollTopOffset` | `number` | Scroll position to set on navigation (default: 0) |

### `<stencil-route>`

Individual route component.

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | Route pattern to match (e.g., `/users/:id`) |
| `component` | `string` | Component tag name to render when matched |
| `componentProps` | `object` | Props to pass to the rendered component |
| `routeRender` | `function` | Custom render function |

## Route Patterns

The router supports:

- **Static paths**: `/users`, `/about`
- **Required parameters**: `/users/:id`
- **Optional parameters**: `/component/:name/:section?`

## Matched Route Props

When a route matches, the rendered component receives a `match` prop:

```typescript
interface MatchResults {
    params: Record<string, string>;
}
```

Example:

```tsx
// Route: /users/:id
// URL: #/users/123

@Component({ tag: 'user-page' })
export class UserPage {
    @Prop() match: MatchResults;

    render() {
        // match.params.id === '123'
        return <div>User ID: {this.match.params.id}</div>;
    }
}
```

## License

MIT
