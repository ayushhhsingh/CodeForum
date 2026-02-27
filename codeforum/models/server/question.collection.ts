import { IndexType, Permission } from "node-appwrite"

import {db,questionCollection} from "../name"
import { databases } from "./config"
import { promise } from "zod"


export default async function createQuestionCollection() {
// create collection

await databases.createCollection(db, questionCollection, questionCollection ,[
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
])   
console.log("question created")

await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(db, questionCollection, "content", 1000, true),
    databases.createStringAttribute(db, questionCollection, "authorId", 100, true),
    databases.createStringAttribute(db, questionCollection, "tags", 100, true, undefined, true),
    databases.createStringAttribute(db, questionCollection, "attachmentId", 100, false),    
])
await Promise.all([
    databases.createIndex(db, 
        questionCollection,
         "title",
        IndexType.Fulltext,
        ["title"],
        
        ),
          databases.createIndex(db, 
        questionCollection,
         "Content",
        IndexType.Fulltext,
        ["content"],
        
        ),
        
    
])
}