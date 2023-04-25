const SlashCommand = require('../utils/SlashCommand')
const { SlashCommandBuilder } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')
module.exports = class LeaveCommand extends SlashCommand{
    constructor(){
        super('leave')
    }
    run(client, interation){
        try{
            const breakConnection = getVoiceConnection(interation.guild.id);
            breakConnection.destroy();
        }catch (err){
            console.log(err)
        }
        return interation.reply({ content: 'leaving the voice'})
    }
    getSlashCommandJSON(){
        return new SlashCommandBuilder().setName(this.name).setDescription('leave command').toJSON();
    }
}

