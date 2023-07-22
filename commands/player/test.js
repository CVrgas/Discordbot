const {
	createAudioPlayer,
	AudioPlayerStatus,
	createAudioResource,
	getVoiceConnection,
	VoiceConnection,
} = require("@discordjs/voice");
const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder, Message } = require("discord.js");
const play = require("play-dl");
const { EmbedBuilder } = require("discord.js");
const { createEmbed } = require("../../utils/embed");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("test");
	}
	async run(client, interation) {
		interation.reply({ content: "Recived", ephemeral: true });
		setTimeout(() => {
			interation.editReply({ content: "Recived second", ephemeral: true });
		}, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("test command")
			.toJSON();
	}
};
