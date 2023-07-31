const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

module.exports = class AddCommand extends SlashCommand {
	constructor() {
		super("add");
	}

	async run(client, interaction) {
		await interaction.deferReply();

		const urlOption = interaction.options.get("url");
		if (!urlOption) {
			await interaction.reply("Missing required 'url' option.");
			return;
		}
		const url = urlOption.value;

		try {
			await client.audioPlayer.addSong(url);
			await interaction.editReply({
				content: `song added to Queue`,
				ephemeral: true,
			});
		} catch (error) {
			await interaction.editReply({
				content: `Error adding song`,
				ephemeral: true,
			});
			console.log("error adding song:", error.message);
		}
		setTimeout(() => {
			interaction.deleteReply();
		}, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("add a song to queue")
			.addStringOption((option) =>
				option.setName("url").setDescription("video url").setRequired(true)
			)
			.toJSON();
	}
};
