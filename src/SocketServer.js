let onlineUsers = [];
export default function (socket, io) {
  /// user joins or opens the application
  socket.on("join", (user) => {
    socket.join(user);
    // add joined user to online users
    if (!onlineUsers.some((u) => u.userId === user)) {
      console.log(`user ${user} is now online`);
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    // send online users to frontend
    io.emit("get-online-users", onlineUsers);
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
    console.log("typing msg...",conversation);
    socket.in(conversation).emit("typing",conversation);
  })
  socket.on("stop typing",(conversation)=>{
    console.log(" stop typing msg...",conversation);
    socket.in(conversation).emit("stop typing");
  })
}

