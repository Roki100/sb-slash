module.exports = {
  name: "github",
  description: "Get a link for the sb-slash GitHub",
  execute: async ({ response }) =>
    response({
      type: 4,
      data: {
        embeds: [{
          description: "Visit the [GitHub](https://github.com/mchangrh/sb-slash) to report any issues, make any feature requests or fork the source code",
          color: 0xff0000
        }],
        flags: 64 // hide
      }
    })
};
