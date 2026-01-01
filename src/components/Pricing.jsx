import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { pricingAPI } from '../api';
import LoadingSpinner from './ui/LoadingSpinner';
import { Check, X, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { t } = useLanguage();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await pricingAPI.getAll();
      setPackages(response.data);
    } catch (error) {
      console.error('Error loading packages:', error);
      // Use default packages if API fails
      setPackages(defaultPackages);
    } finally {
      setLoading(false);
    }
  };

  // Default packages if no data from API
  const defaultPackages = [
    {
      id: 1,
      name: 'Starter',
      description: 'Perfect for small businesses just getting started',
      price_monthly: 2500000,
      price_yearly: 25000000,
      features: ['Landing Page', 'Mobile Responsive', '3 Revisions', 'Basic SEO', '1 Month Support'],
      not_included: ['Custom Design', 'CMS Integration', 'E-commerce'],
      is_popular: false,
      icon: 'Zap',
    },
    {
      id: 2,
      name: 'Professional',
      description: 'Ideal for growing businesses needing more features',
      price_monthly: 5000000,
      price_yearly: 50000000,
      features: ['Up to 10 Pages', 'Custom Design', 'CMS Integration', 'Advanced SEO', '3 Months Support', 'Analytics Dashboard'],
      not_included: ['E-commerce', 'Mobile App'],
      is_popular: true,
      icon: 'Sparkles',
    },
    {
      id: 3,
      name: 'Enterprise',
      description: 'Complete solution for large-scale businesses',
      price_monthly: 10000000,
      price_yearly: 100000000,
      features: ['Unlimited Pages', 'Premium Design', 'Full CMS', 'E-commerce Ready', '12 Months Support', 'Priority Support', 'Custom Integrations'],
      not_included: [],
      is_popular: false,
      icon: 'Crown',
    },
  ];

  const displayPackages = packages.length > 0 ? packages : defaultPackages;

  const getIcon = (iconName) => {
    const icons = { Zap, Sparkles, Crown };
    const Icon = icons[iconName] || Sparkles;
    return <Icon className="w-6 h-6" />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a0a] dark:to-dark-bg transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 font-semibold text-sm"
          >
            {t('pricing.badge')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('pricing.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">{t('pricing.titleHighlight')}</span>
          </h2>
          <p className="text-slate-700 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('pricing.subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              {t('pricing.monthly')}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-primary-500 rounded-full shadow-lg"
                animate={{ left: billingCycle === 'monthly' ? '4px' : '32px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Yearly
              <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {displayPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id || index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className={`relative bg-white dark:bg-dark-card rounded-3xl p-8 border ${pkg.is_popular
                  ? 'border-primary-500 shadow-2xl shadow-primary-500/20'
                  : 'border-slate-200 dark:border-gray-800 shadow-lg'
                  } transition-all duration-500`}
              >
                {/* Popular Badge */}
                {pkg.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${pkg.is_popular
                  ? 'bg-gradient-to-br from-primary-500 to-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                  {getIcon(pkg.icon)}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{pkg.name}</h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm mb-6">{pkg.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {formatPrice(billingCycle === 'monthly' ? pkg.price_monthly : pkg.price_yearly)}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    /{billingCycle === 'monthly' ? 'project' : 'year'}
                  </span>
                </div>

                {/* CTA Button */}
                <a
                  href="#contact"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all mb-8 ${pkg.is_popular
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg hover:shadow-primary-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  Get Started <ArrowRight size={18} />
                </a>

                {/* Features */}
                <div className="space-y-3">
                  {(pkg.features || []).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check size={12} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-700 dark:text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  {(pkg.not_included || []).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 opacity-50">
                      <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <X size={12} className="text-gray-400" />
                      </div>
                      <span className="text-gray-400 text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Custom Quote CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-700 dark:text-gray-400 mb-4">
            Need a custom solution? We've got you covered.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold rounded-full hover:bg-primary-500 hover:text-white transition-all"
          >
            Request Custom Quote
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
