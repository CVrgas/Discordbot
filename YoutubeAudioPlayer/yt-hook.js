const play = require("play-dl");
const video = require("./interfaces/video.js");

async function validate(link) {
	return play.yt_validate(link);
}
async function ExtendedInfo(url) {
	return await play.video_info(url);
}
async function ShortInfo(url) {
	return await play.video_basic_info(url);
}
async function PlaylistInfo(url) {
	return await play.playlist_info(url);
}

async function getVideoData(url) {
	if (play.yt_validate(url) !== "video") {
		return;
	}
	const info = (await play.video_info(url)).video_details;
	return new video(
		info.title,
		info.url,
		info.durationRaw,
		info.thumbnails[info.thumbnails.length - 1].url
	);
}

async function getPlaylistData(url, limit = undefined) {
	if (play.yt_validate(url) !== "playlist") {
		return;
	}
	return await play
		.playlist_info(url)
		.then((res) => res.all_videos())
		.then((info) =>
			info
				.map((ytVideo, i) => {
					if (limit && Number.isInteger(limit) && i >= limit) {
						return null;
					}
					return new video(
						ytVideo.title,
						ytVideo.url,
						ytVideo.durationRaw,
						ytVideo.thumbnails[ytVideo.thumbnails.length - 1].url
					);
				})
				.filter((video) => video !== null)
		);

	// return info.map((v, i) => {
	// 	if (limit && i >= limit) {
	// 		return null;
	// 	}
	// 	return new video(v.title, v.url, v.durationRaw);
	// });
}

module.exports = {
	validate,
	ExtendedInfo,
	ShortInfo,
	PlaylistInfo,
	getVideoData,
	getPlaylistData,
};
