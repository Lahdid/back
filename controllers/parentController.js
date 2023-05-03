import { User } from "../models/user.js";
import { Child} from "../models/child.js";
import { Application } from "../models/application.js";
import { application } from "express";





export async function linkChild(req, res) {
  let child = await Child.findOne({ BuildId: req.body.BuildId });

  if (child) {
    console.log("child exists")
    User.findById(req.id).then(async (user) => {
        var alreadyLinked = false;
         
        for (const parent of child.Parents) {
           if(parent._id.equals(user._id)) { 
            alreadyLinked = true;
           }
         }
         
        if (!alreadyLinked) {
          user.Children.push(child._id);
          child.Parents.push(user._id);
          child.Linked = true;
          await Promise.all([child.save(), user.save()]);
          res.status(200).json({
            "_id":child._id,
            "Name":child.Name,
            "Status":"Activated",
            "BuildId":child.BuildId

          });
        }
        else { 
          console.log("Already linked")
          res.status(501).send({"error":"Already linked"});
        }

     
        
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ "error": "Error linking child" });
      });
  } else {
    console.log("child doesnt exists");
    const user = await User.findById(req.id);
  
    const newChild = await Child.create({
      Name: "Child's phone",
      BuildId: req.body.BuildId,
      Linked: true,
      Status:"Activated",
      Parents: [user._id],
    });

    user.Children.push(newChild._id);
    await user.save();

    res.status(200).json(newChild);
  } 
}
export async function getChildrenByParent(req, res) {
  try {
    const docs = await User.findById(req.id);
    const childIds = docs.Children.map(child => child._id);
    const children = await Child.find({ _id: { $in: childIds } });
    res.status(200).send(children);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function addApplicationToChild(req,res){
  let child=await Child.findById(req.body.id).populate("applications")
  var application=new Application()
    application.Name=req.body.name
    application.child=child._id

    await Child.findOneAndUpdate({_id:req.body.id},
        {
          $push:{
            applications:application._id,
          }
        } 
      )
    await application.save();
    res.status(200).send(child)

  
  
}

export async function getApplicationByChild(req, res) {
  console.log(req.body.id);
  try {
    let child = await Child.findOne({ id: req.body.id }).populate('applications');
    if (child) {
      res.status(200).json(child.applications);
    } else {
      res.status(404).send("Child Not Found!!");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export async function blockApplication(req,res){
  console.log("blocking");
  await Application.findOneAndUpdate({_id:req.body.id}, {
    blocked: req.body.blocked,
  }).then(docs=>{
    res.status(200).json(docs)
  }).catch(err=>{
    res.status(500).send("Failed to block App")
  })
}
 

export async function getChildSafeZone(req,res){ 
  let user = await User.findById(req.id);
  await Child.findOne({ Parents: user._id}).then((docs) => {
    res.status(200).json({
      SafeZonePoint1: docs.SafeZonePoint1,
      SafeZonePoint2: docs.SafeZonePoint2,
      SafeZonePoint3: docs.SafeZonePoint3,
      SafeZonePoint4: docs.SafeZonePoint4,
    })
  }).catch(err=>{
    res.status(500).send("Failed to get child safe zone")

  })
  
}




export async function setChildSafeZone(req,res){
  let user = await User.findById(req.id);
  let child =  await Child.findOne({ Parents: user._id})
  if (child) {
    Child.findOneAndUpdate({_id:child._id},{
      SafeZonePoint1:req.body.SafeZonePoint1,
      SafeZonePoint2:req.body.SafeZonePoint2,
      SafeZonePoint3:req.body.SafeZonePoint3,
      SafeZonePoint4:req.body.SafeZonePoint4,
    },{
      // Hedha i5alih iraja3lek el version updated mtaa user mech el kdim
      returnDocument: "after",
    }).then((docs) => {
      res.status(200).json(docs)
    }).catch(err=>{
      res.status(500).send("Failed to set child's safe zone")

    })
  }
  else {
    console.log("error 3")
    res.status(404).send("No linked children")
  }


}


export async function unlinkChild(req,res){}