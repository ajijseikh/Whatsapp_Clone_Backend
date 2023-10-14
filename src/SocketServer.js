let onlineUsers = [];
export default function (socket, io) {
  /// user joins or opens the application
  socket.on("join", (user) => {
    socket.join(user);
    console.log("backkend-------------------------->",user);
    // add joined user to online users
    if (!onlineUsers.some((u) => u.userId === user)) {
      console.log(`user ${user} is now online`);
      onlineUsers.push({ userId: user, socketId: socket.id });
      console.log("Socket id ", socket.id);
    }
    // send online users to frontend
    io.emit("get-online-users", onlineUsers);
    // send socket id
    io.emit("setup socket", socket.id)
  });
  // socket disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    socket.emit("get-online-users", onlineUsers);
  });

  // join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });
  // send and receive message
  socket.on("send message", (message) => {
    let conversation = message.conversation;

    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });

  // Typing 
  socket.on("typing",(conversation)=>{
    socket.in(conversation).emit("typing",conversation);
  })
  socket.on("stop typing",(conversation)=>{
    socket.in(conversation).emit("stop typing");
  })
  // call 
  // --- call user
  socket.on("call user",(data)=>{
    // console.log("data call user ",data);
   let userId=data.userToCall;
   let userSocketId=onlineUsers.find((user)=>user.userId==userId)
  //  console.log("userSocketId",userSocketId);
   io.to(userSocketId.socketId).emit("call user",{
    signal:data.signal,
    from:data.from,
    name:data.name,
    picture:data.picture,
   })
  })

  //---- answer call 
  socket.on("answer call",(data)=>{
    io.to(data.to).emit("call accepted",data.signal)
  })

  // end call 
  socket.on("end call",(id)=>{
    io.to(id).emit("end call");
  })
}

