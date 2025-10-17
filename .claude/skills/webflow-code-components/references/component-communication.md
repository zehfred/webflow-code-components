# Component Communication

Learn how to share state and communicate between isolated code components.

## Overview

Because each code component runs in its own React root, they cannot share state through React Context or global state management libraries. Instead, use these patterns to communicate between components.

## Communication Methods

### 1. URL Parameters

Store state in the URL using `URLSearchParams`. Best for shareable, bookmarkable state.

**Use for:**
- Search queries and filters
- Pagination
- Navigation state
- Tab selections

#### Example: Shared Filter State

```tsx
// FilterComponent.tsx
import { useState, useEffect } from 'react';

export const FilterComponent = () => {
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (newFilter: string) => {
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('filter', newFilter);
    window.history.pushState({}, '', url);

    // Dispatch event to notify other components
    window.dispatchEvent(new Event('urlchange'));

    setFilter(newFilter);
  };

  // Listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const newFilter = params.get('filter') || 'all';
      setFilter(newFilter);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('urlchange', handleUrlChange);

    // Initialize from URL
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('urlchange', handleUrlChange);
    };
  }, []);

  return (
    <div>
      <button onClick={() => handleFilterChange('all')}>All</button>
      <button onClick={() => handleFilterChange('active')}>Active</button>
      <button onClick={() => handleFilterChange('completed')}>Completed</button>
      <p>Current filter: {filter}</p>
    </div>
  );
};
```

```tsx
// ProductList.tsx - Reads the same filter
import { useState, useEffect } from 'react';

export const ProductList = () => {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      setFilter(params.get('filter') || 'all');
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('urlchange', handleUrlChange);
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('urlchange', handleUrlChange);
    };
  }, []);

  return <div>Showing: {filter} products</div>;
};
```

**Pros:**
- ✅ Shareable links
- ✅ Browser back/forward works
- ✅ No additional libraries

**Cons:**
- ❌ Visible in address bar
- ❌ Limited to string values
- ❌ Not suitable for sensitive data

---

### 2. Browser Storage

Use `localStorage` for persistent data or `sessionStorage` for session-only data.

**Use for:**
- User preferences
- Theme settings
- Form data
- Cached data

#### Example: Theme Preference

```tsx
// ThemeToggle.tsx
import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Save to localStorage
    localStorage.setItem('theme', newTheme);

    // Notify other components
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme: newTheme }
    }));
  };

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
```

```tsx
// ThemedCard.tsx - Responds to theme changes
import { useState, useEffect } from 'react';

export const ThemedCard = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
    }

    // Listen for theme changes
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme: 'light' | 'dark' }>;
      setTheme(customEvent.detail.theme);
    };

    window.addEventListener('theme-changed', handleThemeChange);

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
    };
  }, []);

  return (
    <div className={`card theme-${theme}`}>
      {children}
    </div>
  );
};
```

**localStorage vs sessionStorage:**

```tsx
// Persists across browser sessions
localStorage.setItem('key', 'value');
localStorage.getItem('key');
localStorage.removeItem('key');

// Cleared when tab closes
sessionStorage.setItem('key', 'value');
sessionStorage.getItem('key');
sessionStorage.removeItem('key');
```

**Pros:**
- ✅ Persistent (localStorage) or session-only (sessionStorage)
- ✅ Simple API
- ✅ 5-10MB storage

**Cons:**
- ❌ String values only (need JSON.parse/stringify)
- ❌ Synchronous (can block)
- ❌ Not suitable for sensitive data (visible to user)

---

### 3. Nano Stores

[Nano Stores](https://github.com/nanostores/nanostores) is a lightweight state management library perfect for cross-component communication.

**Use for:**
- Complex shared state
- Multiple subscribers
- Type-safe state management
- Reactive updates

#### Installation

```bash
npm install nanostores @nanostores/react
```

#### Example: Shopping Cart

```tsx
// stores/cart.ts
import { atom } from 'nanostores';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Create shared store
export const $cartItems = atom<CartItem[]>([]);

// Helper functions
export const addToCart = (item: CartItem) => {
  const current = $cartItems.get();
  const existing = current.find(i => i.id === item.id);

  if (existing) {
    $cartItems.set(
      current.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
    );
  } else {
    $cartItems.set([...current, item]);
  }
};

export const removeFromCart = (id: string) => {
  $cartItems.set($cartItems.get().filter(item => item.id !== id));
};

export const clearCart = () => {
  $cartItems.set([]);
};
```

```tsx
// AddToCartButton.tsx
import { useStore } from '@nanostores/react';
import { addToCart, $cartItems } from './stores/cart';

interface ProductProps {
  id: string;
  name: string;
  price: number;
}

export const AddToCartButton = ({ id, name, price }: ProductProps) => {
  const cartItems = useStore($cartItems);

  const handleAdd = () => {
    addToCart({ id, name, price, quantity: 1 });
  };

  const itemInCart = cartItems.find(item => item.id === id);

  return (
    <button onClick={handleAdd}>
      {itemInCart
        ? `In cart (${itemInCart.quantity})`
        : 'Add to cart'
      }
    </button>
  );
};
```

```tsx
// CartDisplay.tsx
import { useStore } from '@nanostores/react';
import { $cartItems, removeFromCart } from './stores/cart';

export const CartDisplay = () => {
  const items = useStore($cartItems);

  const total = items.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0
  );

  return (
    <div className="cart">
      <h3>Cart ({items.length})</h3>
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>{item.quantity}x ${item.price}</span>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <div className="cart-total">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
};
```

#### Advanced: Computed Stores

```tsx
// stores/cart.ts
import { atom, computed } from 'nanostores';

export const $cartItems = atom<CartItem[]>([]);

// Computed store auto-updates when $cartItems changes
export const $cartTotal = computed($cartItems, items =>
  items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);

export const $cartCount = computed($cartItems, items =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);
```

```tsx
// CartBadge.tsx
import { useStore } from '@nanostores/react';
import { $cartCount } from './stores/cart';

export const CartBadge = () => {
  const count = useStore($cartCount);

  if (count === 0) return null;

  return <span className="badge">{count}</span>;
};
```

**Pros:**
- ✅ Tiny (< 1KB)
- ✅ Type-safe
- ✅ Reactive updates
- ✅ Computed values
- ✅ Works across isolated components

**Cons:**
- ❌ Additional dependency
- ❌ Not persistent (combine with localStorage if needed)

---

### 4. Custom Events

Use the browser's `CustomEvent` API to notify components of changes.

**Use for:**
- One-way notifications
- Event-driven updates
- Decoupled communication

#### Example: Notification System

```tsx
// NotificationTrigger.tsx
export const NotificationTrigger = () => {
  const showNotification = (message: string, type: 'success' | 'error') => {
    window.dispatchEvent(new CustomEvent('notification', {
      detail: { message, type }
    }));
  };

  return (
    <div>
      <button onClick={() => showNotification('Task completed!', 'success')}>
        Success
      </button>
      <button onClick={() => showNotification('Something failed', 'error')}>
        Error
      </button>
    </div>
  );
};
```

```tsx
// NotificationDisplay.tsx
import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export const NotificationDisplay = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleNotification = (event: Event) => {
      const customEvent = event as CustomEvent<{
        message: string;
        type: 'success' | 'error';
      }>;

      const notification: Notification = {
        id: Date.now(),
        message: customEvent.detail.message,
        type: customEvent.detail.type,
      };

      setNotifications(prev => [...prev, notification]);

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    };

    window.addEventListener('notification', handleNotification);

    return () => {
      window.removeEventListener('notification', handleNotification);
    };
  }, []);

  return (
    <div className="notifications">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      ))}
    </div>
  );
};
```

#### Typed Custom Events

Create type-safe event helpers:

```tsx
// events.ts
export type AppEvents = {
  'user-login': { userId: string; username: string };
  'cart-update': { itemCount: number };
  'theme-change': { theme: 'light' | 'dark' };
};

export const emitEvent = <K extends keyof AppEvents>(
  eventName: K,
  detail: AppEvents[K]
) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

export const onEvent = <K extends keyof AppEvents>(
  eventName: K,
  handler: (detail: AppEvents[K]) => void
) => {
  const wrappedHandler = (event: Event) => {
    const customEvent = event as CustomEvent<AppEvents[K]>;
    handler(customEvent.detail);
  };

  window.addEventListener(eventName, wrappedHandler);

  return () => {
    window.removeEventListener(eventName, wrappedHandler);
  };
};
```

```tsx
// Usage
import { emitEvent, onEvent } from './events';

// Emit
emitEvent('user-login', { userId: '123', username: 'john' });

// Listen
useEffect(() => {
  return onEvent('user-login', ({ userId, username }) => {
    console.log(`User ${username} logged in`);
  });
}, []);
```

**Pros:**
- ✅ Native browser API
- ✅ Flexible
- ✅ Decoupled

**Cons:**
- ❌ One-way communication
- ❌ No built-in state
- ❌ Need careful cleanup

## Choosing the Right Method

| Use Case | Best Method | Why |
|----------|-------------|-----|
| Search/filter state | URL Parameters | Shareable, browser history |
| User preferences | localStorage + Events | Persistent across sessions |
| Shopping cart | Nano Stores | Complex state, multiple subscribers |
| Notifications | Custom Events | One-way broadcasts |
| Current page tab | URL Parameters | Browser history support |
| Theme toggle | localStorage + Events | Persistent preference |
| Form wizard | sessionStorage | Temporary within session |

## Best Practices

### 1. Clean Up Listeners

Always remove event listeners:

```tsx
// ✅ Good
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('my-event', handler);
  return () => window.removeEventListener('my-event', handler);
}, []);

// ❌ Memory leak
useEffect(() => {
  window.addEventListener('my-event', () => { /* ... */ });
}, []);
```

### 2. Use TypeScript

Type your events and stores:

```tsx
// ✅ Good - Type-safe
interface CartItem { id: string; quantity: number; }
const $cart = atom<CartItem[]>([]);

// ❌ Avoid - No type safety
const $cart = atom([]);
```

### 3. Namespace Events

Avoid name collisions:

```tsx
// ✅ Good
emitEvent('myapp:cart:updated', { ... });

// ❌ Could conflict
emitEvent('updated', { ... });
```

### 4. Validate External Data

Always validate data from storage/URL:

```tsx
// ✅ Good
const saved = localStorage.getItem('theme');
const theme = saved === 'dark' ? 'dark' : 'light';

// ❌ Could be invalid
const theme = localStorage.getItem('theme');
```

## Next Steps

- **[Architecture](./architecture.md)** - Understand component isolation
- **[Data Fetching](./data-fetching.md)** - Fetch external data
- **[Best Practices](./best-practices.md)** - More patterns
