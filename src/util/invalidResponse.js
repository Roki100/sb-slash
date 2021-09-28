const { InteractionResponseType, InteractionResponseFlags } = require("discord-interactions");

const invalidSegment = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, that doesn't appear to be a valid segment ID",
    flags: InteractionResponseFlags.EPHEMERAL
  }
};

const invalidPublicID = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, that doesn't appear to be a valid public User ID",
    flags: InteractionResponseFlags.EPHEMERAL
  }
};

const noStoredID = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, there don't seem to be any set userIDs for this Discord user",
    flags: InteractionResponseFlags.EPHEMERAL
  }
};

const segmentNotFound = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, there doesn't seem to be any segments with that ID",
    flags: InteractionResponseFlags.EPHEMERAL
  }
};

const usernameNotFound = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry, there doesn't seem to be any users with that username. The search **is** case-sensitive.",
    flags: InteractionResponseFlags.EPHEMERAL
  }
};

const videoIDNotFound = {
  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: "Sorry there doesn't seem to be any video links in this message",
    flags: InteractionResponseFlags.EPHEMERAL
  }
};

module.exports = {
  invalidSegment,
  invalidPublicID,
  noStoredID,
  segmentNotFound,
  usernameNotFound,
  videoIDNotFound
};