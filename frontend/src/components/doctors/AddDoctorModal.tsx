import React, { useState } from 'react';
import { CreateDoctorInput } from '../../types';
import { createDoctor } from '../../services/doctorService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { X, UserPlus, Mail, Stethoscope, Lock, Loader2 } from 'lucide-react';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SPECIALIZATIONS = [
  'General Practice',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Orthopedics',
  'Neurology',
  'Gynecology',
  'Psychiatry',
  'Dentistry',
  'Other'
];

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateDoctorInput>({
    name: '',
    email: '',
    specialization: SPECIALIZATIONS[0],
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createDoctor(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({ name: '', email: '', specialization: SPECIALIZATIONS[0], password: '' });
    } catch (err: any) {
      const backendError = err.response?.data;
      if (backendError?.errors && Array.isArray(backendError.errors)) {
        setError(backendError.errors.join(', '));
      } else {
        setError(backendError?.message || 'Failed to create doctor account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <Card className="relative w-full max-w-md shadow-2xl border-0 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-sky-500" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-sky-50 rounded-lg text-sky-500">
                <UserPlus size={20} />
              </div>
              <CardTitle className="text-xl font-bold">Add New Doctor</CardTitle>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create a new medical professional account.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <Input 
                  name="name" 
                  placeholder="Dr. Jane Smith" 
                  className="pl-9"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
                <UserPlus className="absolute left-3 top-2.5 text-slate-400" size={16} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Input 
                  name="email" 
                  type="email"
                  placeholder="jane.smith@novacare.com" 
                  className="pl-9"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Specialization</label>
              <div className="relative">
                <select 
                  name="specialization" 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-9 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  value={formData.specialization}
                  onChange={handleChange}
                  required 
                >
                  {SPECIALIZATIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <Stethoscope className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <div className="absolute right-3 top-3.5 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password (Optional)</label>
              <div className="relative">
                <Input 
                  name="password" 
                  type="password"
                  placeholder="Leave empty for default" 
                  className="pl-9"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
              </div>
              <p className="text-[10px] text-slate-400">Default password is "Doctor@123"</p>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-6 flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-100 h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Doctor Account'
              )}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="w-full text-slate-500"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddDoctorModal;
