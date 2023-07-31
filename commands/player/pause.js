const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

module.exports = class PauseCommand extends SlashCommand {
	constructor() {
		super("pause");
	}
	async run(client, interaction) {
		await interaction.deferReply();
		try {
			client.audioPlayer.pauseSong();
			await interaction.editReply({
				content: "Paused",
				ephemeral: true,
			});
		} catch (error) {
			console.log("error while trying to pause song: ", error.message);
			await interaction.editReply({
				content: "error while trying to pause song",
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
			.setDescription("pause command")
			.toJSON();
	}
};
