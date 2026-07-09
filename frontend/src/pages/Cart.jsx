import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, subtotal, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-navy/60">Your cart is empty. <Link to="/menu" className="text-accent">Browse the menu</Link>.</p>
      ) : (
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex items-center justify-between border border-navy/10 rounded-xl p-4 bg-white">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-navy/60">{Number(i.price).toFixed(0)} Kd each</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-navy/20 rounded-full">
                  <button onClick={() => updateItem(i.id, Math.max(1, i.quantity - 1))} className="px-3 py-1">-</button>
                  <span className="px-3">{i.quantity}</span>
                  <button onClick={() => updateItem(i.id, i.quantity + 1)} className="px-3 py-1">+</button>
                </div>
                <div className="w-20 text-right">{(Number(i.price) * i.quantity).toFixed(0)} Kd</div>
                <button onClick={() => removeItem(i.id)} className="text-navy/40 hover:text-accent">Remove</button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-6 border-t border-navy/10">
            <div className="text-lg">Subtotal: <span className="text-accent">{subtotal.toFixed(0)} Kd</span></div>
            <button onClick={() => navigate('/checkout')} className="bg-accent text-white px-6 py-3 rounded-full">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
