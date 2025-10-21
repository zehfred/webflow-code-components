import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Webflow Code Components</h1>
        <p>
          This is the development environment for Webflow Code Components.
        </p>
        <p>
          To share your components with Webflow, run: <code>npx webflow library share</code>
        </p>
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <a
            href="https://docs.webflow.com/developers/code-components"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#61dafb', textDecoration: 'none' }}
          >
            View Webflow Code Components Documentation →
          </a>
          <a
            href="https://webflow-code-components.webflow.io/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#61dafb', textDecoration: 'none' }}
          >
            View Live Examples →
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;
