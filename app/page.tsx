'use client'

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { TOUCH } from 'three'

const MODEL_URL = '/codxholiday.glb'

function Model() {
  const { scene } = useGLTF(MODEL_URL)
  return <primitive object={scene} />
}

useGLTF.preload(MODEL_URL)

function LoadingSpinner() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 24,
          height: 24,
          border: '2px solid rgba(255,255,255,0.15)',
          borderTopColor: 'rgba(255,255,255,0.6)',
          borderRadius: '50%',
        }}
      />
    </div>
  )
}

export default function Home() {
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(pointer: coarse)').matches)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prevent iOS overscroll / pull-to-refresh (but allow form interaction)
  useEffect(() => {
    const prevent = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      // Allow touch on form elements
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'FORM' ||
        target.closest('form')
      ) return
      if (e.touches.length > 1) return // allow pinch
      e.preventDefault()
    }
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    document.addEventListener('touchmove', prevent, { passive: false })
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.removeEventListener('touchmove', prevent)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !phone.trim()) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    const phoneRegex = /^\d+$/
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid phone number')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.alreadySubscribed) {
          setError("You're already subscribed!")
          setEmail('')
          setPhone('')
        } else {
          setSuccess(true)
          setTimeout(() => {
            setSuccess(false)
            setEmail('')
            setPhone('')
            setShowSubscribe(false)
          }, 3000)
        }
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      console.error('Error subscribing:', err)
      setError('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: '#000',
        position: 'fixed',
        inset: 0,
        touchAction: 'none',
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Loading spinner — visible until model renders */}
      {!loaded && <LoadingSpinner />}

      {/* 3D Model Viewer */}
      <Canvas
        camera={{ fov: isMobile ? 50 : 45 }}
        shadows
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{
          antialias: !isMobile,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        onCreated={() => setLoaded(true)}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} shadows>
            <Model />
          </Stage>
        </Suspense>
        <OrbitControls
          enableZoom
          enablePan={!isMobile}
          enableRotate
          enableDamping
          dampingFactor={0.08}
          minDistance={isMobile ? 2 : 1}
          maxDistance={isMobile ? 15 : 20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          zoomSpeed={isMobile ? 0.5 : 0.8}
          rotateSpeed={isMobile ? 0.4 : 0.6}
          touches={{
            ONE: TOUCH.ROTATE,
            TWO: TOUCH.DOLLY_ROTATE,
          }}
        />
      </Canvas>

      {/* Subscribe Button */}
      <AnimatePresence>
        {!showSubscribe && loaded && (
          <motion.button
            key="subscribe-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={() => setShowSubscribe(true)}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 border-b border-gray-600 hover:border-gray-400 transition-colors tracking-widest text-xs pb-1 text-white"
            style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
          >
            subscribe
          </motion.button>
        )}
      </AnimatePresence>

      {/* Subscribe Form Overlay */}
      <AnimatePresence>
        {showSubscribe && (
          <motion.div
            key="subscribe-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-20 flex items-end justify-center pb-8"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="relative w-full max-w-xs px-6"
              style={{ pointerEvents: 'auto', touchAction: 'auto' }}
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={() => setShowSubscribe(false)}
                className="absolute -top-2 -right-2 transition-colors z-10 text-gray-500 hover:text-gray-300 p-2"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>

              {success ? (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-500 text-xs py-2 text-center"
                >
                  successfully subscribed!
                </motion.p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email address"
                      className="w-full bg-transparent border-b border-gray-600 text-white text-center py-2 px-4 text-xs focus:outline-none focus:border-gray-400 placeholder:tracking-widest placeholder:text-xs placeholder:text-gray-600"
                      disabled={isSubmitting}
                      autoComplete="email"
                      enterKeyHint="next"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="phone number"
                      className="w-full bg-transparent border-b border-gray-600 text-white text-center py-2 px-4 text-xs focus:outline-none focus:border-gray-400 placeholder:tracking-widest placeholder:text-xs placeholder:text-gray-600"
                      disabled={isSubmitting}
                      autoComplete="tel"
                      enterKeyHint="send"
                    />
                  </motion.div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-yellow-500 text-xs text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                  <motion.button
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-blue-500 hover:text-blue-400 transition-colors tracking-widest text-xs disabled:opacity-50"
                  >
                    {isSubmitting ? 'sending...' : 'submit'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
