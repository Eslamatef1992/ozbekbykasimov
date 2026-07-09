import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const DELIVERY_FEE = 3.0;

export default function Checkout() {
  const { items, subtotal, refresh } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fulfillment_type: 'delivery',
    payment_method: 'cash',
    delivery_address: '',
    delivery_city: '',
    delivery_notes: '',
    contact_phone: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fee = form.fulfillment_type === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + fee;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', form);
      await refresh();
      navigate(`/profile?order=${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return <div className="max-w-4xl mx-auto px-4 py-16">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-8">
        <h1 className="text-3xl">Checkout</h1>

        <div>
          <h2 className="font-medium mb-3">Fulfillment</h2>
          <div className="flex gap-3">
            {[
              ['delivery', 'Delivery'],
              ['pickup', 'Pickup'],
              ['dine_in', 'Dine In'],
            ].map(([value, label]) => (
              <label key={value} className={`flex-1 border rounded-xl p-3 text-center cursor-pointer ${form.fulfillment_type === value ? 'border-accent bg-accent/5' : 'border-navy/15'}`}>
                <input type="radio" name="fulfillment_type" value={value} checked={form.fulfillment_type === value}
                  onChange={(e) => update('fulfillment_type', e.target.value)} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {form.fulfillment_type === 'delivery' && (
          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="Delivery address" value={form.delivery_address}
              onChange={(e) => update('delivery_address', e.target.value)}
              className="border border-navy/20 rounded-lg px-3 py-2 sm:col-span-2" />
            <input required placeholder="City" value={form.delivery_city}
              onChange={(e) => update('delivery_city', e.target.value)}
              className="border border-navy/20 rounded-lg px-3 py-2" />
            <input placeholder="Delivery notes (optional)" value={form.delivery_notes}
              onChange={(e) => update('delivery_notes', e.target.value)}
              className="border border-navy/20 rounded-lg px-3 py-2" />
          </div>
        )}

        <input required placeholder="Contact phone" value={form.contact_phone}
          onChange={(e) => update('contact_phone', e.target.value)}
          className="border border-navy/20 rounded-lg px-3 py-2 w-full" />

        <div>
          <h2 className="font-medium mb-3">Payment Method</h2>
          <div className="flex gap-3">
            {[
              ['cash', 'Cash'],
              ['card', 'Card'],
              ['paypal', 'PayPal'],
            ].map(([value, label]) => (
              <label key={value} className={`flex-1 border rounded-xl p-3 text-center cursor-pointer ${form.payment_method === value ? 'border-accent bg-accent/5' : 'border-navy/15'}`}>
                <input type="radio" name="payment_method" value={value} checked={form.payment_method === value}
                  onChange={(e) => update('payment_method', e.target.value)} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button disabled={submitting} className="bg-accent text-white px-8 py-3 rounded-full disabled:opacity-50">
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>

      <aside className="border border-navy/10 rounded-xl p-6 h-fit bg-white">
        <h2 className="font-medium mb-4">Order Summary</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span>{i.quantity} x {i.name}</span>
              <span>{(Number(i.price) * i.quantity).toFixed(0)} Kd</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-navy/10 mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toFixed(0)} Kd</span></div>
          <div className="flex justify-between"><span>Delivery fee</span><span>{fee.toFixed(0)} Kd</span></div>
          <div className="flex justify-between font-medium text-base pt-2"><span>Total</span><span className="text-accent">{total.toFixed(0)} Kd</span></div>
        </div>
      </aside>
    </div>
  );
}
