const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

module.exports = class PreviousCommand extends SlashCommand {
	constructor() {
		super("previous");
	}

	async run(client, interaction) {
		// await interaction.deferReply();

		try {
			// Logic to play the previous song
			client.YoutubeAudioPlayer.PlayPrev();
			// await interaction.editReply({
			// 	content: "Playing the previous song",
			// 	ephemeral: true,
			// });
		} catch (error) {
			console.log("error while trying to play previous song:", error.message);
			// await interaction.editReply({
			// 	content: "error while trying to play previous song",
			// 	ephemeral: true,
			// });
		}
		// setTimeout(() => {
		// 	interaction.deleteReply();
		// }, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("Play the previous song")
			.toJSON();
	}
};
