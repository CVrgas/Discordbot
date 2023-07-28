const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");
const { playListEmbed } = require("../../utils/embed");
const CandyPlayer = require("../../Models/player");
const PlaylistEmbed = require("../../Models/currrentPlayingEmbed");
const { AudioPlayerStatus } = require("@discordjs/voice");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("play");
	}

	async run(client, interaction) {
		interaction.deferReply();
		try {
			//get url trying to play
			const urlOption = interaction.options.get("url");
			if (!urlOption) {
				await interaction.reply("Missing required 'url' option.");
				return;
			}
			const url = urlOption.value;

			//if client doesnt has a audioPlayer create one
			if (!client.audioPlayer) {
				client.audioPlayer = new CandyPlayer();
			}

			// add song to queue and then play it
			const response = await client.audioPlayer.addSong(url);
			await client.audioPlayer.playSong(interaction);

			await client.audioPlayer.addListeners();

			let sentEmbed = null;
			await client.audioPlayer.InternalPlayer.on(
				AudioPlayerStatus.Playing,
				async () => {
					if (sentEmbed === null) {
						sentEmbed = await interaction.channel.send({
							embeds: [await client.audioPlayer.embedResponse.getResponse()],
						});
						return;
					} else {
						const message = await sentEmbed;
						sentEmbed.edit({
							embeds: [await client.audioPlayer.embedResponse.getResponse()],
						});
					}
				}
			);
			interaction.editReply("playing...");
		} catch (error) {
			console.error("Error Running play command: ", error);
			interaction.editReply("An error occurred while processing the command.");
		}
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("play command")
			.addStringOption((option) =>
				option.setName("url").setDescription("video url").setRequired(true)
			)
			.toJSON();
	}
};
