import { useState } from 'react';
import Head from 'next/head';
import PremiumFeatures from '../components/PremiumFeatures';

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const plans = {
    monthly: {
      price: '$4.99',
      period: 'month',
      savings: ''
    },
    annual: {
      price: '$39.99',
      period: 'year',
      savings: 'Save 33%'
    }
  };

  const handleSubscribe = (plan) => {
    setIsProcessing(true);
    
    // Simulating API call for subscription
    setTimeout(() => {
      setIsProcessing(false);
      alert(`This would initiate the payment process for the ${plan} plan. For a real implementation, you would integrate with a payment provider like Stripe.`);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Premium Subscription | NatureID</title>
        <meta name="description" content="Upgrade to Premium for advanced plant and animal identification features" />
      </Head>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-green-800">Upgrade to Premium</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock advanced identification features, detailed species information, and unlimited history
          </p>
        </div>

        <div className="mb-10 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-full inline-flex">
                <button
                  className={`px-6 py-2 rounded-full text-sm font-medium ${
                    selectedPlan === 'monthly' ? 'bg-green-600 text-white' : 'text-gray-700'
                  }`}
                  onClick={() => setSelectedPlan('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-6 py-2 rounded-full text-sm font-medium ${
                    selectedPlan === 'annual' ? 'bg-green-600 text-white' : 'text-gray-700'
                  }`}
                  onClick={() => setSelectedPlan('annual')}
                >
                  Annual
                </button>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="flex justify-center items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">{plans[selectedPlan].price}</span>
                <span className="text-xl text-gray-500 ml-1">/{plans[selectedPlan].period}</span>
              </div>
              {plans[selectedPlan].savings && (
                <p className="mt-2 text-green-600 font-medium">{plans[selectedPlan].savings}</p>
              )}
            </div>

            <div className="mb-8">
              <button
                className={`w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors ${
                  isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
                onClick={() => handleSubscribe(selectedPlan)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Subscribe Now`
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-2">Cancel anytime. No commitment required.</p>
            </div>

            <PremiumFeatures />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">How accurate is the identification?</h3>
              <p className="mt-2 text-gray-600">Our AI-powered identification is highly accurate for most common species. Premium users get access to our most advanced models for even better accuracy.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Can I use the app offline?</h3>
              <p className="mt-2 text-gray-600">Premium subscribers can download limited offline identification capabilities for common species when internet connectivity is unavailable.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">How do I cancel my subscription?</h3>
              <p className="mt-2 text-gray-600">You can cancel your subscription anytime from your account settings. You'll continue to have premium access until the end of your billing period.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-600">We accept all major credit cards, PayPal, and Apple Pay/Google Pay on compatible devices.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
