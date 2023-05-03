import { User } from "../models/user.js";
import { Child} from "../models/child.js";


const handleSocketConnection = (io) => {

    //lista mta clients connecté al socket kol
   const connectedClients = {};
   

    io.on('connection', (socket) => {
      const buildId = socket.handshake.query.buildId;
      console.log(`User with buildId ${buildId} connected`);
  
      //Zid  client hedha lel list mtaa clients connectés 
      connectedClients[socket.id] = { buildId };
      console.log(connectedClients);
      //ki tousel location ilawej 3ala el parent/parents bel buildId mta child eli yabaathha fel req (socketHandler.kt) w yabaathha
     


/*
    socket.on('startlocating',async () => {
      
      let parent = await User.findOne({ BuildId: buildId });
      if (parent) {
        parent.Children.forEach(async element => {
         let locationChild =  await Child.findById(element)
   
          const childSocketId = Object.keys(connectedClients).find(socketId => {
            return connectedClients[socketId].buildId === locationChild.BuildId;
          });
          if (childSocketId) {
            io.to(childSocketId).emit('startlocating');
            console.log(`Child ${locationChild.BuildId} was requested to start sending location`);
          }
          else { 
            console.log(`Child ${locationChild.BuildId}} offline`)
          }
        });
      }
      else { 
        console.log("Parent not found in database")
      }
     
      
    })
*/
        socket.on('location2', async(data) => { 
       let child = await Child.findOne({ BuildId: buildId });
        if (child) {
          child.Parents.forEach(async element => {
           let parent =  await User.findById(element)
            const parentSocketId = Object.keys(connectedClients).find(socketId => {
              return connectedClients[socketId].buildId === parent.BuildId;
            });
            if (parentSocketId) {
              // send message to parent's socket
              io.to(parentSocketId).emit('location',data);
              console.log(`Sending location ${data} from child with build ID : ${buildId} to parent ${parent.BuildId}`);
            }
            else { 
              console.log("Parent is offline to receive location")
            }
          });
        }
        else { 
          console.log("Child not found in database")
        }
      })
      
      socket.on('battery', async (data) => {
                let child = await Child.findOne({ BuildId: buildId });
        if (child) {
          child.Parents.forEach(async element => {
           let parent =  await User.findById(element)
          console.log(`Sending Notification from child with build ID : ${buildId} to parent ${parent.BuildId}`);
            const parentSocketId = Object.keys(connectedClients).find(socketId => {
              return connectedClients[socketId].buildId === parent.BuildId;
            });
            if (parentSocketId) {
              // send message to parent's socket
              console.log(`Battery level ${data} sent to parent`)
              io.to(parentSocketId).emit('batterylevel',data);
              
            }
            else { 
              console.log("Parent is offline to receive battery level")
            }
          });
        }
      });
  
    
      socket.on('panic', async () => {
       
        let child = await Child.findOne({ BuildId: buildId });
        if (child) {
          child.Parents.forEach(async element => {
           let parent =  await User.findById(element)
           console.log(`Sending Notification from child with build ID : ${buildId} to parent ${parent.BuildId}`);
            const parentSocketId = Object.keys(connectedClients).find(socketId => {
              return connectedClients[socketId].buildId === parent.BuildId;
            });
            if (parentSocketId) {
              // send message to parent's socket
              io.to(parentSocketId).emit('panicalert');
              console.log(`Notification sent`)
            }
            else { 
              console.log("Parent is offline")
            }
          });
        }
      });


  
      socket.on('disconnect', () => {
        delete connectedClients[socket.id];
        console.log(`User with buildId ${buildId} disconnected`);
      });
    });
  };
  
  export default handleSocketConnection;
  