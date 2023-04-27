const { createAudioPlayer, AudioPlayerStatus, createAudioResource, getVoiceConnection } = require('@discordjs/voice')
const SlashCommand = require('../../utils/SlashCommand')
const { SlashCommandBuilder } = require('discord.js')
const ytdl = require('ytdl-core')

module.exports = class PlayCommand extends SlashCommand{
    constructor(){
        super('test')
    }
    async run(client, interation){
        interation.reply('test')
    }

    getSlashCommandJSON(){
        return new SlashCommandBuilder()
        .setName(this.name)
        .setDescription('test command')
        .toJSON();
    }
}
