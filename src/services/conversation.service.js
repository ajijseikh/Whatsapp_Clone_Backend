import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js";

export const doesConversationExist = async (sender_id, receiver_id) => {
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
};

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
  if(!populateConve)  throw createHttpError.BadRequest("oops.. something went wrong !");
  return populateConve;
};
