import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { RegisterInput } from '../../types';


function RegisterComponent() {
  const [formData,setFormData] = useState<Omit<RegisterInput,'role'>>({
    name:'',
    email:'',
    phone:'',
    password:'',  
  });

  const [isLoading,setIsLoading] = useState(false);

  const [error,setError] = useState('')
  const {register} = useAuth();
  const navigate = useNavigate()


  const handleSubmit = async(e:any) =>{
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await register(formData)
      console.log(formData);
      alert("Registration successful")
      navigate('/login')
    } catch (error:any) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>{
    setFormData({
        ...formData,
        [e.target.name]:e.target.value
    })
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join NovaCare Clinic to manage your health journey</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                <Input id="name" name="name" autoComplete="name" placeholder="John Doe" onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
                <Input id="phone" name="phone" autoComplete="tel" placeholder="0911..." onChange={handleChange} required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="john@example.com" onChange={handleChange} required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="••••••••" onChange={handleChange} required />
            </div>
            {/* <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">I am a...</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="patient">Patient</option>
                <option value="admin">Admin / Staff</option>
              </select>
            </div> */}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button 
              type="submit" 
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md shadow-indigo-100"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>

  );
}

export default RegisterComponent