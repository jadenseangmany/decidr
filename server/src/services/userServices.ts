//imports everything as a file turns it into a object
import * as Auth from "../utils/auth";
import User from '../models/user';

const tempUserDB = [
  new User("Terry", "somerandomhashedpassword", "terryguan@gmail.com")
];

export function findUserByUsername(name:string){
  return tempUserDB.find(u => u.username == name);
}

export function findUserByEmail(email:string){
  return tempUserDB.find(u => u.email == email);
}

export async function createNewUser(name:string,password:string,email:string){
  const hashedPassword = await Auth.hashPassword(password);
  const user = new User(name,hashedPassword,email);
  tempUserDB.push(user);
}

export async function logUserIn(name:string,password:string){
  const user = findUserByUsername(name);
  if(!user){
    return undefined;
  }
  const passwordMatch = await Auth.verifyPassword(password, user.getPassword());

  if(!passwordMatch){
    return undefined;
  }
  return user;
}