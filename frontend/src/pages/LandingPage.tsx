import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Stethoscope, 
  Calendar, 
  Search, 
  UserRound, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  HeartPulse,
  Baby,
  Brain,
  Bone,
  Bell
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/30 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200">
                <Stethoscope className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
                NovaCare Clinic
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-sky-500 font-medium transition-colors">Services</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-sky-500 font-medium transition-colors">How it Works</a>
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-100">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-sky-100/50 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Activity className="w-4 h-4" />
            <span>Trusted by 10,000+ patients</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-800 mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Healthcare Designed for <br />
            <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Modern Living</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Skip the waiting room. Connect with top-rated specialists, book appointments 
            instantly, and manage your health journey—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
            <Link to="/book">
              <Button size="lg" className="h-14 px-8 text-lg bg-sky-500 hover:bg-sky-600 rounded-full shadow-xl shadow-sky-200 group">
                Book Now 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-slate-200 hover:bg-slate-50">
              View Our Doctors
            </Button>
          </div>

          {/* Hero Image */}
          <div className="mt-20 relative mx-auto max-w-5xl animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="relative rounded-3xl overflow-hidden glass p-4 group">
              <div className="aspect-[16/9] rounded-2xl flex items-center justify-center relative overflow-hidden bg-white/60">
                <img 
                  src="/healthcare_hero_illustration.png" 
                  alt="Modern Healthcare" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
                
                {/* Floating Elements */}
                <div className="absolute top-10 left-10 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500">Security</p>
                    <p className="text-sm font-bold text-slate-800">100% HIPAA Compliant</p>
                  </div>
                </div>

                <div className="absolute bottom-10 right-10 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-500">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500">Response Time</p>
                    <p className="text-sm font-bold text-slate-800">&lt; 15 Mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How it Works</h2>
            <p className="text-slate-600">Getting expert care is simple and fast</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Connecting Lines (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 border-t-2 border-dashed border-sky-100 -translate-y-1/2 -z-0" />

            {[
              { 
                icon: Search, 
                title: 'Search', 
                desc: 'Find the right specialist based on your symptoms or needs.',
                color: 'bg-sky-50 text-sky-500'
              },
              { 
                icon: UserRound, 
                title: 'Choose', 
                desc: 'Browse verified profiles, ratings, and real patient feedback.',
                color: 'bg-sky-50 text-sky-500'
              },
              { 
                icon: Calendar, 
                title: 'Book', 
                desc: 'Select a time that works for you and get instant confirmation.',
                color: 'bg-purple-50 text-purple-600'
              },
              {
                icon:Bell,
                title:'Get Reminded',
                desc:'Receive instant confirmation and reminders before your appointment.',
                color:'bg-green-50 text-green-600'
              }
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-white p-8 rounded-3xl border border-slate-100 hover:border-sky-200 hover:shadow-xl hover:shadow-blue-50 transition-all group">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Services</h2>
              <p className="text-slate-600 max-w-xl">We provide comprehensive healthcare solutions tailored to your unique requirements.</p>
            </div>
            <Button variant="outline" className="rounded-full">View All Services</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Activity, name: 'General Checkup', count: '12 Doctors' },
              { icon: Baby, name: 'Pediatrics', count: '8 Doctors' },
              { icon: Brain, name: 'Neurology', count: '5 Doctors' },
              { icon: Bone, name: 'Orthopedics', count: '7 Doctors' },
              { icon: HeartPulse, name: 'Cardiology', count: '6 Doctors' },
              { icon: Stethoscope, name: 'Dermatology', count: '4 Doctors' },
              { icon: Activity, name: 'Emergency', count: '24/7 Service' },
              { icon: Search, name: 'Diagnostics', count: 'Modern Lab' },
            ].map((service, i) => (
              <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 hover:border-blue-500/30 hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{service.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{service.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-sky-500 rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-sky-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 relative z-10">
              Ready to prioritize <br className="hidden md:block" /> your health?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of satisfied patients who trust NovaCare Clinic for their healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link to="/register">
                <Button size="lg" className="h-14 px-10 bg-white text-sky-500 hover:bg-slate-100 rounded-full font-bold">
                  Get Started for Free
                </Button>
              </Link>
              <Link to="/book">
                <Button size="lg" className="h-14 px-10 bg-sky-600 text-white hover:bg-sky-700 rounded-full border-none">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-800">NovaCare Clinic</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500 font-medium">
              <a href="#" className="hover:text-sky-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Contact Us</a>
            </div>
            <p className="text-sm text-slate-400">
              © 2026 NovaCare Clinic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
