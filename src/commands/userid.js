const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { getUserID } = require("../util/min-api.js");
const { formatUserID } = require("../util/formatResponse.js");
const { usernameNotFound } = require("../util/invalidResponse.js");
const { hideOption } = require("../util/commandOptions.js");

module.exports = {
  type: 1,
  name: "userid",
  description: "get ID from username",
  options: [
    {
      name: "username",
      description: "username",
      type: ApplicationCommandOptionType.STRING,
      required: true
    },
    {
      name: "exact",
      description: "search for exact username",
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false
    },
    hideOption
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const username = ((interaction.data.options.find((opt) => opt.name === "username") || {}).value || "").trim();
    const exact = (interaction.data.options.find((opt) => opt.name === "exact") || {}).value;
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // fetch
    const res = await getUserID(username, exact);
    // check for responses
    if (res.status === 404) return response(usernameNotFound);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [formatUserID(await res.json())],
        flags: (hide ? 64 : 0)
      }
    });
  }
};
