'use client';

import { Check, Zap, CreditCard, History } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  { 
    name: 'Starter', 
    price: '$0', 
    desc: 'Perfect for new creators.',
    features: ['100 Automations/mo', 'Basic Analytics', 'Standard Support', '1 IG Account'],
    current: true
  },
  { 
    name: 'Pro', 
    price: '$29', 
    desc: 'For growing businesses.',
    features: ['Unlimited Automations', 'Advanced Analytics', 'Priority Support', '3 IG Accounts', 'AI Suggestions'],
    current: false,
    popular: true
  },
  { 
    name: 'Agency', 
    price: '$99', 
    desc: 'For management teams.',
    features: ['Unlimited Everything', 'Custom Webhooks', 'Team Access', '10 IG Accounts', 'White-labeling'],
    current: false
  },
];

export default function BillingPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-slideIn">
      <div>
        <h1 className="text-3xl font-bold text-accent italic">Plans & Billing</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and usage limits.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`card flex flex-col relative ${plan.popular ? 'border-brand ring-1 ring-brand' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-accent">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-accent">{plan.price}</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">{plan.desc}</p>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all ${
              plan.current ? 'bg-secondary text-gray-400 cursor-not-allowed' : 'btn-primary'
            }`}>
              {plan.current ? 'Current Plan' : 'Upgrade Now'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Payment History */}
      <div className="space-y-6 pt-12">
        <h2 className="text-xl font-bold text-accent">Payment History</h2>
        <div className="card p-0 overflow-hidden divide-y divide-gray-50">
          {[
            { date: 'Oct 01, 2026', amount: '$0.00', status: 'Paid', method: 'Free Plan' },
          ].map((invoice, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <History className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-accent text-sm">{invoice.date}</p>
                  <p className="text-xs text-gray-400">{invoice.method}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className="font-bold text-accent text-sm">{invoice.amount}</span>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg uppercase tracking-widest">{invoice.status}</span>
                <button className="text-xs font-bold text-brand hover:underline">Download PDF</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
