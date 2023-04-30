const { EmbedBuilder } = require("discord.js");

function createEmbed(videoInfo) {
	try {
		const embed = new EmbedBuilder()
			.setColor([207, 25, 25])
			.setTitle(`${videoInfo.title}`)
			.addFields(
				{
					name: "Duration",
					value: `${videoInfo.durationRaw}`,
					inline: true,
				},
				{
					name: "uploaded",
					value: `${videoInfo.uploadedAt}`,
					inline: true,
				},
				{
					name: "views",
					value: `${videoInfo.views}`,
					inline: true,
				}
			);
		// .toJSON();
		return embed;
	} catch (error) {
		console.log(`creating embed Error \n${error}`);
		const ErrorEmbed = new EmbedBuilder().setTitle("error creating box");
		return ErrorEmbed;
	}
}

module.exports = {
	createEmbed,
};
