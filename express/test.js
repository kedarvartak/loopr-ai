const { MongoClient } = require("mongodb");

const uri = ""; 
const client = new MongoClient(uri);

async function checkReplicaSetStatus() {
  try {
    await client.connect();
    const adminDb = client.db().admin();
    const status = await adminDb.command({ replSetGetStatus: 1 });
    console.log(JSON.stringify(status, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await client.close();
  }
}

checkReplicaSetStatus();
