const {
	getVoiceConnection,
	joinVoiceChannel,
	AudioPlayerStatus,
	createAudioResource,
	createAudioPlayer,
} = require("@discordjs/voice");
const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");
const {
	createEmbed,
	SetEmbedData,
	getNextEmbed,
} = require("../../utils/embed");
const play = require("play-dl");
const {
	AudioPlayer_play,
	getPlayer,
	listen_Iddle,
	playSigle,
} = require("../../utils/AudioPlayer");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("play");
	}

	async run(client, interaction) {
		await interaction.deferReply();
		const url = interaction.options.get("url").value;
		const link_type = play.yt_validate(url);
		const connection = getVoiceConnection(interaction.guild.id);

		if (!connection) {
			if (interaction.member?.voice?.channel?.id) {
				const connection = joinVoiceChannel({
					channelId: interaction.member.voice.channel.id,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				});
			} else {
				await interaction.editReply({
					content: "U need to be in a channel",
					ephemeral: true,
					SuppressNotifications: true,
				});
				return;
			}
		}

		const player = getPlayer();

		try {
			switch (link_type) {
				// case link is a video => play video audio.
				case "video":
					playSigle(url);
					getVoiceConnection(interaction.guild.id).subscribe(player);
					await interaction.editReply(`Playing now...\n${url}`);
					break;

				//case link is a playlist  => create queue then play queue.
				case "playlist":
					const playlist = await play.playlist_info(url);
					client.queue = (await playlist.all_videos()).reverse();
					SetEmbedData(client.queue);
					const video = client.queue.pop();

					await interaction.editReply("playing");
					setTimeout(async () => {
						await interaction.deleteReply();
					}, 10000);

					const response = await interaction.channel.send({
						embeds: [getNextEmbed()],
						SuppressNotifications: true,
						options: [],
					});
					const source = await play.stream(url);
					const resource = await createAudioResource(source.stream, {
						inputType: source.type,
					});
					AudioPlayer_play(resource);
					listen_Iddle(client, interaction, response);
					getVoiceConnection(interaction.guild.id).subscribe(player);
					break;

				//case link is a search => not implemented yet.
				case "search":
					await interaction.editReply({
						content: "no implemented search",
						ephemeral: true,
					});
					console.log("search not implemented ");
					break;

				// something else
				default:
					await interaction.editReply({
						content: "no valid",
						ephemeral: true,
					});
					console.log("no valid ");
					break;
			}
		} catch (error) {
			// console.log("Error dectecting url type");
			console.log(error);
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
