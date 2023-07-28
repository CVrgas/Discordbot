const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

const { getVoiceConnection } = require("@discordjs/voice");

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
		} catch (error) {
			console.log("error adding song:", error.message);
		}
		await interaction.editReply({
			content: "Playing the previous song",
			ephemeral: true,
		});
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
