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
const CandyPlayer = require("../../Models/player");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("test");
	}
	async run(client, interation) {
		const url =
			"https://www.youtube.com/watch?v=OPf0YbXqDm0&list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj";
		await interation.deferReply({
			ephemeral: true,
			SuppressNotifications: true,
		});
		if (!client.musicPlayer) {
			client.audioPlayer = new CandyPlayer();
		}
		client.audioPlayer.addSong(url).then((response) => {
			client.audioPlayer.playSong(interation);
		});
		await interation.editReply({
			content: "done",
			SuppressNotifications: true,
			ephemeral: true,
		});
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("test command")
			.toJSON();
	}
};
