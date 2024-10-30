import React from 'react';

interface RunwayProps {
  width?: number;
  height?: number;
}

const AirportRunway2: React.FC<RunwayProps> = ({ 
  width = 800, 
  height = 400 
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <svg 
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto border border-gray-300 rounded-lg shadow-lg"
      >
        
        
        {/* Main Runway */}
        <rect 
          x={100} 
          y={150} 
          width={600} 
          height={100} 
          fill="#404040" 
          className="transition-colors duration-300 hover:fill-gray-800"
        />
        
        {/* Runway Centerline */}
        <path 
          d="M100 200 L700 200" 
          stroke="white" 
          strokeWidth="2" 
          strokeDasharray="20,20" 
        />
        
        {/* Runway Numbers */}
        <text 
          x={120} 
          y={210} 
          fill="white" 
          fontSize={24} 
          fontWeight="bold"
          className="select-none"
        >
          15
        </text>
        <text 
          x={660} 
          y={210} 
          fill="white" 
          fontSize={24} 
          fontWeight="bold"
          className="select-none"
        >
          33
        </text>
        
        {/* Threshold Markings RWY 15 */}
        {[0, 10, 20, 30, 40, 50].map((offset) => (
          <path
            key={`threshold-15-${offset}`}
            d={`M${100 + offset} 160 L${100 + offset} 240`}
            stroke="white"
            strokeWidth="4"
          />
        ))}
        
        {/* Threshold Markings RWY 33 */}
        {[0, 10, 20, 30, 40, 50].map((offset) => (
          <path
            key={`threshold-33-${offset}`}
            d={`M${650 + offset} 160 L${650 + offset} 240`}
            stroke="white"
            strokeWidth="4"
          />
        ))}
        
        {/* Taxiways */}
        {[
          { id: 'E4', x: 100 },
          { id: 'E3', x: 250 },
          { id: 'E2', x: 400 },
          { id: 'E1', x: 550 }
        ].map((taxiway) => (
          <g key={taxiway.id} className="group">
            <rect
              x={taxiway.x}
              y={50}
              width={60}
              height={100}
              fill="#404040"
              className="transition-colors duration-300 hover:fill-gray-700 cursor-pointer"
            />
            <text
              x={taxiway.x + 20}
              y={100}
              fill="white"
              fontSize={20}
              className="select-none pointer-events-none"
            >
              {taxiway.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default AirportRunway2;