const {
	createAudioPlayer,
	AudioPlayerStatus,
	createAudioResource,
	getVoiceConnection,
} = require("@discordjs/voice");
const SlashCommand = require("../../utils/SlashCommand");
const { SlashCommandBuilder } = require("discord.js");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const ytlist = require("youtube-playlist");
const { songPlayer, playlistPlayer } = require("../../utils/player");

module.exports = class PlayCommand extends SlashCommand {
	constructor() {
		super("play");
	}

	async run(client, interation) {
		// necesito desinstalar ytpl

		try {
			let url = interation.options.get("url").value;
			let validar = await ytdl.validateURL(url);
			if (!validar) {
				return interation.reply("no valida");
			}

			let songData = await ytdl.getInfo(url);
			let song = {
				tittle: songData.videoDetails.title,
				url: songData.videoDetails.video_url,
			};
			let connection = getVoiceConnection(interation.guild.id);
			if (!connection) {
				return interation.reply(" Not connection");
			}

			const stream = await ytdl(url, {
				filter: "audioonly",
				quality: "lowestaudio",
			});
			const resourse = await createAudioResource(stream);
			let player = createAudioPlayer();
			let dispatcher = connection.subscribe(player);
			player.play(resourse);
			interation.reply(`now playing: ${url}`);

			player.on("error", (error) => {
				console.log("Error reproduciendo", error);
			});
		} catch (err) {
			console.log(err);
		}
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
