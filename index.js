import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { MongoClient, ServerApiVersion } from "mongodb"

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())





const uri = `${process.env.MONGODB_URI}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //create db and collection 
        const db = client.db("myDatabase")
        const userCollection = db.collection("users");
        const jobCollection = db.collection("jobs");

        const user = {
            name: "rahat",
            email: "rahat@gmail.com",
            age: 28
        }

        userCollection.insertOne(user)


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    return res.send("server is cooking...")
})

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);

})