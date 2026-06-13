import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { User, Camera, Mail, Phone, Briefcase, Award, Loader2, Save, User as UserIcon } from 'lucide-react';
import { updateMe, getMe } from '../services/userService';
import { updateDoctorProfile } from '../services/doctorService';
import { useToast } from '../components/ui/use-toast';

const ProfilePage: React.FC = () => {
  const { user, login } = useAuth(); // We'll reuse login to update the local user state
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    experience: 0,
    specialization: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fullUser = await getMe();
        setFormData({
          name: fullUser.name || '',
          email: fullUser.email || '',
          phone: fullUser.phone || '',
          avatar: fullUser.avatar || '',
          bio: (fullUser as any).bio || '',
          experience: (fullUser as any).experience || 0,
          specialization: (fullUser as any).specialization || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Update basic user info
      await updateMe({
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar
      });

      // 2. If doctor, update doctor profile
      if (user?.role === 'doctor') {
        await updateDoctorProfile({
          bio: formData.bio,
          experience: Number(formData.experience),
          specialization: formData.specialization
        });
      }

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      
      // Optionally refresh the whole page or state
      window.location.reload();
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500">Manage your profile information and personalization preferences.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <Card className="border-0 shadow-sm bg-white overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
            <CardContent className="relative pt-0 px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-end gap-6 -mt-12">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden bg-gray-100 shadow-xl">
                    <img 
                      src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0D8ABC&color=fff&size=128`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                  <p className="text-gray-500 capitalize font-medium flex items-center gap-2">
                    <Award size={16} className="text-blue-600" />
                    {user?.role} Profile
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Avatar URL</label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input 
                      name="avatar"
                      placeholder="https://images.unsplash.com/photo-..." 
                      className="pl-10"
                      value={formData.avatar}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">Paste an image URL for your profile picture.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <Input name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input value={formData.email} disabled className="bg-gray-50 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                      <Input name="phone" className="pl-10" value={formData.phone} onChange={handleChange} placeholder="0911..." />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {user?.role === 'doctor' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase size={18} className="text-blue-600" />
                      Professional Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Specialization</label>
                        <Input name="specialization" value={formData.specialization} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Years of Experience</label>
                        <Input type="number" name="experience" value={formData.experience} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Professional Bio</label>
                      <textarea 
                        name="bio"
                        className="w-full min-h-[120px] rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Tell patients about your clinical background and approach..."
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              <Card className="bg-blue-50/50 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-base">Save Changes</CardTitle>
                  <CardDescription>Ensure your information is up to date for better communication.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" /> Update Profile</>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" type="button" onClick={() => window.location.reload()}>
                    Discard
                  </Button>
                </CardContent>
              </Card>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs flex gap-3">
                <div className="p-2 bg-amber-100 rounded-lg h-fit">
                  <UserIcon size={16} />
                </div>
                <p>
                  <strong>Note:</strong> Your specialization and bio will be visible to patients during the appointment booking process.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProfilePage;
