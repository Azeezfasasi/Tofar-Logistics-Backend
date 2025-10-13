const mongoose = require('mongoose');
require('dotenv').config();
const Shipment = require('../models/Shipment');

const MONGO_URI = process.env.MONGO_URI;

async function backfill() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not set in environment. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for backfill');

  try {
    const cursor = Shipment.find({ $or: [ { trackingHistory: { $exists: false } }, { trackingHistory: { $size: 0 } } ] }).cursor();
    let count = 0;
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      // Add an initial entry reflecting current status
      const entry = {
        status: doc.status || 'pending',
        location: doc.origin || 'Unknown',
        timestamp: new Date()
      };
      doc.trackingHistory = doc.trackingHistory || [];
      doc.trackingHistory.push(entry);
      await doc.save();
      count++;
      console.log(`Backfilled shipment ${doc.trackingNumber}`);
    }
    console.log(`Backfill complete. Updated ${count} shipments.`);
  } catch (err) {
    console.error('Backfill failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

backfill();
