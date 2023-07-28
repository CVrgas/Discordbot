const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

const { getVoiceConnection } = require("@discordjs/voice");

module.exports = class PreviousCommand extends SlashCommand {
	constructor() {
		super("previous");
	}

	async run(client, interaction) {
		await interaction.deferReply();

		// Logic to play the previous song
		client.audioPlayer.previousSong();
		await interaction.editReply({
			content: "Playing the previous song",
			ephemeral: true,
		});
		setTimeout(() => {
			interaction.deleteReply();
		}, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("Play the previous song")
			.toJSON();
	}
};
