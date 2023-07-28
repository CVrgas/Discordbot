const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

const { getVoiceConnection } = require("@discordjs/voice");

module.exports = class StopCommand extends SlashCommand {
	constructor() {
		super("stop");
	}
	async run(client, interaction) {
		await interaction.deferReply();
		client.audioPlayer.stopSong();

		await interaction.editReply({
			content: "Player Closed",
			ephemeral: true,
		});

		setTimeout(() => {
			interaction.deleteReply();
		}, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("stop command")
			.toJSON();
	}
};
