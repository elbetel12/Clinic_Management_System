import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '../hooks/useDoctors';
import { useAppointments } from '../hooks/useAppointments';
import Layout from '../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNotification } from '@/hooks/useNotifications';

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const { doctors, loading: loadingDoctors } = useDoctors();
  const { bookAppointment, isLoading: isBooking, error } = useAppointments();
 const {addNotification} = useNotification()
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) return;

    try {
      await bookAppointment({
        doctorId: selectedDoctor,
        date,
        time,
      });
      navigate('/dashboard');
      addNotification("Appointment booked successfully!","success")
    } catch (err:any) {
        const message = err?.response?.data?.message || "Failed to book appointment.";
        addNotification(message,"error");
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Book an Appointment</h1>
          <p className="text-slate-500 mt-2">Choose your preferred doctor and schedule a visit in seconds.</p>
        </div>

        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-sky-500 to-emerald-500" />
          <CardHeader className="pt-8">
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>All fields are required for booking</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg font-medium">
                  {error}
                </div>
              )}

              {/* Doctor Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select Doctor</label>
                <div className="grid grid-cols-1 gap-3">
                  {loadingDoctors ? (
                    <div className="text-slate-400 text-sm animate-pulse">Loading available doctors...</div>
                  ) : (
                    doctors.map((doctor) => (
                      <div 
                        key={doctor._id}
                        onClick={() => setSelectedDoctor(doctor._id)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                          selectedDoctor === doctor._id 
                          ? 'border-blue-600 bg-sky-50/50 ring-2 ring-blue-100' 
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                            <img 
                              src={(doctor as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=f3f4f6&color=4f46e5`} 
                              alt={doctor.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{doctor.name}</div>
                            <div className="text-xs text-sky-500 font-medium uppercase tracking-wider">{doctor.specialization}</div>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedDoctor === doctor._id ? 'border-blue-600 bg-sky-500' : 'border-gray-300'
                        }`}>
                          {selectedDoctor === doctor._id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Preferred Date</label>
                  <Input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} 
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Preferred Time</label>
                  <Input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/50 p-6 mt-6 border-t border-slate-100 flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-[2] h-12 bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg shadow-lg shadow-sky-100"
                disabled={isBooking || !selectedDoctor}
              >
                {isBooking ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default BookAppointmentPage;
