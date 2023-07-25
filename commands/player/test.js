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
		let response = await interation.channel.send("hello");
		// await response.reply("replying");
		setTimeout(async () => {
			await response.edit("edited");
		}, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("test command")
			.toJSON();
	}
};
