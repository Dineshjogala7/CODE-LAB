const nanoid = require("nanoid")
const socket = require("socket.io");
async function createRoom(req,res) {
    try {
        const roomId = nanoid();
        return res.json({roomId,message:"roomId is created successfullY!!"});
    } catch (error) {
        return res.status(500).json({message:"Error in generating the room!!"})
    }
}





module.exports = { createRoom };
