/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlane } from 'react-icons/fa'
import { IoWarning } from 'react-icons/io5'
import { Alert, Button, Popconfirm, Space } from 'antd'
import { BsQuestionCircle } from 'react-icons/bs'
interface Plane {
  id: string
  x: number
  y: number
  isValid: boolean
}

const AirportRunway: React.FC = () => {
  const [planes, setPlanes] = useState<Plane[]>([
    { id: 'A', x: 0, y: 0, isValid: false },
    { id: 'B', x: 0, y: 0, isValid: false },
    { id: 'C', x: 0, y: 0, isValid: false }
  ])

  const [alert, setAlert] = useState<string>('')
  const [open, setOpen] = useState(false)

  const validatePosition = (x: number, y: number): boolean => {
    const numX = parseFloat(x)
    const numY = parseFloat(y)
    return !isNaN(numX) && !isNaN(numY) && numX >= 0 && numX <= 100 && numY >= 0 && numY <= 100
  }

  const handlePositionChange = (id: string, field: 'x' | 'y', value: string) => {
    const updatedPlanes = planes.map((plane) => {
      if (plane.id === id) {
        const updatedPlane = {
          ...plane,
          [field]: value
        }
        updatedPlane.isValid = validatePosition(updatedPlane.x, updatedPlane.y)
        return updatedPlane
      }
      return plane
    })

    setPlanes(updatedPlanes)
    checkProximity(updatedPlanes)
  }

  const checkProximity = (updatedPlanes: Plane[]) => {
    const validPlanes = updatedPlanes.filter((plane) => plane.isValid)

    for (let i = 0; i < validPlanes.length; i++) {
      for (let j = i + 1; j < validPlanes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(validPlanes[i].x - validPlanes[j].x, 2) + Math.pow(validPlanes[i].y - validPlanes[j].y, 2)
        )

        if (distance < 10) {
          setAlert(`Warning: Planes ${validPlanes[i].id} and ${validPlanes[j].id} are too close!`)
          return
        }
      }
    }
    setAlert('')
  }

  function isRepair(x: number, y: number) {
    if (x >= 42 && x <= 53) {
      return y >= 0 && y <= 11
    }
  }

  function isOnE4(x: number, y: number) {
    return x >= 0 && x <= 36 && y >= 78 && y <= 85
  }

  // 1
  function isOnRunWay(x: number, y: number) {
    if (x > 41 && x < 54) {
      return y > -1 && y < 88
    } else return false
  }

  function isOverThreshold(x: number, y: number) {
    return x > 41 && x < 54 && y >= 88
  }

  function isOverHoldShortLine(x: number, y: number) {
    if (x >= 37) {
      if (isRepair(planes[1].x, planes[1].y)) {
        setAlert(
          'Máy bay C: MAKING INCURSION MAKING INCURSION MAKING INCURSION HOLD POSITION HOLD POSITION Máy bay B: RWY Incursion'
        )
        if (x < 43) {
          setAlert(
            'Máy bay C: MAKING INCURSION MAKING INCURSION MAKING INCURSION HOLD POSITION HOLD POSITION Máy bay B: RWY Incursion '
          )
        } else {
          setAlert(
            'Máy bay B: CONFLICT CONFLICT CONFLICTGO AROUND GO AROUND Máy bay C: MAKING INCURSION MAKING INCURSION MAKING INCURSION'
          )
        }
      } else {
        if (!isOnE4(planes[1].x, planes[1].y)) {
          if (planes[1].y > y) {
            setAlert(
              'Máy bay C: MAKING INCURSION MAKING INCURSION MAKING INCURSION Máy bay B: INCURSION INCURSION INCURSION'
            )
          } else {
            if (x < 43) {
              setAlert(
                'Máy bay C: MAKING INCURSION MAKING INCURSION MAKING INCURSION Máy bay B: INCURSION INCURSION INCURSION'
              )
            } else {
              setAlert(' Máy bay B: CONFLICT CONFLICT CONFLICT Máy bay C: CONFLICT CONFLICT CONFLICT')
            }
          }
        } else setAlert('')

        // STOP ALERT
      }
    } else {
      setAlert('Máy bay C: RUNWAY OCCUPIED')
      if (!isOnE4(planes[1].x, planes[1].y)) {
        setAlert('Máy bay C: RUNWAY OCCUPIED')
      } else {
        // STOP ALERT
        setAlert('')
      }
    }
  }

  function checkAirPlane() {
    // 1 | Kiểm tra A có trong đường băng hay không
    if (isOnRunWay(planes[0].x, planes[0].y)) {
      setAlert('Máy bay B: RUNWAY OCCUPIED! Máy bay C: RUNWAY OCCUPIED!')
    }

    // 2 | Kiểm tra A có đang bay ra khỏi đường bay hay không
    if (planes[0].x && planes[0].y && isOverThreshold(planes[0].x, planes[0].y)) {
      // ĐÚNG | Máy bay A overthreshold
      setAlert('Máy bay C: RUNWAY OCCUPIED!')
      isOverHoldShortLine(planes[2].x, planes[2].y)
    } else {
      // SAI
      // planes[0].x && planes[0].y && setAlert('Máy bay B: RUNWAY OCCUPIED! Máy bay C: RUNWAY OCCUPIED!')
      if (planes[2].x >= 37) {
        if (planes[2].y < planes[0].y) {
          setAlert(
            'Máy bay A: INCURSION INCURSION INCURSION Máy bay C: MAKING INCURSION MAKING INCURSION MAKING INCURSION HOLD POSITION HOLD POSITION'
          )
        } else {
          if (planes[2].x > 43) {
            setAlert(
              'Máy bay A: INCURSION INCURSION INCURSION Máy bay C: MAKING INCURSION MAKING INCURSION MAKING INCURSION HOLD POSITION HOLD POSITION'
            )
          } else {
            setAlert('Máy bay A: CONFLICT CONFLICT CONFLICT Máy bay C: CONFLICT CONFLICT CONFLICT')
          }
        }
      } else {
        setAlert('Máy bay B: RUNWAY OCCUPIED! Máy bay C: RUNWAY OCCUPIED!')
      }
    }
  }

  // Kiểm tra liên tục nếu nhập giá trị cho A, B, C
  useEffect(() => {
    checkAirPlane()
  }, [planes])

  return (
    <div className=' bg-gray-100 p-8'>
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
                      aria-label={`X position for airplane ${plane.id}`}
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
                      aria-label={`Y position for airplane ${plane.id}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='relative bg-gray-800 rounded-xl p-4 h-[500px] overflow-hidden'>
            <div className='absolute inset-0  bg-cover bg-center opacity-20' />
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

export default AirportRunway

interface RunwayProps {
  width?: number
  height?: number
}

const AirportRunway3: React.FC<RunwayProps> = () => {
  return (
    <div className='w-full h-full p-4 relative'>
      <svg viewBox='0 0 800 400' className='w-full h-full rounded-lg shadow-lg' transform='rotate(-90, 0, 0)'>
        {/* Main Runway */}
        <rect
          x={100}
          y={150}
          width={800}
          height={100}
          fill='#404040'
          className='transition-colors duration-300 hover:fill-gray-800'
        />

        {/* Runway Centerline */}
        <path d='M100 200 L700 200' stroke='white' strokeWidth='2' strokeDasharray='20,20' />

        {/* Runway Numbers */}
        <text x={120} y={210} fill='white' fontSize={24} fontWeight='bold' className='select-none'>
          15
        </text>
        <text x={660} y={210} fill='white' fontSize={24} fontWeight='bold' className='select-none'>
          33
        </text>

        {/* Threshold Markings RWY 15 */}
        {[0, 10, 20, 30, 40, 50].map((offset) => (
          <path
            key={`threshold-15-${offset}`}
            d={`M${100 + offset} 160 L${100 + offset} 240`}
            stroke='white'
            strokeWidth='4'
          />
        ))}

        {/* Threshold Markings RWY 33 */}
        {[0, 10, 20, 30, 40, 50].map((offset) => (
          <path
            key={`threshold-33-${offset}`}
            d={`M${650 + offset} 160 L${650 + offset} 240`}
            stroke='white'
            strokeWidth='4'
          />
        ))}

        {/* Taxiways */}
        {[
          { id: 'E4', x: 100 },
          { id: 'E3', x: 250 },
          { id: 'E2', x: 500 },
          { id: 'E1', x: 640 }
        ].map((taxiway) => (
          <g key={taxiway.id} className='group'>
            <rect
              x={taxiway.x}
              y={50}
              width={60}
              height={100}
              fill='#404040'
              className='transition-colors duration-300 hover:fill-gray-700 cursor-pointer'
            />
            <text x={taxiway.x + 20} y={100} fill='white' fontSize={20} className='select-none pointer-events-none'>
              {taxiway.id}
            </text>
            <line x1={taxiway.x} y1={110} x2={taxiway.x + 60} y2={110} stroke='yellow' strokeWidth='2' />
          </g>
        ))}
      </svg>
    </div>
  )
}
