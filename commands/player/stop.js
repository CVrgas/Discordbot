const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

const { getVoiceConnection } = require("@discordjs/voice");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("stop");
	}
	async run(client, interation) {
		await interation.deferReply();
		const connection = await getVoiceConnection(interation.guild.id);
		connection.destroy();
		await interation.editReply({
			content: "Stopped streaming audio",
			ephemeral: true,
		});
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("stop command")
			.toJSON();
	}
};
