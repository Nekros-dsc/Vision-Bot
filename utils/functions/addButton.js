
const { ComponentType, ButtonStyle } = require("discord.js");
const client = require('../../index')
function checkIfRowIsFull(rowOfButtons,newRow,components,message){

    if(rowOfButtons.components.length  +1  >=5){
    
     

       rowOfButtons.components.push({
         type : ComponentType.Button,
         customID : "next" + message.id,
        
         emoji : {
           name : client.emoji.right.split(":")[1].split(">")[0],
           id : client.emoji.right.split(":")[2].split(">")[0],
         },
         style : ButtonStyle.Success
       })

      newRow.components.push(components)
       newRow.components.push({
            type : ComponentType.Button,
         customID : "backButt" + message.id ,
        
         emoji : {
           name : client.emoji.left.split(":")[1].split(">")[0],
           id : client.emoji.left.split(":")[2].split(">")[0],
         },
         style : ButtonStyle.Success
       })





     } else {
       rowOfButtons.components.push(components)
      
     }
   
    }

    module.exports = checkIfRowIsFull