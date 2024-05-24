const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

module.exports = class NextCommand extends SlashCommand {
	constructor() {
		super("next");
	}

	async run(client, interaction) {
		// await interaction.deferReply();

		try {
			// Logic to play the next song
			client.YoutubeAudioPlayer.PlayNext();

			// await interaction.editReply({
			// 	content: "Playing the next song",
			// 	ephemeral: true,
			// });
		} catch (error) {
			// await interaction.editReply({
			// 	content: "error while trying to play next song",
			// 	ephemeral: true,
			// });
			console.log(`Error Playing next song:`, error.message);
		}
		// setTimeout(() => {
		// 	interaction.deleteReply();
		// }, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("Play the next song")
			.toJSON();
	}
};
