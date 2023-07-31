const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

module.exports = class StopCommand extends SlashCommand {
	constructor() {
		super("stop");
	}
	async run(client, interaction) {
		await interaction.deferReply();

		try {
			client.audioPlayer.stopSong();

			await interaction.editReply({
				content: "Player Closed",
				ephemeral: true,
			});
		} catch (error) {
			console.log("error while trying to close player:", error.message);
			await interaction.editReply({
				content: "error while trying to close player",
				ephemeral: true,
			});
		}

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
