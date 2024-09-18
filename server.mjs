import express from 'express';
import admin from 'firebase-admin';
import fs from 'fs';

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));
const PORT = process.env.PORT || 8080;
const text = fs.readFileSync('./key.json', 'utf-8')
const credentials = JSON.parse(text);
admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

app.get("/getAll", async (req, res)=>{
    try{

        const usersRef=db.collection("users");
        const response= await usersRef.get();
        let responseArr=[];
        response.forEach(doc=>{
            responseArr.push(doc.data());
        });

        res.status(200).json(responseArr)
    }catch(error){
        console.log(error);
    }
});

app.get("/get/:id", async (req, res)=>{
    try{
        const usersRef=db.collection("users").doc(req.params.id);
        const response= await usersRef.get();
        res.status(200).send(response.data());
    }catch(error){
        console.log(error)
        
    }

})

app.post("/create", async (req, res)=>{
    try{
        
        const userJson= {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };

        const response=await db.collection("users").add(userJson);
        res.status(201).send(response);
    }catch(error){
        res.send("error to create an user")
    }
})

app.post("/update", async (req, res)=>{
    try{
        const id=req.body.id;
        const newFirstName="Anything";
        const userJson= {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };

        const response=await db.collection("users").doc(id).update({
            firstName: newFirstName,
        });
        res.status(200).send(response);
    }catch(error){
        res.send("error to create an user")
    }
})

app.delete("/delete/:id", async (req, res)=>{
    try{
        const response=await db.collection("users").doc(req.params.id).delete();
        res.status(200).json({ message: 'The element was eliminated' })
    }catch(error){
        res.send(error);
    }
})
const db= admin.firestore()
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
