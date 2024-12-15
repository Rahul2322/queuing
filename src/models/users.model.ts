import mongoose, { Document, Schema } from "mongoose";

interface IAddress {
  city: string;
  state: string;
  country: string;
  street: string;
}

export interface IItems extends Document {
  id: string;
  gender: string;
  name: string;
  address: IAddress;
  email: string;
  age: string;
  picture: string;
  createdAt: Date;
}

const AddressSchema = new Schema({
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  street: {
    type: String,
  },
});

const UserSchema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  gender: {
    type: String,
  },
  name: {
    type: String,
  },
  address: AddressSchema,
  email: {
    type: String,
  },
  age: {
    type: String,
  },
  picture: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


export const User = mongoose.model<IItems>('User',UserSchema)

