const { youtube } = require("../yt-hook.js");

const { getPlaylistData, getVideoData, validate } = require("../yt-hook.js");

class Queue {
	constructor() {
		this._Queue = [];
		this._currentPosition = 0;
	}
	// Queue Actions
	async AddToQueue(url, limit = undefined) {
		const type = await validate(url);

		if (type === "video") {
			const video = await getVideoData(url);
			this._Queue.push(video);
		}

		if (type === "playlist") {
			const videos = await getPlaylistData(url, limit);
			this._Queue.push(...videos);
		}

		return this._Queue;
	}

	getStatus() {
		return true;
	}
	ClearQueue() {
		this._Queue = [];
	}

	// Audio Player Acctions
	playlist(limit = undefined) {
		if (limit && Number.isInteger(limit)) {
			return this._Queue.slice(
				this._currentPosition,
				this._currentPosition + limit
			);
		}
		return this._Queue.slice(this._currentPosition, this._Queue.length);
	}
	current() {
		if (this._Queue && Array.isArray(this._Queue)) {
			return this._Queue[this._currentPosition];
		}
	}

	next() {
		if (
			this._Queue &&
			Array.isArray(this._Queue) &&
			this._Queue.length > this._currentPosition
		) {
			return this._Queue[(this._currentPosition += 1)];
		}
		return this._Queue[this._currentPosition];
	}

	prev() {
		if (
			this._Queue &&
			Array.isArray(this._Queue) &&
			1 < this._currentPosition
		) {
			return this._Queue[(this._currentPosition -= 1)];
		}
		return this._Queue[this._currentPosition];
	}

	isNext() {
		if (this._Queue && Array.isArray(this._Queue)) {
			return this._Queue.length - 1 > this._currentPosition;
		}
	}

	isPrev() {
		if (this._Queue && Array.isArray(this._Queue)) {
			return 1 < this._currentPosition;
		}
	}
}
async function addSigleVideo(url) {
	return await getVideoData(url);
}
async function addPlaylist(url, limit = undefined) {
	return await getPlaylistData(url, limit);
}

module.exports = Queue;
