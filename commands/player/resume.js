const {
	createAudioPlayer,
	AudioPlayerStatus,
	createAudioResource,
	getVoiceConnection,
} = require("@discordjs/voice");
const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");

module.exports = class ResumeCommand extends SlashCommand {
	constructor() {
		super("resume");
	}
	async run(client, interation) {
		await interation.deferReply();
		client.audioPlayer.resumeSong();
		interation.editReply("Resuming");
		setTimeout(() => {
			interation.deleteReply();
		}, 5000);
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("resume command")
			.toJSON();
	}
};
