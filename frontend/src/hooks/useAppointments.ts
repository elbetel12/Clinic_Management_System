import { useCallback, useEffect, useState } from "react"
import { useAuth } from "./useAuth"
import { Appointment, CreateAppointmentInput } from "@/types"
import * as appointmentService from '../services/appointmentService';

export const useAppointments = () =>{
  const {user} = useAuth()
  const [appointments,setAppointments] = useState<Appointment[]>()
  const [isLoading,setIsLoading] = useState(true)
  const [error,setError] = useState<string|null>(null)

  
  // We use useCallback so this function doesn't change on every render
  // which prevents infinite loops if passed to useEffect
  const fetchAppointments = useCallback(async () =>{
    if(!user) return
    try {
        setIsLoading(true)
        if(user.role == "admin"){
            const response = await appointmentService.getAllAppointments();
            setAppointments(response)
            setError(null)
        }else if(user.role == "doctor"){
            const response = await appointmentService.getAppointmentsByDoctor(user.id)
            setAppointments(response)
            setError(null)
        }else{
            const response = await appointmentService.getAppointmentsByPatient(user.id)
            setAppointments(response)
            setError(null)
        }
    } catch (error:any) {
        setError(error.message || "An unexpected error occurred")
    } finally {
        setIsLoading(false)
    }
    
  },[user])

  
  // Automatically fetch when the component using this hook mounts, or when user changes
  useEffect(() =>{
    fetchAppointments()
  },[fetchAppointments])

  const bookAppointment = async(data:CreateAppointmentInput) =>{
    try {
      setIsLoading(true)
      const response = await appointmentService.createAppointment(data)
      setAppointments((prev) => [...(prev || []).concat(response)])
    } catch (error:any) {
        setError(error.message || "An unexpected error occurred")
    } finally {
        setIsLoading(false)
    }
  }

  return {
    appointments,
    isLoading,
    error,
    refresh:fetchAppointments,
    bookAppointment
  }
 }