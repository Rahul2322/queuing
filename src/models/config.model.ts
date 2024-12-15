import mongoose, {Schema} from 'mongoose';


const ConfigSchema = new Schema({
    key:{
        type:String,
        unique:true
    },
    value: Schema.Types.Mixed
})

export const Config = mongoose.model('Config',ConfigSchema)