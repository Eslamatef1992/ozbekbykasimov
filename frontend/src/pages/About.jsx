import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function About() {
  const [settings, setSettings] = useState({});
  useEffect(() => { api.get('/settings').then((res) => setSettings(res.data)); }, []);

  return (
    <div>
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="text-xs text-ink/50 mb-6">About Us</div>
      </div>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center py-6">
        <div>
          <div className="section-label mb-4">About Us</div>
          <h1 className="font-display text-3xl mb-4">We Invite You To Visit Our Coffee House</h1>
          <p className="text-ink/60 leading-relaxed max-w-md">
            {settings.about_text ||
              'Lorem ipsum dolor sit amet consectetur. Dolor elit vitae nunc varius. Facilisis eget cras sit semper sit enim. Turpis aliquet at ac eu donec ut. Sagittis vestibulum at quis non massa netus.'}
          </p>
        </div>
        <div className="aspect-square rounded-full bg-mint overflow-hidden max-w-sm mx-auto" />
      </section>

      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center py-16">
        <div className="order-2 md:order-1 aspect-square bg-mint mx-auto max-w-sm w-full"
          style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)' }} />
        <div className="order-1 md:order-2">
          <div className="section-label mb-4">Coffee Menu</div>
          <h2 className="font-display text-3xl mb-4">Use The Tips &amp; Recipes From Our Chefs</h2>
          <p className="text-ink/60 leading-relaxed max-w-md">
            Lorem ipsum dolor sit amet consectetur. Facilisis eget cras sit semper. Sagittis vestibulum at quis.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-ink/10">
          <div className="absolute left-6 bottom-6 bg-white/95 rounded-xl px-6 py-5 w-64 shadow-lg">
            <div className="section-label mb-3 text-xs">Reservation</div>
            <div className="flex flex-col gap-2">
              <Link to="/book-table" className="btn-primary text-center">Book A Table</Link>
              <Link to="/contact" className="btn-outline text-center">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
