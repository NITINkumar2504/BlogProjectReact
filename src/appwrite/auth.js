import conf from "../conf/conf";
import {Client, Account, ID} from 'appwrite';

export class AuthService {
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}){
        try{
            const userAccount = await this.account.create(ID.unique(), email,password,name);
            if(userAccount){
                // call another method
                return this.login({email, password});  
            }
            else{
                return userAccount;
            }
        }
        catch(error){
            throw error;
        }
    }

    async login({email,password}){
        try{
           return await this.account.createEmailPasswordSession(email, password);
        }
        catch(error){
            throw error;
        }
    }

    async getCurrentUser(){
        try{
            return await this.account.get();   // get currently logged in user data as JSON object
        }
        catch(error){
            console.log("not logged in")
             // when no user data is available, can also if else block in try block
            return null; 
        }   
    }

    async logout(){
        try{
            await this.account.deleteSession("current");
        }
        catch(error){
            console.log("Appwrite service :: logout :: error ",error);
        }
    }
}

const authService  = new AuthService();

export default authService;



