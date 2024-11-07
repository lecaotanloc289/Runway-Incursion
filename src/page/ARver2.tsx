/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlane } from 'react-icons/fa'
import { IoWarning } from 'react-icons/io5'
import { Alert, Button, Popconfirm, Space } from 'antd'
import { BsQuestionCircle } from 'react-icons/bs'

// Utility functions
const isValidPosition = (x: string, y: string): boolean => {
  const numX = parseFloat(x)
  const numY = parseFloat(y)
  return !isNaN(numX) && !isNaN(numY) && numX >= 0 && numX <= 100 && numY >= 0 && numY <= 100
}

const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

// Runway checks
const isOnRunway = (x: number, y: number) => x > 41 && x < 54 && y > -1 && y < 88
const isOverThreshold = (x: number, y: number) => x > 41 && x < 54 && y >= 88
const isOnE4 = (x: number, y: number) => x >= 30 && x <= 42 && y >= 78 && y <= 85
const isRepairArea = (x: number, y: number) => x >= 42 && x <= 53 && y >= 0 && y <= 11

// Plane conflict and alert checks
const checkProximity = (planes: Plane[], setAlert: (msg: string) => void) => {
  const validPlanes = planes.filter((plane) => plane.isValid)
  for (let i = 0; i < validPlanes.length; i++) {
    for (let j = i + 1; j < validPlanes.length; j++) {
      const distance = calculateDistance(
        parseFloat(validPlanes[i].x),
        parseFloat(validPlanes[i].y),
        parseFloat(validPlanes[j].x),
        parseFloat(validPlanes[j].y)
      )
      if (distance < 10) {
        setAlert(`Warning: Planes ${validPlanes[i].id} and ${validPlanes[j].id} are too close!`)
        return
      }
    }
  }
  setAlert('')
}

const handlePlaneAlert = (planes: Plane[], setAlert: (msg: string) => void) => {
  const [planeA, planeB, planeC] = planes

  if (isOnRunway(parseFloat(planeA.x), parseFloat(planeA.y))) {
    setAlert('Plane B: RUNWAY OCCUPIED! Plane C: RUNWAY OCCUPIED!')
  }

  if (planeA.x && planeA.y && isOverThreshold(parseInt(planeA.x), parseInt(planeA.y))) {
    setAlert('Plane C: RUNWAY OCCUPIED!')
    if (isOnE4(parseInt(planeC.x), parseInt(planeC.y))) {
      setAlert('Plane C: RUNWAY OCCUPIED!')
    }
  }
}

// Main Component
const ARver2: React.FC = () => {
  const [planes, setPlanes] = useState<Plane[]>([
    { id: 'A', x: '', y: '', isValid: false },
    { id: 'B', x: '', y: '', isValid: false },
    { id: 'C', x: '', y: '', isValid: false }
  ])
  const [alert, setAlert] = useState<string>('')
  const [open, setOpen] = useState(false)

  const handlePositionChange = (id: string, field: 'x' | 'y', value: string) => {
    setPlanes((prevPlanes) => {
      const updatedPlanes = prevPlanes.map((plane) => {
        if (plane.id === id) {
          const updatedPlane = { ...plane, [field]: value, isValid: isValidPosition(value, plane.y) }
          return updatedPlane
        }
        return plane
      })
      checkProximity(updatedPlanes, setAlert)
      return updatedPlanes
    })
  }

  useEffect(() => {
    handlePlaneAlert(planes, setAlert)
  }, [planes])

  return (
    <div className='bg-gray-100 p-8'>
      <Popconfirm
        open={open}
        title='CONFIRM TAKEOFF ABORTED ?'
        description='Are you sure to confirm?'
        onCancel={() => setOpen(false)}
        onConfirm={() => setAlert('Plane B: RUNWAY OCCUPIED! Plane C: RUNWAY OCCUPIED!')}
        icon={<BsQuestionCircle style={{ color: 'red', marginTop: 3, marginRight: 2 }} />}
      />

      <div className='max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6'>
        <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>Airport Runway Control</h1>

        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className='my-3 p-4 bg-orange-100 border border-orange-400 text-orange-700 rounded-md flex items-center space-x-2'
              role='alert'
            >
              <IoWarning className='text-xl' />
              <span>{alert}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>Enter Airplane Positions</h2>
            {planes.map((plane) => (
              <div key={plane.id} className='space-y-3'>
                <h3 className='text-lg font-medium text-gray-600'>Airplane {plane.id}</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor={`x-${plane.id}`} className='block text-sm font-medium text-gray-700'>
                      X Position (0-100)
                    </label>
                    <input
                      type='number'
                      id={`x-${plane.id}`}
                      value={plane.x}
                      onChange={(e) => handlePositionChange(plane.id, 'x', e.target.value)}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label htmlFor={`y-${plane.id}`} className='block text-sm font-medium text-gray-700'>
                      Y Position (0-100)
                    </label>
                    <input
                      type='number'
                      id={`y-${plane.id}`}
                      value={plane.y}
                      onChange={(e) => handlePositionChange(plane.id, 'y', e.target.value)}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='relative bg-gray-800 rounded-xl p-4 h-[500px] overflow-hidden'>
            <div className='absolute inset-0 bg-cover bg-center opacity-20' />
            <div className='relative h-full'>
              <AirportRunway3 />
              <AnimatePresence>
                {planes.map(
                  (plane) =>
                    plane.isValid && (
                      <motion.div
                        key={plane.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, rotate: 90 }}
                        exit={{ opacity: 0, scale: 0 }}
                        style={{
                          left: `${plane.x}%`,
                          top: `${plane.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className='absolute'
                      >
                        <span style={{ color: 'white', transform: 'rotate(-90deg)', display: 'inline-block' }}>
                          {plane.id}
                        </span>
                        <FaPlane className='text-white text-2xl' aria-label={`Airplane ${plane.id}`} />
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Airport Runway component remains mostly unchanged
const AirportRunway3: React.FC<RunwayProps> = () => {
  return (
    <div className='w-full h-full p-4 relative'>
      <svg viewBox='0 0 800 400' className='w-full h-full rounded-lg shadow-lg' transform='rotate(-90, 0, 0)'>
        {/* Main Runway */}
        <rect x={100} y={150} width={800} height={100} fill='#404040' />
        <path d='M100 200 L700 200' stroke='white' strokeWidth='2' strokeDasharray='20,20' />
        <text x={120} y={210} fill='white' fontSize={24} fontWeight='bold'>
          15
        </text>
        <text x={660} y={210} fill='white' fontSize={24} fontWeight='bold'>
          33
        </text>

        {/* Taxiways */}
        {[
          { id: 'E4', x: 100 },
          { id: 'E3', x: 250 },
          { id: 'E2', x: 500 },
          { id: 'E1', x: 640 }
        ].map((taxiway) => (
          <g key={taxiway.id}>
            <rect x={taxiway.x} y={50} width={60} height={100} fill='#404040' />
            <text x={taxiway.x + 20} y={100} fill='white' fontSize={20}>
              {taxiway.id}
            </text>
            <line x1={taxiway.x} y1={110} x2={taxiway.x + 60} y2={110} stroke='yellow' strokeWidth='2' />
          </g>
        ))}
      </svg>
    </div>
  )
}

export default ARver2
