const mongodb=require('mongodb');
const MongoClient= mongodb.MongoClient;
let dbName='Day_42';
let dbUrl=`mongodb+srv://aishwaryagandhi:ManyaMau1921@cluster0.fwpds.mongodb.net/${dbName}`;

module.exports={dbUrl,mongodb,MongoClient}  