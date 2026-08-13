import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('')
    setIsLoading(true)
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #e0f2fe 100%)',
    }}>
      <div style={{
        maxWidth: '350px',
        width: '100%',
        background: 'linear-gradient(0deg, rgb(255,255,255) 0%, rgb(244,247,251) 100%)',
        borderRadius: '40px',
        padding: '25px 35px',
        border: '5px solid rgb(255,255,255)',
        boxShadow: 'rgba(133,189,215,0.88) 0px 30px 30px -20px',
        margin: '20px',
      }}>

        {/* Heading */}
        <div style={{
          textAlign: 'center',
          fontWeight: 900,
          fontSize: '30px',
          color: 'rgb(16,137,211)',
        }}>
          Sign In
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '13px',
            textAlign: 'center',
            fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        {/* Demo Credentials Quick Fill */}
        <div style={{ marginTop: '16px', padding: '12px 14px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
            ⚡ Quick Demo Accounts
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => { setEmail('admin@novacare.com'); setPassword('Password123!'); }}
              style={{ fontSize: '11px', fontWeight: 600, padding: '5px 10px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => { setEmail('dr.abebe@novacare.com'); setPassword('Password123!'); }}
              style={{ fontSize: '11px', fontWeight: 600, padding: '5px 10px', borderRadius: '10px', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => { setEmail('kebede.t@gmail.com'); setPassword('Password123!'); }}
              style={{ fontSize: '11px', fontWeight: 600, padding: '5px 10px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              Patient
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input
            required
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              background: 'white',
              border: '2px solid transparent',
              padding: '15px 20px',
              borderRadius: '20px',
              marginTop: '15px',
              boxShadow: '#cff0ff 0px 10px 10px -5px',
              outline: 'none',
              fontSize: '14px',
              color: '#374151',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#12B1D1'}
            onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
          />

          <input
            required
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              background: 'white',
              border: '2px solid transparent',
              padding: '15px 20px',
              borderRadius: '20px',
              marginTop: '15px',
              boxShadow: '#cff0ff 0px 10px 10px -5px',
              outline: 'none',
              fontSize: '14px',
              color: '#374151',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#12B1D1'}
            onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
          />

          <span style={{ display: 'block', marginTop: '10px', marginLeft: '10px' }}>
            <a href="#" style={{ fontSize: '11px', color: '#0099ff', textDecoration: 'none' }}>
              Forgot Password ?
            </a>
          </span>

          <LoginButton isLoading={isLoading} />
        </form>

        {/* Social Sign In */}
        <div style={{ marginTop: '25px' }}>
          <span style={{ display: 'block', textAlign: 'center', fontSize: '10px', color: 'rgb(170,170,170)' }}>
            Or Sign in with
          </span>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '5px' }}>
            {/* Google */}
            <SocialButton label="Google">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512" fill="white">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            </SocialButton>

            {/* Apple */}
            <SocialButton label="Apple">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" fill="white">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
            </SocialButton>

            {/* X / Twitter */}
            <SocialButton label="X">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="white">
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
            </SocialButton>
          </div>
        </div>

        {/* Agreement */}
        <span style={{ display: 'block', textAlign: 'center', marginTop: '15px' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#0099ff', fontSize: '9px' }}>
            Learn user licence agreement
          </a>
        </span>

        {/* Register Link */}
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#0099ff', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function LoginButton({ isLoading }: { isLoading: boolean }) {
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(false);

  return (
    <button
      type="submit"
      disabled={isLoading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'block',
        width: '100%',
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, rgb(16,137,211) 0%, rgb(18,177,209) 100%)',
        color: 'white',
        paddingBlock: '15px',
        margin: '20px auto 0',
        borderRadius: '20px',
        boxShadow: active
          ? 'rgba(133,189,215,0.88) 0px 15px 10px -10px'
          : hovered
          ? 'rgba(133,189,215,0.88) 0px 23px 10px -20px'
          : 'rgba(133,189,215,0.88) 0px 20px 10px -15px',
        border: 'none',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.75 : 1,
        transform: active ? 'scale(0.95)' : hovered ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out',
        fontSize: '15px',
      }}
    >
      {isLoading ? 'Signing in...' : 'Sign In'}
    </button>
  );
}

function SocialButton({ children, label }: { children: React.ReactNode; label: string }) {
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(false);

  return (
    <button
      type="button"
      aria-label={`Sign in with ${label}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        background: 'linear-gradient(45deg, rgb(0,0,0) 0%, rgb(112,112,112) 100%)',
        border: '5px solid white',
        padding: '5px',
        borderRadius: '50%',
        width: '40px',
        aspectRatio: '1',
        display: 'grid',
        placeContent: 'center',
        boxShadow: 'rgba(133,189,215,0.88) 0px 12px 10px -8px',
        cursor: 'pointer',
        transform: active ? 'scale(0.9)' : hovered ? 'scale(1.2)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {children}
    </button>
  );
}

export default LoginComponent;