import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { MongoClient, ServerApiVersion } from "mongodb"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors({
    origin: process.env.CROS_ORIGIN,
    credentials: true
}))





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
        // const jobCollection = db.collection("jobs");

        // const user = {
        //     name: "rahat",
        //     email: "rahat@gmail.com",
        //     age: 28
        // }

        // userCollection.insertOne(user)




        // %%%%%%%%% CRUD operation %%%%%%%%%
        // add new user to users collection (CRUD | create | post | insertOne)
        // app.post("/add-user", async (req, res) => {
        //     try {
        //         const newUser = req.body;
        //         const result = await userCollection.insertOne(newUser)
        //         const user = await userCollection.findOne({ _id: result.insertedId })
        //         if (user?.password) delete user.password
        //         return res.status(201).json({
        //             success: true,
        //             message: "user created successfully.",
        //             user

        //         })
        //     } catch (error) {
        //         console.error(error)
        //         return res.status(500).json({
        //             success: false,
        //             message: "failed to add user",
        //             error: error.message
        //         })
        //     }
        // })

        // ###################################

        // add multiple user to users collection (CRUD | create | post | insertMany)
        // app.post("/add-users", async (req, res) => {
        //     try {
        //         // Expect an array of users in the request body
        //         const newUsers = req.body;

        //         // Check that the body is an array
        //         if (!Array.isArray(newUsers) || newUsers.length === 0) {
        //             return res.status(400).json({
        //                 success: false,
        //                 message: "Please provide an array of users."
        //             });
        //         }

        //         // Insert all users at once
        //         const result = await userCollection.insertMany(newUsers);

        //         // Attach inserted _id values to the users
        //         const savedUsers = newUsers.map((user, index) => ({
        //             ...user,
        //             _id: result.insertedIds[index],
        //         }));

        //         // Remove passwords from each user before sending back
        //         const usersWithoutPassword = savedUsers.map(({ password, ...rest }) => rest);

        //         return res.status(201).json({
        //             success: true,
        //             message: "Users added successfully.",
        //             insertedCount: result.insertedCount,
        //             users: usersWithoutPassword,
        //         });
        //     } catch (error) {
        //         console.error(error);
        //         res.status(500).json({
        //             success: false,
        //             message: "Failed to add users.",
        //             error: error.message
        //         });
        //     }
        // });


        // ###################################

        // find all user from  users collection (CRUD | read | get | find)
        app.get("/get-users", async (req, res) => {
            try {
                const users = await userCollection.find().toArray();
                // const totalUser = users.length
                return res.status(200).json({
                    success: true,
                    message: "all user fild successfully.",
                    totalUser: users.length,
                    users,
                })
            } catch (error) {
                console.error(error)
                return res.status(500).json({
                    success: false,
                    message: "faild to get all users.",
                    error: error.message
                })
            }
        })






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