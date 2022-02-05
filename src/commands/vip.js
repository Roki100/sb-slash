const { axiosResponse } = require("../util/formatResponse.js");
const { notVIP, invalidVideoID } = require("../util/invalidResponse.js");
const { vip } = require("../util/min-api.js");
const { videoIDOption, uuidOption, userOptionRequired, categoryOption, publicIDOptionRequired } = require("../util/commandOptions.js");
const { checkVIP, getSBID, vipMap } = require("../util/cfkv.js");
const { actionRow, lockResponse, categoryComponent } = require("../util/lockCommon.js");
const { log } = require("../util/log.js");
const { findVideoID } = require("../util/validation.js");

module.exports = {
  name: "vip",
  description: "VIP-only commands",
  options: [{
    name: "category",
    description: "Change category",
    type: 1,
    options: [ uuidOption, categoryOption ]
  }, {
    name: "cache",
    description: "Clear redis cache for a video",
    type: 1,
    options: [ videoIDOption ]
  }, {
    name: "purge",
    description: "Purge all segments on a video",
    type: 1,
    options: [ videoIDOption ]
  }, {
    name: "downvote",
    description: "Downvote a segment",
    type: 1,
    options: [ uuidOption ]
  }, {
    name: "undovote",
    description: "Undo a downvote on a segment",
    type: 1,
    options: [ uuidOption ]
  }, {
    name: "addvip",
    description: "Grant temporary VIP to a user",
    type: 1,
    options: [userOptionRequired, {
      name: "videoid",
      description: "Video ID from channel to grant VIP on",
      type: 3,
      required: true
    }]
  }, {
    name: "lookup",
    description: "Look up Discord ID from SBID",
    type: 1,
    options: [ publicIDOptionRequired ]
  }, {
    name: "unwarn",
    description: "Remove warning from a user",
    type: 1,
    options: [ publicIDOptionRequired ]
  }, {
    name: "lock",
    description: "Lock categories",
    type: 1,
    options: [ videoIDOption, {
      name: "reason",
      description: "Custom lock reason",
      type: 3
    }]
  }, {
    name: "banstatus",
    description: "Get ban status of user",
    type: 1,
    options: [ publicIDOptionRequired]
  }],
  execute: async ({ interaction, response }) => {
    // check that user is VIP
    const dUser = interaction?.member;
    if (!dUser || !checkVIP(dUser?.roles)) return response(notVIP);
    // setup
    const rootOptions = interaction.data.options[0];
    const cmdName = rootOptions.name;
    const nested = (name) => (rootOptions?.options.find((opt) => opt?.name === name)?.value || null);

    let result;
    // command switch
    if (cmdName === "category") {
      const uuid = nested("uuid");
      const category = nested("category");
      result = await vip.postChangeCategory(uuid, category)
        .catch((err) => {
          console.log(err);
          throw "api error";
        });
    } else if (cmdName === "cache") {
      const videoID = nested("videoid");
      result = await vip.postClearCache(videoID)
        .catch((err) => {
          console.log(err);
          throw "api error";
        });
    } else if (cmdName === "purge") {
      const videoID = nested("videoid");
      await log(dUser.user, cmdName, videoID);
      result = await vip.postPurgeSegments(videoID)
        .catch((err) => {
          console.log(err);
          throw "api error";
        });
    } else if (cmdName === "downvote") {
      const uuid = nested("uuid");
      await log(dUser.user, cmdName, uuid);
      result = await vip.postVoteOnSegment(uuid, 0)
        .catch((err) => {
          console.log(err);
          throw "api error";
        });
    } else if (cmdName === "undovote") {
      const uuid = nested("uuid");
      await log(dUser.user, cmdName, uuid);
      result = await vip.postVoteOnSegment(uuid, 20)
        .catch((err) => {
          console.log(err);
          throw "api error";
        });
    } else if (cmdName === "addvip") {
      const user = nested("user");
      const SBID = await getSBID(user);
      const videoID = nested("videoid");
      await log(dUser.user, cmdName, SBID);
      result = await vip.postAddTempVIP(SBID, videoID)
        .catch((err) => {
          console.log(err);
          throw "api error";
        });
    } else if (cmdName === "lookup") {
      const SBID = nested("publicid");
      const dID = await vipMap(SBID);
      return response({
        type: 4,
        data: {
          content: dID ? `<@!${dID}>` : "Not found",
          allowed_mentions: { parse: [] },
          flags: 64
        }
      });
    } else if (cmdName === "unwarn") {
      const SBID = nested("publicid");
      await log(dUser.user, cmdName, SBID);
      result = await vip.deleteWarning(SBID)
        .catch((err) => {
          console.log(err);
          throw "api error";
        });
    } else if (cmdName === "lock") {
      // videoid validation
      let videoID = nested("videoid");
      videoID = findVideoID(videoID) || videoID;
      if (!videoID) return response(invalidVideoID);
      const reason = nested("reason");
      // body lockOptions creation
      const lockOptions = { videoID };
      if (reason) lockOptions.reason = reason;
      const embeds = lockResponse(lockOptions);
      return response({
        type: 4,
        data: {
          embeds,
          components: actionRow(categoryComponent),
          flags: 64
        }
      });
    } else if (cmdName === "banstatus") {
      const publicid = nested("publicid");
      const res = await vip.getBanStatus(publicid)
        .catch((err) => {
          console.log(err);
          throw "api error";
        });
      return response({
        type: 4,
        data: {
          content: res.banned ? "🔨 Banned" : "Not Banned",
          flags: 64
        }
      });
    }

    // response
    const resResponse = await axiosResponse(result);
    return response({
      type: 4,
      data: { content: `${cmdName} ${resResponse}`}
    });
  }
};
