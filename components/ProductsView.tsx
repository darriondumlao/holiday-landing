'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ProductCard from './ProductCard'
import PasswordProductCard from './PasswordProductCard'
import CartModal, { CartItem } from './CartModal'
import { useShopifyCollection, sortSwingersProducts } from '@/hooks/useShopifyCollection'

interface ProductsViewProps {
  isVisible: boolean
  cartItems: CartItem[]
  onAddToCart: (product: { name: string; price: number; size?: string; image?: string; variantId?: string; quantityAvailable?: number }) => void
  onRemoveFromCart: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onCheckout: () => void
}

export default function ProductsView({
  isVisible,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onCheckout
}: ProductsViewProps) {
  // Fetch products from Shopify collections
  const { products: swingersProducts, loading: swingersLoading } = useShopifyCollection('swingers', sortSwingersProducts)
  const { products: preSwingersProducts, loading: preSwingersLoading } = useShopifyCollection('pre-swingers')

  // Track which cards are revealed (showing heart logo)
  // Using string keys like 'swingers-0', 'preswingers-0' to differentiate collections
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({})

  const mobileCartRef = useRef<HTMLDivElement>(null)
  const desktopCartRef = useRef<HTMLDivElement>(null)
  const desktopScrollContainerRef = useRef<HTMLDivElement>(null)

  // Arrow key navigation for desktop product grid
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const container = desktopScrollContainerRef.current
      if (!container) return

      e.preventDefault()
      container.scrollBy({
        top: e.key === 'ArrowDown' ? 400 : -400,
        behavior: 'smooth'
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  const revealCard = (key: string) => {
    setRevealedCards(prev => ({ ...prev, [key]: true }))
  }

  const hideCard = (key: string) => {
    setRevealedCards(prev => ({ ...prev, [key]: false }))
  }

  const scrollToCart = () => {
    // Check if we're on mobile or desktop and scroll to the appropriate cart
    if (window.innerWidth < 768) {
      mobileCartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      desktopCartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Check if a product is the hidden/password-protected item
  const isHiddenProduct = (product: { name: string }) =>
    product.name.toLowerCase().includes('+ more') || product.name.toLowerCase().includes('hidden')

  // Render a product card
  const renderProductCard = (
    key: string,
    card: React.ReactNode
  ) => {
    return (
      <div className='relative'>
        {card}
      </div>
    )
  }

  // Render cart with heart logo reveal
  const renderCart = (isMobile: boolean = false) => {
    const cartKey = 'cart'

    return (
      <div className='relative'>
        <div className={isMobile ? 'rounded-sm overflow-hidden' : ''}>
          <CartModal
            title='cart'
            onClose={() => revealCard(cartKey)}
            items={cartItems}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveFromCart}
            onCheckout={onCheckout}
            isMobileEmbedded={isMobile}
          />
        </div>
        {revealedCards[cartKey] && (
          <div
            className='absolute inset-0 flex items-center justify-center bg-black rounded-sm cursor-pointer overflow-hidden z-10'
            onClick={() => hideCard(cartKey)}
          >
            <Image
              src="/HEARTLOGO.png"
              alt="Holiday Heart"
              width={isMobile ? 120 : 150}
              height={isMobile ? 120 : 150}
              className="object-contain hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
      </div>
    )
  }

  const productsReady = !swingersLoading && swingersProducts.length > 0

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <span className='text-white text-2xl md:text-4xl tracking-wider'>
        drop in
      </span>
    </div>
  )
}
