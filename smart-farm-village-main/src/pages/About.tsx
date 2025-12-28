import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Users, Target, Zap, TrendingUp, Award, ArrowRight, ChevronDown } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const stats = [
    { number: '50K+', label: 'Active Farmers', icon: Users },
    { number: '100K+', label: 'Products Listed', icon: Leaf },
    { number: '₹10Cr+', label: 'GMV', icon: TrendingUp },
    { number: '98%', label: 'Customer Satisfaction', icon: Award }
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'Empower Indian farmers with direct market access and fair pricing for their agricultural products.'
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Promote sustainable farming practices and reduce supply chain waste through direct farmer-to-buyer connections.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leverage technology to modernize agriculture and create transparent, efficient markets for all participants.'
    }
  ];

  const team = [
    {
      name: 'Raj Kumar',
      role: 'Founder & CEO',
      image: '👨‍💼',
      bio: '15+ years in agricultural tech'
    },
    {
      name: 'Priya Singh',
      role: 'Head of Operations',
      image: '👩‍💼',
      bio: 'Supply chain expert'
    },
    {
      name: 'Amit Patel',
      role: 'Tech Lead',
      image: '👨‍💻',
      bio: 'Full-stack developer & innovator'
    },
    {
      name: 'Neha Sharma',
      role: 'Customer Success',
      image: '👩‍💼',
      bio: 'Dedicated to farmer welfare'
    }
  ];

  const features = [
    {
      title: 'Direct Connections',
      description: 'Connect farmers directly with buyers, eliminating middlemen and ensuring better prices.',
      icon: '🤝'
    },
    {
      title: 'Fair Pricing',
      description: 'Transparent pricing mechanism that ensures farmers get the best value for their products.',
      icon: '💰'
    },
    {
      title: 'Quality Assurance',
      description: 'Strict quality checks and verification processes to maintain product standards.',
      icon: '✅'
    },
    {
      title: 'Logistics Support',
      description: 'Integrated logistics for seamless product delivery across regions.',
      icon: '🚚'
    },
    {
      title: 'Knowledge Hub',
      description: 'Educational resources and expert advice for better farming practices.',
      icon: '📚'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all queries and issues.',
      icon: '💬'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Yadav',
      role: 'Vegetable Farmer',
      text: 'Smart Farm Village helped me increase my income by 40%. The direct connection with buyers is a game-changer!',
      rating: 5,
      image: '👨‍🌾'
    },
    {
      name: 'Meera Devi',
      role: 'Organic Farmer',
      text: 'Finally, a platform that values our hard work. The transparency and fair pricing is exactly what we needed.',
      rating: 5,
      image: '👩‍🌾'
    },
    {
      name: 'Arjun Singh',
      role: 'Bulk Buyer',
      text: 'Get fresh, quality products directly from farmers at competitive prices. Highly recommend!',
      rating: 5,
      image: '👨‍💼'
    }
  ];

  const faqs = [
    {
      question: 'How do I register as a farmer on Smart Farm Village?',
      answer: 'Click the "Register as Seller" button on the homepage, fill in your details, and verify your account. You\'ll then be able to list your products.'
    },
    {
      question: 'What types of products can I sell?',
      answer: 'We support all agricultural products including vegetables, fruits, grains, dairy products, fertilizers, seeds, and farming equipment.'
    },
    {
      question: 'How are payments processed?',
      answer: 'We support multiple payment methods including Razorpay (UPI), Stripe (cards), and cash on delivery for your convenience.'
    },
    {
      question: 'What is the commission structure?',
      answer: 'We charge a competitive 5% commission on successful sales, with no hidden fees. Withdrawal is instant after order completion.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery times vary by location but typically range from 2-5 days. You\'ll have real-time tracking for all orders.'
    },
    {
      question: 'Is there a minimum order value?',
      answer: 'No minimum order value required! Buy or sell any quantity of products.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-green-100 rounded-full">
            <span className="text-green-700 font-semibold text-sm">About Smart Farm Village</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Transforming Agriculture, <span className="text-green-600">One Farm at a Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Connecting farmers directly with buyers, eliminating middlemen, and ensuring fair prices for everyone.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up delay-200">
            <button
              onClick={() => navigate('/buyer-register')}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold"
            >
              Join as Buyer <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/seller-register')}
              className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold"
            >
              Join as Seller <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center transform hover:scale-110 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-green-600 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Icon className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group hover:bg-gradient-to-br hover:from-green-50 hover:to-white animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-7xl mb-4 group-hover:scale-125 transition-transform duration-300">{member.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-green-600 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-green-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-500 transition-colors duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between bg-white hover:bg-green-50 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-900 text-left">{faq.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`text-green-600 transition-transform duration-300 flex-shrink-0 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="p-6 bg-green-50 border-t border-gray-200 animate-fade-in-up">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join the Agricultural Revolution?</h2>
          <p className="text-xl text-green-100 mb-8">Start your journey with Smart Farm Village today</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/buyer-register')}
              className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2"
            >
              Register as Buyer <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/seller-register')}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2"
            >
              Register as Seller <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
