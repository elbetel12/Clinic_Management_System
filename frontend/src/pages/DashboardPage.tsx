import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppointments } from '../hooks/useAppointments';
import { useDoctors } from '../hooks/useDoctors';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { UserPlus, PlusCircle, Stethoscope, Mail, Calendar } from 'lucide-react';
import AddDoctorModal from '../components/doctors/AddDoctorModal';

const DashboardPage = () => {
  const { user } = useAuth();
  const { appointments, isLoading: isAppointmentsLoading, error: appointmentError } = useAppointments();
  const { doctors, loading: isDoctorsLoading, fetchDoctors } = useDoctors();
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);

  // Helper to color the status badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* 1. Welcome Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-gray-500 mt-1">Here is what is happening at NovaCare Clinic today.</p>
          </div>
          
          <div className="flex gap-3">
            {user?.role === 'admin' && (
              <Button 
                onClick={() => setIsAddDoctorOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 gap-2"
              >
                <UserPlus size={18} />
                Add Doctor
              </Button>
            )}

            {user?.role === 'patient' && (
              <Link to="/book">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 gap-2">
                  <PlusCircle size={18} />
                  Book New Appointment
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {isAppointmentsLoading ? '...' : appointments?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          {user?.role === 'admin' && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total Doctors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {isDoctorsLoading ? '...' : doctors?.length || 0}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 3. Appointment List Section */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-gray-50 bg-white/50 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              {user?.role === 'admin' ? 'Clinic Schedule' : 'Your Appointments'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isAppointmentsLoading ? (
              <div className="p-8 text-center text-gray-500">Loading schedule...</div>
            ) : appointmentError ? (
              <div className="p-8 text-center text-red-500">{appointmentError}</div>
            ) : appointments?.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 mb-4">No appointments found.</p>
                {user?.role === 'patient' && (
                  <Link to="/book">
                    <Button variant="outline">Book your first visit</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">{user?.role === 'patient' ? 'Doctor' : 'Patient'}</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {appointments?.map((apt) => (
                      <tr key={apt._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{apt.time}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">
                          {user?.role === 'patient' ? apt.doctor?.name : apt.patient?.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Doctors List (Admin Only) */}
        {user?.role === 'admin' && (
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-white/50">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope size={18} className="text-indigo-600" />
                Doctors Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isDoctorsLoading && doctors.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Loading medical staff...</div>
              ) : doctors.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No doctors registered yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">Doctor Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Specialization</th>
                        <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {doctors.map((doc) => (
                        <tr key={doc._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{doc.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail size={14} className="text-gray-400" />
                              {doc.email || doc.user?.email || 'No email provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium border border-indigo-100">
                              {doc.specialization}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <AddDoctorModal 
        isOpen={isAddDoctorOpen} 
        onClose={() => setIsAddDoctorOpen(false)}
        onSuccess={() => {
          fetchDoctors(); // Refresh list
          alert("Doctor account created successfully!");
        }}
      />
    </Layout>
  );
};

export default DashboardPage;

