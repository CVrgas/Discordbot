const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

const { getVoiceConnection } = require("@discordjs/voice");

module.exports = class NextCommand extends SlashCommand {
	constructor() {
		super("next");
	}

	async run(client, interaction) {
		await interaction.deferReply();

		// Logic to play the next song
		client.audioPlayer.nextSong();

		await interaction.editReply({
			content: "Playing the next song",
			ephemeral: true,
		});
		setTimeout(() => {
			interaction.deleteReply();
		}, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("Play the next song")
			.toJSON();
	}
};
