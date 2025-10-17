# Data Fetching

Learn how to fetch external data in your code components.

## Overview

Code components support **client-side data fetching only**. This means your React component requests data from APIs after it renders in the browser.

## Basic Pattern

Use React's `useEffect` hook to fetch data when the component mounts:

```tsx
import { useState, useEffect } from 'react';

interface ApiResponse {
  message: string;
  data: any[];
}

export const DataComponent = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/public-data')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((json: ApiResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h2>{data.message}</h2>
      {/* Render data */}
    </div>
  );
};
```

## Key Considerations

### 1. Public APIs Only

**Never include secrets or API keys in your component code.**

All JavaScript runs in the browser and is visible to users.

```tsx
// ❌ DANGEROUS - API key exposed to users
fetch('https://api.example.com/data', {
  headers: {
    'Authorization': 'Bearer sk_live_abc123...'  // Visible in browser!
  }
});

// ✅ SAFE - Use public endpoints
fetch('https://api.example.com/public/data');

// ✅ SAFE - Pass API keys as props (for user's own keys)
interface ComponentProps {
  apiKey: string;  // User provides their own key
}
```

### 2. CORS Support Required

The API must allow cross-origin requests from your Webflow-hosted site.

```tsx
// API must respond with CORS headers:
// Access-Control-Allow-Origin: *
// or
// Access-Control-Allow-Origin: https://yoursite.webflow.io
```

**If you control the API**, add CORS headers:

```js
// Express.js example
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

**If you don't control the API**, you may need a proxy server.

### 3. No Environment Variables

`.env` files aren't supported in code components.

```tsx
// ❌ This doesn't work
const API_URL = process.env.REACT_APP_API_URL;

// ✅ Pass configuration as props instead
interface ComponentProps {
  apiUrl: string;
}

export const Component = ({ apiUrl }: ComponentProps) => {
  useEffect(() => {
    fetch(apiUrl).then(/* ... */);
  }, [apiUrl]);
};
```

Then in `.webflow.tsx`:

```tsx
export default declareComponent(Component, {
  name: 'Data Component',
  props: {
    apiUrl: props.Text({
      name: 'API URL',
      defaultValue: 'https://api.example.com/data',
    }),
  },
});
```

## Complete Examples

### Example 1: Fetching JSON Data

```tsx
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductListProps {
  apiUrl: string;
}

export const ProductList = ({ apiUrl }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product.id} className="product">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};
```

### Example 2: Fetch with Parameters

```tsx
import { useState, useEffect } from 'react';

interface SearchProps {
  endpoint: string;
  query: string;
  limit?: number;
}

export const SearchResults = ({ endpoint, query, limit = 10 }: SearchProps) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Build URL with query parameters
    const url = new URL(endpoint);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', limit.toString());

    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [endpoint, query, limit]);

  if (loading) return <div>Searching...</div>;

  return (
    <div>
      <p>{results.length} results for "{query}"</p>
      {/* Render results */}
    </div>
  );
};
```

### Example 3: Periodic Updates

```tsx
import { useState, useEffect } from 'react';

interface LiveDataProps {
  apiUrl: string;
  refreshInterval?: number;  // milliseconds
}

export const LiveData = ({ apiUrl, refreshInterval = 30000 }: LiveDataProps) => {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        setData(json);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for periodic updates
    const interval = setInterval(fetchData, refreshInterval);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [apiUrl, refreshInterval]);

  return (
    <div>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {lastUpdate && (
        <p className="last-update">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};
```

### Example 4: POST Requests

```tsx
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
}

interface ContactFormProps {
  submitUrl: string;
}

export const ContactForm = ({ submitUrl }: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submit failed');

      setStatus('success');
      setFormData({ name: '', email: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Submit'}
      </button>

      {status === 'success' && <p>Thank you! We'll be in touch.</p>}
      {status === 'error' && <p>Something went wrong. Please try again.</p>}
    </form>
  );
};
```

## Advanced Patterns

### Caching with localStorage

```tsx
import { useState, useEffect } from 'react';

interface CachedDataProps {
  apiUrl: string;
  cacheKey: string;
  cacheDuration?: number;  // milliseconds
}

export const CachedData = ({
  apiUrl,
  cacheKey,
  cacheDuration = 60000  // 1 minute default
}: CachedDataProps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        if (age < cacheDuration) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      try {
        const response = await fetch(apiUrl);
        const json = await response.json();

        // Cache the data
        localStorage.setItem(cacheKey, JSON.stringify({
          data: json,
          timestamp: Date.now()
        }));

        setData(json);
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, cacheKey, cacheDuration]);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render data */}</div>;
};
```

### Abort Controller for Cleanup

```tsx
import { useState, useEffect } from 'react';

export const AbortableRequest = ({ apiUrl }: { apiUrl: string }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(apiUrl, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch failed:', err);
        }
      });

    // Cleanup: abort fetch if component unmounts
    return () => controller.abort();
  }, [apiUrl]);

  return <div>{/* Render data */}</div>;
};
```

## Best Practices

### 1. Handle All States

Always handle loading, error, and empty states:

```tsx
// ✅ Good - All states handled
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (!data || data.length === 0) return <div>No data</div>;

// ❌ Missing states
return <div>{data.map(/* ... */)}</div>;
```

### 2. Show Meaningful Errors

Help users understand what went wrong:

```tsx
// ✅ Good
catch (err) {
  setError(err.response?.status === 404
    ? 'Data not found'
    : 'Failed to load. Please try again.'
  );
}

// ❌ Generic
catch (err) {
  setError('Error');
}
```

### 3. Use Abort Controller

Clean up fetches when component unmounts:

```tsx
// ✅ Good - Prevents memory leaks
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);

// ❌ Fetch continues after unmount
useEffect(() => {
  fetch(url).then(setData);
}, [url]);
```

### 4. Validate Response Data

Don't trust API responses:

```tsx
// ✅ Good - Validates structure
const data = await response.json();
if (!Array.isArray(data.items)) {
  throw new Error('Invalid response format');
}

// ❌ Could crash
const data = await response.json();
data.items.map(/* ... */);  // items might not exist
```

### 5. Secure API Keys

Never hardcode secrets:

```tsx
// ❌ NEVER do this
const API_KEY = 'sk_live_abc123';

// ✅ Let users provide their own keys
interface Props {
  apiKey: string;  // User's key
}
```

## Troubleshooting

### CORS Errors

```
Access to fetch at 'https://api.example.com' from origin 'https://yoursite.webflow.io'
has been blocked by CORS policy
```

**Solutions:**
1. Add CORS headers on the API server
2. Use a proxy server you control
3. Use a CORS-enabled API endpoint

### Network Errors

```tsx
// Handle network issues gracefully
fetch(url)
  .catch(err => {
    if (!navigator.onLine) {
      setError('No internet connection');
    } else {
      setError('Network error. Please try again.');
    }
  });
```

### Rate Limiting

```tsx
// Implement debouncing for frequent requests
import { useEffect, useState } from 'react';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      fetch(`/api/search?q=${debouncedQuery}`);
    }
  }, [debouncedQuery]);
};
```

## Next Steps

- **[Component Communication](./component-communication.md)** - Share fetched data between components
- **[Architecture](./architecture.md)** - Understand client-side rendering
- **[Best Practices](./best-practices.md)** - More optimization tips
