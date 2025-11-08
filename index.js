import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb"
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
        app.post("/add-user", async (req, res) => {
            try {
                const newUser = req.body;

                // 1️⃣ Check if the email already exists
                const existingUser = await userCollection.findOne({ email: newUser.email });

                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "User already registered.",
                    });
                }

                // 2️⃣ If not, insert the new user
                const result = await userCollection.insertOne(newUser);

                // 3️⃣ Retrieve the inserted user without password
                const user = await userCollection.findOne(
                    { _id: result.insertedId },
                    { projection: { password: 0 } } // hide password field
                );

                // 4️⃣ Send success response
                return res.status(201).json({
                    success: true,
                    message: "User created successfully.",
                    user,
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to add user.",
                    error: error.message,
                });
            }
        });


        // ###################################

        // add multiple user to users collection (CRUD | create | post | insertMany)
        app.post("/add-users", async (req, res) => {
            try {
                // Expect an array of users in the request body
                const newUsers = req.body;

                // Check that the body is an array
                if (!Array.isArray(newUsers) || newUsers.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Please provide an array of users."
                    });
                }

                // Insert all users at once
                const result = await userCollection.insertMany(newUsers);

                // Attach inserted _id values to the users
                const savedUsers = newUsers.map((user, index) => ({
                    ...user,
                    _id: result.insertedIds[index],
                }));

                // Remove passwords from each user before sending back
                const usersWithoutPassword = savedUsers.map(({ password, ...rest }) => rest);

                return res.status(201).json({
                    success: true,
                    message: "Users added successfully.",
                    insertedCount: result.insertedCount,
                    users: usersWithoutPassword,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "Failed to add users.",
                    error: error.message
                });
            }
        });


        // ###################################

        // find all user from  users collection (CRUD | read | get | find)
        // app.get("/get-users", async (req, res) => {
        //     try {
        //         const users = await userCollection.find().toArray();
        //         // const totalUser = users.length
        //         return res.status(200).json({
        //             success: true,
        //             message: "all user fild successfully.",
        //             totalUser: users.length,
        //             users,
        //         })
        //     } catch (error) {
        //         console.error(error)
        //         return res.status(500).json({
        //             success: false,
        //             message: "faild to get all users.",
        //             error: error.message
        //         })
        //     }
        // })

        // ###################################

        // find single by id from  users collection (CRUD | read | get | findOne)
        // app.get("/user/:id", async (req, res) => {
        //     try {
        //         const { id } = req.params

        //         const user = await userCollection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })
        //         if (!user) {
        //             return res.status(400).json({
        //                 success: false,
        //                 message: "user not found."
        //             })
        //         }
        //         // if (user?.password) delete user.password
        //         return res.status(201).json({
        //             success: true,
        //             message: "user fild successfully.",
        //             user

        //         })
        //     } catch (error) {
        //         console.error(error)
        //         return res.status(400).json({
        //             success: false,
        //             message: "faild to find user.",
        //             error: error.message
        //         })
        //     }
        // })

        // ###################################

        // find document by specific condition from  users collection (CRUD | read | get | find)
        // finding admins only
        // app.get("/admins", async (req, res) => {
        //     try {
        //         const admin = await userCollection.find({ role: "admin" }, { projection: { name: 1, email: 1, role: 1 } }).toArray()
        //         console.log(admin);

        //         res.status(200).json({
        //             succeess: true,
        //             message: "find all admins.",
        //             admin
        //         })
        //     } catch (error) {
        //         console.error(error)
        //         res.status(500).json({
        //             success: false,
        //             message: "faild to fetch admins",
        //             error: error.message
        //         })
        //     }
        // })

        // ###################################

        // find document by specific condition from  users collection (CRUD | read | get | find)
        // finding users only
        // app.get("/users", async (req, res) => {
        //     try {
        //         const users = await userCollection.find({ role: "user" }, { projection: { email: 1, name: 1, role: 1 } }).limit(3).toArray()

        //         return res.status(201).json({
        //             succeess: true,
        //             message: "user fetch successfully.",
        //             users
        //         })
        //     } catch (error) {
        //         console.error(error)
        //         res.status(500).json({
        //             succeess: false,
        //             message: "faild to fetch users.",
        //             error: error.message
        //         })
        //     }
        // })
        // ###################################
        // update single document from  users collection (CRUD | update | put/patch | updateOne)
        // update single doc
        // app.put("/update-user/:id", async (req, res) => {
        //     try {
        //         const { id } = req.params;
        //         const userData = req.body;

        //         const filter = { _id: new ObjectId(id) }
        //         const updateInfo = {
        //             $set: {
        //                 ...userData
        //             }
        //         }
        //         const option = { upsert: true }

        //         const result = await userCollection.updateOne(filter, updateInfo, option)
        //         const updatedUser = await userCollection.findOne(filter, { projection: { password: 0 } })
        //         // console.log(user);

        //         res.status(201).json({
        //             success: true,
        //             message: "user updated successfully..",
        //             updatedUser
        //         })

        //     } catch (error) {
        //         console.log(error)
        //         res.status(500).json({
        //             success: false,
        //             message: "user updated failed.",
        //             error: error.message
        //         })
        //     }
        // })

        // ###################################
        // update multiple document from  users collection (CRUD | update | put/patch | updateMany)
        // update multiple docs
        // app.patch("/update-admins-user", async (req, res) => {
        //     try {
        //         const result = await userCollection.updateMany({ role: "admin" }, { $set: { role: "user" } })
        //         console.log(result);


        //         res.status(201).json(
        //             {
        //                 success: true,
        //                 result
        //             }
        //         )
        //     } catch (error) {
        //         console.error(error)
        //         res.status(500).json({
        //             success: false,
        //             message: "faild to update admin to user.",
        //             error: error.message
        //         })
        //     }
        // })

        // ###################################
        // delete single document from  users collection (CRUD | delete | delete | deleteOne)
        // delete single docs
        // app.delete("/delete-user/:id", async (req, res) => {
        //     try {
        //         const { id } = req.params
        //         const deleteUser = await userCollection.deleteOne({ _id: new ObjectId(id) })
        //         return res.status(201).json({
        //             success: true,
        //             message: "user deleted successfully.",
        //             deleteUser
        //         })
        //     } catch (error) {
        //         console.error(error)
        //         return res.status(500).json({
        //             success: false,
        //             message: "failed to delet user",
        //             error: error.message

        //         })
        //     }
        // })


        // ###################################
        // delete multiple finding by specific field document from  users collection (CRUD | delete | delete | deleteOne)
        // delete multiple docs

        // app.delete("/delete-status", async (req, res) => {
        //     try {
        //         const { status } = req.body;
        //         const deletedData = await userCollection.deleteMany({ status: status })
        //         res.status(201).json({
        //             success: true,
        //             message: "deleted successfully.",
        //             deletedData
        //         })
        //     } catch (error) {

        //     }
        // })
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