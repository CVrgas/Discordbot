require("dotenv/config");
const {
	Client,
	IntentsBitField,
	Message,
	SlashCommandBuilder,
	Routes,
	Collection,
	ChannelType,
	EmbedBuilder,
	MessageComponentInteraction,
	Options,
} = require("discord.js");

const { TOKEN, CHANNEL_ID, GUILD_ID, APP_ID } = process.env;
const { registerCommands } = require("./utils/registry");

const bot = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildVoiceStates,
	],
});

bot.rest.setToken(TOKEN);

async function main() {
	try {
		bot.slashCommand = new Collection();
		await registerCommands(bot, "../commands");
		// console.log(bot.slashCommand);
		const slashCommandsJson = bot.slashCommand.map((cmd) =>
			cmd.getSlashCommandJSON()
		);
		await bot.rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), {
			body: slashCommandsJson,
		});
		const registeredSlashCommands = await bot.rest.get(
			Routes.applicationGuildCommands(APP_ID, GUILD_ID)
		);
		// console.log (registeredSlashCommands)
		await bot.login(TOKEN);
	} catch (err) {
		console.log(err);
	}
}

bot.on("interactionCreate", (interaction) => {
	if (interaction.isChatInputCommand()) {
		const { commandName } = interaction;
		const cmd = bot.slashCommand.get(commandName);
		if (cmd) {
			cmd.run(bot, interaction);
		} else {
			interaction.reply("command has no run method");
		}
	}
});

// log "ready" when bot is ready
bot.on("ready", () => {
	console.log("bot ready");
});
bot.on("messageCreate", (message) => {
	if (message.author.bot) return;
});

main();
