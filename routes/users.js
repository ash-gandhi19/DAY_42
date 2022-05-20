var express = require('express');
var router = express.Router();
const {dbUrl,mongodb,MongoClient}=require('../dbSchema')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/*create student*/

router.post('/create_student', async(req, res) =>{

  const client=await MongoClient.connect(dbUrl);
  try{
    const db=await client.db('Day_42');
    let student=await db.collection('student').find({student_id:req.body.student_id}).toArray();
      if(student.length>0){
        res.json({
          statusCode:400,  
          message:"Student already exist"
        })
      }else{
        let document=await db.collection('student').insertOne(req.body);
        res.json(
          {
            statusCode:200,
            message:"Student Created Successfully",
            data:document
          })     
      }
  }catch(error){
    console.log(error);
    res.json({
      statusCode:500,
      message:"Internal Server error"
    })

  }finally{
    client.close();
  }
 
});

//create mentor
router.post('/create_mentor', async(req, res) =>{

  const client=await MongoClient.connect(dbUrl);
  try{
    const db=await client.db('Day_42');
    let mentor=await db.collection('mentor').find({mentor_id:req.body.mentor_id}).toArray();
      if(mentor.length>0){
        res.json({
          statusCode:400,  
          message:"Mentor already exist"
        })
      }else{
        let document=await db.collection('mentor').insertOne(req.body);
        res.json(
          {
            statusCode:200,
            message:"Mentor Created Successfully",
            data:document
          })     
      }
  }catch(error){
    console.log(error);
    res.json({
      statusCode:500,
      message:"Internal Server error"
    })

  }finally{
    client.close();
  }
 
});

// show all students for a particular mentor
router.get('/show_students_list/:mentor_id',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try 
  {
    const db = await client.db('Day_42')
    let users = await db.collection('student').find({mentor_id: req.params.mentor_id}).toArray();
    res.json({
      statusCode:200,
      users
    })
  } catch (error) 
  {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal server Error"
    })
  }
  finally
  {
    client.close();
  }
})

//assign student
router.put('/assign-student', async (req, res) => {
  const { mentor_id, student_id } = req.body;
  
  const client=await MongoClient.connect(dbUrl);
  const db=await client.db('Day_42');

  const mentor = await db
      .collection("mentor")
      .updateOne(
          { mentor_id: mentor_id },
          {
              $set: {
                student_id: student_id,
              },
          }
      );

  const students = await db
      .collection("student")
      .updateOne(
          { student_id: student_id },
          {
              $set: { mentor_id: mentor },
          }
      );


  res.send(students);
});

//assign mentor
router.put("/assign-mentor", async (req, res) => {
  
  const client=await MongoClient.connect(dbUrl);
  const db=await client.db('Day_42');
  const { student_id, mentor_id } = req.body;
  const mentor = await db
      .collection("student")
      .updateOne(
          { student_id: student_id },
          { $set: { mentor_id: mentor_id } }
      );

  const students = await 
      db
      .collection("mentor")
      .findOneAndUpdate(
          { mentor_id: mentor_id },
          {
              $addToSet: {
                student_id: student_id,
              },
          }
      );

  res.send({ Msg: "Database Updated Successfully" });
});
module.exports = router;
