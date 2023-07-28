const play = require("play-dl");
const playdl = require("play-dl");
const {
	getVoiceConnection,
	joinVoiceChannel,
	createAudioResource,
	createAudioPlayer,
	AudioPlayerStatus,
} = require("@discordjs/voice");
const { playListEmbed } = require("../utils/embed");
const currentPlayingEmbed = require("./currrentPlayingEmbed");

module.exports = class CandyPlayer {
	constructor() {
		this.queue = [];
		this.currentSong = 0;
		this.nextSongIndex = this.currentSong + 1;
		this.InternalPlayer = createAudioPlayer();
		this.currentGuild = "";
		this.embedResponse = new currentPlayingEmbed();
		this.isListening = false;
		this.status = null;
	}
	async addSong(url) {
		switch (play.yt_validate(url)) {
			case "playlist":
				let dataList = await getListData(url);
				this.queue.push(...dataList);
				break;

			case "video":
				const data = await getVideoData(url);
				this.queue.push(data);
				break;

			default:
				console.log("none");
				break;
		}
	}
	async nextSong() {
		if (this.currentSong === this.queue.length - 1) {
			this.end = true;
			return;
		}
		this.currentSong++;
		this.nextSongIndex++;
		this.playSong(this.currentGuild);
		await this.embedResponse.setResponse(this.get_Current_Next());
	}
	async previousSong() {
		if (this.currentSong === 0) {
			return;
		}
		this.currentSong--;
		this.nextSongIndex--;
		this.playSong(this.currentGuild);
		await this.embedResponse.setResponse(this.get_Current_Next());
	}
	pauseSong() {
		this.status = "paused";
		this.InternalPlayer.pause();
	}
	resumeSong() {
		this.status = "playing";
		this.InternalPlayer.unpause();
	}
	async playSong(i) {
		// Creating connection to voice chat
		const connection = getVoiceConnection(i.guild.id);
		if (!connection) {
			joinVoiceChannel({
				channelId: i.member.voice.channel.id,
				guildId: i.guild.id,
				adapterCreator: i.guild.voiceAdapterCreator,
			});
			this.currentGuild = i;
		}

		// Generating streaming resource
		if (this.queue.length === 0) {
			return;
		}

		const source = await play.stream(this.queue[this.currentSong].url);
		const resource = createAudioResource(source.stream, {
			inputType: source.type,
		});
		this.InternalPlayer.play(resource);

		getVoiceConnection(i.guild.id).subscribe(this.InternalPlayer);

		if (!this.isListening) {
			this.addListeners();
			this.embedResponse.setResponse(this.get_Current_Next());
		}
		this.status = "playing";
	}
	get_Current_Next() {
		return {
			current: this.queue[this.currentSong]
				? this.queue[this.currentSong]
				: "null",
			next: this.queue[this.nextSongIndex]
				? this.queue[this.nextSongIndex]
				: null,
		};
	}
	stopSong() {
		this.InternalPlayer.stop();
		this.queue = [];
	}
	addListeners() {
		this.InternalPlayer.on("error", async (error) => {
			console.log("Error playing audio");
			if (sentMessage) {
				await sentMessage.edit("Error playing audio");
			}
		});

		this.InternalPlayer.on(AudioPlayerStatus.Idle, async () => {
			if (
				this.currentSong === this.queue.length - 1 ||
				this.status === "paused"
			) {
				return;
			}
			this.nextSong();
		});

		this.isListening = true;
	}
};

async function getVideoData(url) {
	const video_info = await play.video_basic_info(url);
	return {
		url: video_info.video_details.url,
		title: video_info.video_details.title,
		thumbnail:
			video_info.video_details.thumbnails[
				video_info.video_details.thumbnails.length - 1
			].url,
	};
}

async function getListData(url) {
	const playlist_info = await playdl.playlist_info(url);
	const dataList = playlist_info.videos.map((video) => {
		return {
			url: video.url,
			title: video.title,
			thumbnail: video.thumbnails[video.thumbnails.length - 1].url,
		};
	});
	return dataList;
}
