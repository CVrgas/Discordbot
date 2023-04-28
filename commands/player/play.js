const {
	createAudioPlayer,
	AudioPlayerStatus,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
} = require("@discordjs/voice");
const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");
const play = require("play-dl");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("play");
	}

	async run(client, interation) {
		const url = interation.options.get("url").value;
		const link_type = play.yt_validate(url);

		// connection
		if (!getVoiceConnection(interation.guild.id)) {
			const connection = joinVoiceChannel({
				channelId: interation.member.voice.channel.id,
				guildId: interation.guild.id,
				adapterCreator: interation.guild.voiceAdapterCreator,
			});
		}

		//player
		const player = createAudioPlayer();

		//subcribe
		const subcribe = getVoiceConnection(interation.guild.id).subscribe(player);

		//create resource
		let source = null;
		let resource = null;
		switch (link_type) {
			// case link is a video => play video audio.
			
			case "video":
				source = await play.stream(url);
				resource = createAudioResource(source.stream, {
					inputType: source.type,
				});
				player.play(resource);
				break;

			//case link is a playlist  => create queue then play queue.
			case "playlist":
				const playlist = await play.playlist_info(url);
				client.queue = (await playlist.all_videos()).reverse();
				source = await play.stream(client.queue.pop().url);
				resource = await createAudioResource(source.stream, {
					inputType: source.type,
				});
				player.play(resource);
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

		//case player stop playing first song, play next if there is one.
		player.on(AudioPlayerStatus.Idle, async () => {
			if (client.queue.lenght <= 0) {
				return;
			}
			let source = await play.stream(client.queue.pop().url);
			let resource = createAudioResource(source.stream, {
				inputType: source.type,
			});

			player.play(resource);
		});

		player.on("error", (error) => {
			console.log("Error reproduciendo", error);
		});
	}

	getSlashCommandJSON() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription("play command")
			.addStringOption((option) =>
				option.setName("url").setDescription("url of video").setRequired(true)
			)
			.toJSON();
	}
};
