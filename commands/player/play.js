const { AudioPlayerStatus, createAudioResource } = require("@discordjs/voice");
const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");
const {
	createEmbed,
	setEmbeds,
	getNextEmbed,
	setNextEmbed,
} = require("../../utils/embed");
const play = require("play-dl");
const {
	initAudioPlayer,
	AudioPlayer_play,
	getPlayer,
} = require("../../utils/AudioPlayer");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("play");
	}

	async run(client, interaction) {
		const url = interaction.options.get("url").value;
		const link_type = play.yt_validate(url);

		initAudioPlayer(interaction);
		const player = getPlayer();

		try {
			switch (link_type) {
				// case link is a video => play video audio.

				case "video":
					source = await play.stream(url);
					resource = createAudioResource(source.stream, {
						inputType: source.type,
					});

					play.video_basic_info(url, { htmldata: false }).then((response) => {
						interaction.reply({
							embeds: [createEmbed(response.video_details)],
							flags: 12,
						});
					});

					player.play(resource);
					break;

				//case link is a playlist  => create queue then play queue.
				case "playlist":
					const playlist = await play.playlist_info(url);

					client.queue = (await playlist.all_videos()).reverse();

					setEmbeds(client.queue);
					const video = client.queue.pop();

					source = await play.stream(video.url);

					resource = await createAudioResource(source.stream, {
						inputType: source.type,
					});

					embedResponse = await createEmbed(video);

					interaction.reply({
						embeds: [getNextEmbed()],
						options: [],
					});

					AudioPlayer_play(resource);
					break;

				//case link is a search => not implemented yet.
				case "search":
					console.log("no implemented search");
					break;

				// something else
				default:
					console.log("no valid ");
					break;
			}
		} catch (error) {
			console.log(error);
		}

		//case player stop playing first song, play next if there is one.
		player.on(AudioPlayerStatus.Idle, async () => {
			// close if bot doesnt have a queue
			if (!client.queue) {
				return;
			}

			// close if theres no item in queue
			if (client.queue.lenght <= 0) {
				interaction.deleteReply();
				return;
			}

			// prepare next song
			setNextEmbed();
			let NextSong = client.queue.pop();

			let source = await play.stream(NextSong.url);
			let resource = createAudioResource(source.stream, {
				inputType: source.type,
			});

			//reply with embeds
			try {
				interaction.editReply({ embeds: [getNextEmbed()] });
			} catch (error) {
				console.log("Error with interation reply");
			}

			//play song
			AudioPlayer_play(resource);
		});
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
