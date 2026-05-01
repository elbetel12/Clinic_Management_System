import mongoose from 'mongoose';

const doctorScema = new mongoose.Schema({   
    name:{
        type:String,
        required:[true,'Name is required'],
         trim:true,
         minlength:2,
         maxlength:50,
    },
    specialization:{
        type:String,
        required:[true,'Specialization is required'],
}
},
{
    timestamps:true
    }
)

const Doctor = mongoose.model('Doctor',doctorScema);

export default Doctor;