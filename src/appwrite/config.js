import conf from "../conf/conf";
import { Client, ID, Databases, Query, Storage } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;  // or storage

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // post methods / services
    async createPost({title, slug, content, featuredImage, status, userId}){
        try{
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,   // document ID, can use ID.unique() as well  
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        }
        catch(error){
            console.log("Appwrite service :: createPost : error ",error)
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){   // slug (document id)
        try{
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        }
        catch(error){
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try{
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;
        }
        catch(error){
            console.log("Appwrite service :: deletePost :: error ", error);
            return false;
            
        }
    }

    async getPost(slug){
        try{    
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        }
        catch(error){
            console.log("Appwrite service :: getPost :: error ",error);
            return false;   // if no post if found
        }
    }

    // return all posts with active status
    async getPosts(queries = [Query.equal("status","active")]){   // here queries is a default parameter only, a variable 
        try{
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries    // [Query.equal("status",["active"])]    
            )
        }
        catch(error){
            console.log("no posts");
            return false;
        }
    }

    // file methods / services
    async uploadFile(file){
        try{
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        }
        catch(error){
            console.log("Appwrite service :: uploadFile :: error ",error);
            return false;
        }
    }

    async deleteFile(fileId){
        try{
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        }
        catch(error){
            console.log("Appwrite service :: deleteFile :: error ",error);
            return false;
        }
    }

    filePreview(fileId){
        return this.bucket.getFilePreview(   // returns url
            conf.appwriteBucketId,
            fileId
        )
    }

}

const service = new Service();

export default service