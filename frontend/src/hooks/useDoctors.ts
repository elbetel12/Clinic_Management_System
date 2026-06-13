import { useEffect, useState } from "react";
import { Doctor } from "../types";
import { getDoctors } from "../services/doctorService";


export const useDoctors = () => {
    const [doctors,setDoctors] = useState<Doctor[]>([])
    const [loading,setLoading] = useState(true)
    const [error,setError] =useState<string|null>(null)

    const fetchDoctors = async () =>{
        setLoading(true)
        try {
            const response = await getDoctors();
            setDoctors(response)
            setError(null)
        } catch (error:any) {
            setError(error.message || "An unexpected error occurred")
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchDoctors();
    },[])

    return{doctors,loading,error,fetchDoctors}
}