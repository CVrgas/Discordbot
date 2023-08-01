const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder, ActionRow, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const CandyPlayer = require("../../Models/player");
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
			// await client.audioPlayer.addSong(url);
			await client.audioPlayer.replaceQueue(url);
			await client.audioPlayer.playSong(interaction);
			
			const player = client.audioPlayer.InternalPlayer
			let sentEmbed = null;

			await player.on(
				AudioPlayerStatus.Playing,
				async () => {
					if (sentEmbed === null) {
						const next = new ButtonBuilder().setCustomId('next').setEmoji('▶').setStyle(ButtonStyle.Primary);
						const pausePlay = new ButtonBuilder().setCustomId('pausePlay').setEmoji('⏯').setStyle(ButtonStyle.Primary);
						const previous = new ButtonBuilder().setCustomId('previous').setEmoji('◀').setStyle(ButtonStyle.Secondary).setDisabled(true );
						const row = new ActionRowBuilder().addComponents(previous, pausePlay, next)

						sentEmbed = await interaction.channel.send({
							embeds: [await client.audioPlayer.embedResponse.getResponse()],
							components: [row],
							
						});
						return;
					} else {
						
						const next = new ButtonBuilder().setCustomId('next').setEmoji('▶').setStyle(ButtonStyle.Primary);
						const pausePlay = new ButtonBuilder().setCustomId('pausePlay').setEmoji('⏯').setStyle(ButtonStyle.Primary);
						const previous = new ButtonBuilder().setCustomId('previous').setEmoji('◀').setStyle(ButtonStyle.Primary).setDisabled(false);
						const row = new ActionRowBuilder().addComponents(previous, pausePlay, next)
						const message = await sentEmbed;
						sentEmbed.edit({
							embeds: [await client.audioPlayer.embedResponse.getResponse()],
							components: [row],
						});
					}
				}
			);
			player.on("error", async (error) => {
				console.log("Error playing audio: ", error.message);
			});
			player.on(AudioPlayerStatus.Idle, async () => {

				if (
					player.currentSong === player.queue.length - 1 ||
					player.status === "paused"
				) {
					return;
				}
				player.nextSong();
			});
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
