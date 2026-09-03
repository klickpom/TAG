import { Routes, Route } from 'react-router'
import { CartProvider } from '@/context/CartContext'
import Home from './pages/Home'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </CartProvider>
  )
}
