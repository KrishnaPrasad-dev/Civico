const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

function readMongoUri() {
  const envPath = path.join(process.cwd(), ".env.local");
  const raw = fs.readFileSync(envPath, "utf8");
  const line = raw
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith("MONGODB_URI="));

  if (!line) {
    throw new Error("MONGODB_URI not found in .env.local");
  }

  return line.split("=").slice(1).join("=").trim();
}

async function main() {
  const uri = readMongoUri();
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db();
  const col = db.collection("civicposts");
  const now = new Date();

  const docs = [
    {
      title: "Public Advisory: Water Supply Maintenance Schedule",
      body: "Water board teams will conduct line maintenance on Sunday between 6:00 AM and 11:00 AM in Ward 12 and Ward 13. Please store required water in advance. Emergency tankers will be available on request.",
      departmentId: "dept-water-001",
      departmentName: "Water Department",
      category: "official_update",
      truthLabel: "advisory",
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Law Update: Waste Disposal Fines Revised",
      body: "As per the updated municipal sanitation rule effective this month, open dumping and roadside waste burning are punishable offenses. Repeat violations now carry higher penalties and mandatory compliance notices.",
      departmentId: "dept-ghmc-001",
      departmentName: "GHMC Enforcement",
      category: "law_update",
      truthLabel: "real",
      createdAt: now,
      updatedAt: now,
    },
    {
      title: "Myth Buster: No Citywide Power Cut This Week",
      body: "A circulating message claiming a 3-day citywide blackout is false. Scheduled maintenance outages, if any, are limited and announced zone-wise on official channels.",
      departmentId: "dept-power-001",
      departmentName: "Electricity Board",
      category: "myth_buster",
      truthLabel: "fake",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const titles = docs.map((d) => d.title);
  const existing = await col
    .find({ title: { $in: titles } }, { projection: { title: 1 } })
    .toArray();
  const existingSet = new Set(existing.map((d) => d.title));

  const toInsert = docs.filter((d) => !existingSet.has(d.title));

  let inserted = 0;
  if (toInsert.length) {
    const res = await col.insertMany(toInsert);
    inserted = Object.keys(res.insertedIds).length;
  }

  await client.close();

  console.log(
    JSON.stringify({
      inserted,
      skipped: docs.length - inserted,
      totalRequested: docs.length,
    })
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
