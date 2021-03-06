const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

// ================================
//       Connecting with Mongo
// ================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.25l91.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try {
        await client.connect();

        // ==== Setting api for Services ====
        const serviceCollection = client
            .db("Assign-11-Electro-Vally")
            .collection("services");
        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // ==== Setting api for Inventories ====
        const inventoriesCollection = client
            .db("Assign-11-Electro-Vally")
            .collection("inventories");
        app.get("/inventories", async (req, res) => {
            const query = {};
            const cursor = inventoriesCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        });

        // ==== Setting api for Inventories -> Limited Items ====
        app.get("/inventoryCount", async (req, res) => {
            const query = {};
            const cursor = inventoriesCollection.find(query).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        });

        // ==== Setting api for Inventories -> Signle Item ====
        app.get("/inventories/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await inventoriesCollection.findOne(query);
            res.send(inventory);
        });

        // ==== Setting api for finding My_Item ====
        app.get("/myitems", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = inventoriesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // ==== Setting api for Company Info ====
        const companyInfoCollection = client
            .db("Assign-11-Electro-Vally")
            .collection("company-info");
        app.get("/companyinfo", async (req, res) => {
            const query = {};
            const cursor = companyInfoCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // ==== Setting api for Blogs ====
        const blogsCollection = client
            .db("Assign-11-Electro-Vally")
            .collection("Blog-Data");
        app.get("/blogs", async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // -------- Setting Post API to Add Inventory -------
        app.post("/inventories", async (req, res) => {
            const newInventory = req.body;
            const result = await inventoriesCollection.insertOne(newInventory);
            res.send(result);
        });

        // +++++++++ Setting Delete API +++++++++++
        app.delete("/inventories/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = inventoriesCollection.deleteOne(query);
            res.send(result);
        });

        // ######### Setting Update API #########
        app.put("/inventories/:id", async (req, res) => {
            const id = req.params.id;
            const updatedInventory = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedInventory.quantity,
                },
            };
            const result = await inventoriesCollection.updateOne(
                filter,
                updatedDoc,
                options
            );
            res.send(result);
        });
    } finally {
        // to close connection
    }
};
// calling
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("running server");
});

// running server ===
app.listen(port, () => {
    console.log(`listening: ${port}`);
});
