import React, { useState } from 'react';
import './App.css';
import DotGrid from './components/DotGrid.tsx';
import Particles from './components/Particles.tsx';
import MagnetLines from './components/MagnetLines.tsx';
import GridMotion from './components/GridMotion.tsx';

// Component Registry - Add new components here
const componentRegistry = [
  {
    name: 'DotGrid',
    component: DotGrid,
    wrapperStyle: { width: '100%', height: '600px', position: 'relative' },
    props: {
      dotSize: {
        type: 'number',
        name: 'Dot Size',
        defaultValue: 10,
        min: 1,
        max: 50,
        step: 1,
      },
      gap: {
        type: 'number',
        name: 'Gap',
        defaultValue: 15,
        min: 1,
        max: 100,
        step: 1,
      },
      baseColor: {
        type: 'color',
        name: 'Base Color',
        defaultValue: '#5227FF',
      },
      activeColor: {
        type: 'color',
        name: 'Active Color',
        defaultValue: '#5227FF',
      },
      backgroundColor: {
        type: 'color',
        name: 'Background Color',
        defaultValue: '#ffffff',
      },
      proximity: {
        type: 'number',
        name: 'Proximity',
        defaultValue: 120,
        min: 0,
        max: 500,
        step: 1,
      },
      speedTrigger: {
        type: 'number',
        name: 'Speed Trigger',
        defaultValue: 100,
        min: 0,
        max: 1000,
        step: 10,
      },
      shockRadius: {
        type: 'number',
        name: 'Shock Radius',
        defaultValue: 250,
        min: 0,
        max: 1000,
        step: 10,
      },
      shockStrength: {
        type: 'number',
        name: 'Shock Strength',
        defaultValue: 5,
        min: 0,
        max: 20,
        step: 0.5,
      },
      maxSpeed: {
        type: 'number',
        name: 'Max Speed',
        defaultValue: 5000,
        min: 100,
        max: 10000,
        step: 100,
      },
      resistance: {
        type: 'number',
        name: 'Resistance',
        defaultValue: 750,
        min: 100,
        max: 2000,
        step: 50,
      },
      returnDuration: {
        type: 'number',
        name: 'Return Duration',
        defaultValue: 1.5,
        min: 0.1,
        max: 5,
        step: 0.1,
      },
      multicolor: {
        type: 'boolean',
        name: 'Multicolor',
        defaultValue: false,
      },
      colorPalette: {
        type: 'colorArray',
        name: 'Color Palette',
        defaultValue: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
      },
      blur: {
        type: 'boolean',
        name: 'Blur',
        defaultValue: false,
      },
    },
  },
  {
    name: 'Particles',
    component: Particles,
    wrapperStyle: { width: '100%', height: '600px', position: 'relative', backgroundColor: '#000' },
    props: {
      particleCount: {
        type: 'number',
        name: 'Particle Count',
        defaultValue: 200,
        min: 10,
        max: 1000,
        step: 10,
      },
      particleSpread: {
        type: 'number',
        name: 'Particle Spread',
        defaultValue: 10,
        min: 1,
        max: 50,
        step: 1,
      },
      speed: {
        type: 'number',
        name: 'Speed',
        defaultValue: 0.1,
        min: 0,
        max: 2,
        step: 0.01,
      },
      particleColors: {
        type: 'colorArray',
        name: 'Particle Colors',
        defaultValue: ['#ffffff', '#ffffff'],
      },
      multicolor: {
        type: 'boolean',
        name: 'Multicolor',
        defaultValue: false,
      },
      moveParticlesOnHover: {
        type: 'boolean',
        name: 'Move on Hover',
        defaultValue: true,
      },
      particleHoverFactor: {
        type: 'number',
        name: 'Hover Factor',
        defaultValue: 1,
        min: 0,
        max: 5,
        step: 0.1,
      },
      alphaParticles: {
        type: 'boolean',
        name: 'Alpha Particles',
        defaultValue: false,
      },
      particleBaseSize: {
        type: 'number',
        name: 'Base Size',
        defaultValue: 100,
        min: 10,
        max: 300,
        step: 5,
      },
      sizeRandomness: {
        type: 'number',
        name: 'Size Randomness',
        defaultValue: 1,
        min: 0,
        max: 3,
        step: 0.1,
      },
      cameraDistance: {
        type: 'number',
        name: 'Camera Distance',
        defaultValue: 20,
        min: 5,
        max: 50,
        step: 1,
      },
      disableRotation: {
        type: 'boolean',
        name: 'Disable Rotation',
        defaultValue: false,
      },
    },
  },
  {
    name: 'MagnetLines',
    component: MagnetLines,
    wrapperStyle: { width: '100%', height: '600px' },
    props: {
      rows: {
        type: 'number',
        name: 'Rows',
        defaultValue: 9,
        min: 3,
        max: 20,
        step: 1,
      },
      columns: {
        type: 'number',
        name: 'Columns',
        defaultValue: 9,
        min: 3,
        max: 20,
        step: 1,
      },
      lineColor: {
        type: 'color',
        name: 'Line Color',
        defaultValue: '#00ff00',
      },
      lineWidth: {
        type: 'text',
        name: 'Line Width',
        defaultValue: '4vmin',
      },
      lineHeight: {
        type: 'text',
        name: 'Line Height',
        defaultValue: '4vmin',
      },
      borderRadius: {
        type: 'text',
        name: 'Border Radius',
        defaultValue: '2px',
      },
      gap: {
        type: 'text',
        name: 'Gap',
        defaultValue: '0px',
      },
      backgroundColor: {
        type: 'color',
        name: 'Background Color',
        defaultValue: '#000000',
      },
      baseAngle: {
        type: 'number',
        name: 'Base Angle',
        defaultValue: 0,
        min: -90,
        max: 90,
        step: 5,
      },
      multicolor: {
        type: 'boolean',
        name: 'Multicolor',
        defaultValue: false,
      },
      colorPalette: {
        type: 'colorArray',
        name: 'Color Palette',
        defaultValue: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
      },
    },
  },
  {
    name: 'GridMotion',
    component: GridMotion,
    wrapperStyle: { width: '100%', height: '600px', position: 'relative', overflow: 'hidden' },
    props: {
      gradientColor: {
        type: 'color',
        name: 'Gradient Color',
        defaultValue: 'black',
      },
      rotationAngle: {
        type: 'number',
        name: 'Rotation Angle',
        defaultValue: -15,
        min: -90,
        max: 90,
        step: 1,
      },
      maxMoveAmount: {
        type: 'number',
        name: 'Max Move Amount',
        defaultValue: 300,
        min: 0,
        max: 1000,
        step: 10,
      },
      animationDuration: {
        type: 'number',
        name: 'Animation Duration',
        defaultValue: 0.8,
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      itemBackgroundColor: {
        type: 'color',
        name: 'Item Background Color',
        defaultValue: '#111111',
      },
      borderRadius: {
        type: 'text',
        name: 'Border Radius',
        defaultValue: '10px',
      },
    },
  },
  // Add more components here as they are created
];

// Control components for different prop types
const TextControl = ({ label, value, onChange }) => (
  <div style={{ marginBottom: '10px' }}>
    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        fontSize: '14px',
      }}
    />
  </div>
);

const VariantControl = ({ label, value, options, onChange }) => (
  <div style={{ marginBottom: '10px' }}>
    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        fontSize: '14px',
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const NumberControl = ({ label, value, min, max, step, onChange }) => (
  <div style={{ marginBottom: '10px' }}>
    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
      {label}: <span style={{ fontWeight: 'normal', color: '#666' }}>{value}</span>
    </label>
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{
        width: '100%',
        cursor: 'pointer',
      }}
    />
  </div>
);

const ColorControl = ({ label, value, onChange }) => (
  <div style={{ marginBottom: '10px' }}>
    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
      {label}
    </label>
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '50px',
          height: '40px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          flex: 1,
          fontSize: '14px',
        }}
      />
    </div>
  </div>
);

const BooleanControl = ({ label, value, onChange }) => (
  <div style={{ marginBottom: '10px' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: '20px',
          height: '20px',
          cursor: 'pointer',
        }}
      />
      <span style={{ fontWeight: 'bold' }}>{label}</span>
    </label>
  </div>
);

const ColorArrayControl = ({ label, value, onChange }) => {
  const handleColorChange = (index, newColor) => {
    const newArray = [...value];
    newArray[index] = newColor;
    onChange(newArray);
  };

  const addColor = () => {
    onChange([...value, '#ffffff']);
  };

  const removeColor = (index) => {
    if (value.length > 1) {
      const newArray = value.filter((_, i) => i !== index);
      onChange(newArray);
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
        {label}
      </label>
      {value.map((color, index) => (
        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px', alignItems: 'center' }}>
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(index, e.target.value)}
            style={{
              width: '50px',
              height: '40px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => handleColorChange(index, e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              flex: 1,
              fontSize: '14px',
            }}
          />
          <button
            onClick={() => removeColor(index)}
            disabled={value.length === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: value.length === 1 ? '#ddd' : '#fff',
              cursor: value.length === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addColor}
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#fff',
          cursor: 'pointer',
          fontSize: '14px',
          marginTop: '5px',
        }}
      >
        + Add Color
      </button>
    </div>
  );
};

// Component Showcase Item
const ComponentShowcase = ({ config }) => {
  const { name, component: Component, props: propDefs, wrapperStyle } = config;
  
  // Initialize state with default values
  const initialState = Object.entries(propDefs).reduce((acc, [key, def]) => {
    acc[key] = def.defaultValue;
    return acc;
  }, {});
  
  const [propValues, setPropValues] = useState(initialState);
  
  const updateProp = (propName, value) => {
    setPropValues((prev) => ({ ...prev, [propName]: value }));
  };
  
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#fff',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>{name}</h2>
      
      {/* Preview Panel */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '150px',
          marginBottom: '20px',
        }}
      >
        <div style={wrapperStyle || { width: '100%' }}>
          <Component {...propValues} />
        </div>
      </div>
      
      {/* Controls Panel */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '6px',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#555' }}>
          Controls
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {Object.entries(propDefs).map(([propName, propDef]) => {
            if (propDef.type === 'text') {
              return (
                <TextControl
                  key={propName}
                  label={propDef.name}
                  value={propValues[propName]}
                  onChange={(value) => updateProp(propName, value)}
                />
              );
            } else if (propDef.type === 'variant') {
              return (
                <VariantControl
                  key={propName}
                  label={propDef.name}
                  value={propValues[propName]}
                  options={propDef.options}
                  onChange={(value) => updateProp(propName, value)}
                />
              );
            } else if (propDef.type === 'number') {
              return (
                <NumberControl
                  key={propName}
                  label={propDef.name}
                  value={propValues[propName]}
                  min={propDef.min}
                  max={propDef.max}
                  step={propDef.step}
                  onChange={(value) => updateProp(propName, value)}
                />
              );
            } else if (propDef.type === 'color') {
              return (
                <ColorControl
                  key={propName}
                  label={propDef.name}
                  value={propValues[propName]}
                  onChange={(value) => updateProp(propName, value)}
                />
              );
            } else if (propDef.type === 'boolean') {
              return (
                <BooleanControl
                  key={propName}
                  label={propDef.name}
                  value={propValues[propName]}
                  onChange={(value) => updateProp(propName, value)}
                />
              );
            } else if (propDef.type === 'colorArray') {
              return (
                <ColorArrayControl
                  key={propName}
                  label={propDef.name}
                  value={propValues[propName]}
                  onChange={(value) => updateProp(propName, value)}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <header
          style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ margin: 0, color: '#333' }}>Component Showcase</h1>
          <p style={{ margin: '10px 0 0', color: '#666' }}>
            Interactive preview of all Webflow components
          </p>
        </header>
        
        <main>
          {componentRegistry.map((config) => (
            <ComponentShowcase key={config.name} config={config} />
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
