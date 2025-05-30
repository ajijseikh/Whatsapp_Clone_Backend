import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js";

export const doesConversationExist = async (
  sender_id,
  receiver_id,
  isGroup
) => {
  if (isGroup === false ) {
    let convos = ConversationModel.find({
      isGroup: false,
      $and: [
        { users: { $elemMatch: { $eq: sender_id } } },
        { users: { $elemMatch: { $eq: receiver_id } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (!convos)
      throw createHttpError.BadRequest("Oops.. Something went wrong !");
    // Populate message model
    convos = await UserModel.populate(convos, {
      path: "latestMessage.sender",
      select: "name email picture status",
    });

    return convos[0];
  } else {
    // it's a group chat
    let convo = ConversationModel.find(isGroup)
   
      .populate("users admin", "-password")
      .populate("latestMessage");
      console.log("convo=>>>>>>>>>>>>>>>>>>>>>>>>>>>>",convo,"<<<<<convo>>>>>");

    if (!convo) {
      throw createHttpError.BadRequest("Ooop .., something wrong");
    }
    // Populate message model
    const con = await UserModel.populate(convo, {
      path: "latestMessage.sender",
      select: "name email picture status",
    });
//  console.log("con=================================================",con);
 
   return convo;
  }
 };

// createConversation
export const createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo)
    throw createHttpError.BadRequest("oops.. something went wrong !");
  return newConvo;
};

export const populatedConversation = async (
  id,
  fieldToPopulate,
  fieldsToRemove
) => {
  const populateConve = await ConversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldsToRemove
  );

  if (!populateConve)
    throw createHttpError.BadRequest("oops.. something went wrong !");
  return populateConve;
};

// getUserConversations
export const getUserConversations = async (user_id) => {
  // console.log("user_id",user_id);
  let conversations;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status ",
      });
      conversations = results;
    })
    .catch((err) => {
      throw createHttpError.BadRequest("Oops.. something went wrong !");
    });
  return conversations;
};

export const updateLatestMessage = async (convo_id, msg) => {
  const updatedConvo = await ConversationModel.findByIdAndUpdate(convo_id, {
    latestMessage: msg,
  });
  if (!updatedConvo)
    throw createHttpError.BadRequest("Oops.. something went wrong !");
  return updatedConvo;
};
