const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://shuvosustcse:Fi5AQRXMcOTy9aLI@cluster0.ezfvwv5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database = client.db("usersDB");
    const usersCollection = database.collection("users");
    // read
    app.get('/users', async(req, res)=>{
      // read operation
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      try {
        const user = req.body;
        console.log('New user: ', user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ error: "Error inserting user" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

(async () => {
  await run();
  app.get('/', (req, res) => {
    res.send('simple crud is running');
  });

  app.listen(port, () => {
    console.log(`simple crud is running on port ${port}`);
  });
})().catch(console.dir);
