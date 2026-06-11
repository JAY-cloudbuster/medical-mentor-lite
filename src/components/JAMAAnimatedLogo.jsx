import React, { useState, useEffect, useRef } from 'react';
import useAppStore from '../store/useAppStore';

const JAMAAnimatedLogo = ({ size = 'large' }) => {
  const { darkMode } = useAppStore();
  const [angle, setAngle] = useState(0);
  const requestRef = useRef();
  const lastTimeRef = useRef();

  // Animation Loop: 60 FPS rotation (0.5x slower as requested)
  useEffect(() => {
    const animate = (time) => {
      if (lastTimeRef.current !== undefined) {
        const deltaTime = time - lastTimeRef.current;
        // Increment angle (approx 0.6 radians per second)
        setAngle((prevAngle) => (prevAngle + (deltaTime * 0.0006)) % (2 * Math.PI));
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Theme-specific styles
  const colors = {
    globeBg: darkMode
      ? 'radial-gradient(circle, rgba(30, 27, 75, 1) 0%, rgba(13, 14, 23, 1) 100%)'
      : 'radial-gradient(circle, rgba(224, 231, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)',
    globeBorder: darkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
    land: darkMode ? '#4f46e5' : '#818cf8',
    orbitPath: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
  };

  // Dimensions & Scales based on viewport coordinates (400 x 400)
  const globeRadius = 75;
  const rx = 135; // orbit X radius
  const ry = 42;  // orbit Y radius (tilted)

  // Dynamic stroke widths
  const strokeWidth = size === 'large' ? 1.5 : 2.5;

  // Nodes data to rotate around the earth globe
  const nodesData = [
    { label: 'SU', name: 'SUJITH' },
    { label: 'BH', name: 'BHAVITH' },
    { label: 'JA', name: 'JAYESH' },
    { label: 'CH', name: 'CHAITANYA' },
    { label: 'MA', name: 'MAHESH' }
  ];

  // Calculate 3D position, scaling, opacity, and depth ordering for each node dynamically
  const nodes = nodesData.map((node, i) => {
    const nodeAngle = angle + (i * 2 * Math.PI) / nodesData.length;
    const x = 200 + rx * Math.cos(nodeAngle);
    const y = 200 + ry * Math.sin(nodeAngle);
    const z = Math.sin(nodeAngle); // ranges from -1 (back) to 1 (front)
    const scale = 1 + 0.18 * z;
    const opacity = 0.45 + 0.55 * ((z + 1) / 2);
    const isFront = z >= 0;
    return {
      ...node,
      angle: nodeAngle,
      x,
      y,
      z,
      scale,
      opacity,
      isFront
    };
  });

  // Compute ghost clones for the motion trails
  const renderTrails = (baseAngle, label, isFront) => {
    const ghosts = [0.08, 0.16, 0.24];
    return ghosts.map((delay, idx) => {
      const gAngle = baseAngle - delay;
      const x = 200 + rx * Math.cos(gAngle);
      const y = 200 + ry * Math.sin(gAngle);
      const z = Math.sin(gAngle);
      
      const isGhostFront = z >= 0;
      
      if (isGhostFront !== isFront) return null;

      const scale = (1 + 0.18 * z) * 0.9;
      const opacity = (0.45 + 0.55 * ((z + 1) / 2)) * (0.45 - idx * 0.15);

      return (
        <g key={`trail-${label}-${idx}`} transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
          <text
            x="0"
            y="0"
            textAnchor="middle"
            className="font-bold select-none cursor-default font-display"
            fontSize="36"
            fill={darkMode ? '#818cf8' : '#4f46e5'}
          >
            {label}
          </text>
        </g>
      );
    });
  };

  const renderLetterNode = (label, name, x, y, z, opacity, scale) => {
    return (
      <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
        {/* Glow Shadow */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          className="font-bold select-none cursor-default font-display"
          fontSize="36"
          fill={darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.25)'}
          style={{ filter: 'blur(5px)', transform: 'translateY(1.5px)' }}
        >
          {label}
        </text>
        {/* Core Letter */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          className="font-bold select-none cursor-default font-display transition-colors duration-300"
          fontSize="36"
          fill={darkMode ? '#ffffff' : '#111827'}
        >
          {label}
        </text>
        {/* Subtitle Name */}
        {size === 'large' && (
          <text
            x="0"
            y="14"
            textAnchor="middle"
            className="font-medium tracking-[0.15em] uppercase select-none cursor-default font-inter transition-colors duration-300"
            fontSize="9"
            fill={darkMode ? '#94a3b8' : '#475569'}
          >
            {name}
          </text>
        )}
      </g>
    );
  };

  // SVG dimensions - Scale increased heavily for "large" size
  const containerSize = size === 'large' ? '100%' : '44px';
  const displayStyle = size === 'large' ? { maxWidth: '850px', maxHeight: '850px' } : {};

  // DOM Layer Ordering: back nodes -> globe -> front nodes
  const backNodes = (
    <g>
      {nodes.filter(n => !n.isFront).map(n => (
        <React.Fragment key={n.label}>
          {renderTrails(n.angle, n.label, false)}
          {renderLetterNode(n.label, n.name, n.x, n.y, n.z, n.opacity, n.scale)}
        </React.Fragment>
      ))}
    </g>
  );

  const frontNodes = (
    <g>
      {nodes.filter(n => n.isFront).map(n => (
        <React.Fragment key={n.label}>
          {renderTrails(n.angle, n.label, true)}
          {renderLetterNode(n.label, n.name, n.x, n.y, n.z, n.opacity, n.scale)}
        </React.Fragment>
      ))}
    </g>
  );

  // Earth Animation Variables
  // Calculate map offset to simulate smooth horizontal rotation
  const mapWidth = 235; // seamless wrapping width
  const progress = (angle * 0.5) / (2 * Math.PI); // rotate map at a defined speed relative to angle
  const mapX = -(progress % 1) * mapWidth;

  // Stylized landmass pattern
  const StyledMap = ({ offset }) => (
    <g transform={`translate(${offset}, 0)`} fill={colors.land} className="transition-colors duration-300">
      {/* North America */}
      <rect x="20" y="135" width="40" height="25" rx="10" />
      <rect x="40" y="150" width="25" height="40" rx="10" />
      {/* South America */}
      <rect x="50" y="180" width="30" height="50" rx="15" />
      <rect x="65" y="210" width="15" height="40" rx="7" />
      {/* Eurasia */}
      <rect x="120" y="130" width="70" height="30" rx="15" />
      <rect x="160" y="140" width="60" height="40" rx="15" />
      <rect x="110" y="145" width="20" height="20" rx="10" />
      {/* Africa */}
      <rect x="115" y="160" width="50" height="55" rx="20" />
      <rect x="130" y="190" width="30" height="50" rx="15" />
      {/* Australia */}
      <rect x="195" y="210" width="35" height="25" rx="10" />
      {/* Scattered Islands */}
      <circle cx="185" cy="195" r="5" />
      <circle cx="215" cy="240" r="3" />
      <circle cx="100" cy="140" r="4" />
    </g>
  );

  return (
    <div className="flex items-center justify-center w-full" style={displayStyle}>
      <svg
        viewBox="0 0 400 400"
        width={containerSize}
        height={containerSize}
        className="w-full h-full"
      >
        <defs>
          <clipPath id="globe-clip">
            <circle cx="200" cy="200" r={globeRadius} />
          </clipPath>
          {/* Subtle 3D shadow for the earth edges */}
          <radialGradient id="globe-shadow" cx="35%" cy="35%" r="65%">
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity={darkMode ? "0.6" : "0.3"} />
          </radialGradient>
        </defs>

        {/* Orbit Ellipse Track */}
        <ellipse
          cx="200"
          cy="200"
          rx={rx}
          ry={ry}
          fill="none"
          stroke={colors.orbitPath}
          strokeWidth={strokeWidth * 0.75}
        />

        {/* Orbit Back Elements (behind globe) */}
        {backNodes}

        {/* Central Animated Earth Sphere */}
        <g>
          {/* Ocean Background */}
          <circle
            cx="200"
            cy="200"
            r={globeRadius}
            fill={darkMode ? '#1e1b4b' : '#e0e7ff'}
            stroke={colors.globeBorder}
            strokeWidth={strokeWidth}
            className="transition-colors duration-300"
          />

          {/* Continents inside clip mask */}
          <g clipPath="url(#globe-clip)" opacity={0.85}>
            <StyledMap offset={mapX} />
            <StyledMap offset={mapX + mapWidth} />
            <StyledMap offset={mapX + mapWidth * 2} />
          </g>

          {/* 3D Atmospheric Edge Shadow overlay */}
          <circle
            cx="200"
            cy="200"
            r={globeRadius}
            fill="url(#globe-shadow)"
            style={{ mixBlendMode: 'multiply' }}
          />
          
          {/* Subtle top-left glare/highlight */}
          <circle
            cx="175"
            cy="175"
            r={globeRadius * 0.6}
            fill="white"
            opacity={darkMode ? "0.05" : "0.3"}
            style={{ filter: "blur(12px)" }}
          />
        </g>

        {/* Orbit Front Elements (in front of globe) */}
        {frontNodes}
      </svg>
    </div>
  );
};

export default JAMAAnimatedLogo;
