const Discord = require('discord.js');
const config = require('../config.json');
const { client } = require('../index');

/**@param {Discord.Message} message @param {String[]} args*/
module.exports = async (message, args) => {

    if (message.channel.id !== config.host_channel_id) {
        // If the command isn't ran in the host channel, do nothing.
        return;
    }

    // Get customRole for pinging later
    const customRole = message.guild.roles.cache.get(config.custom_role_id);

    const emojiCharacters = require('../emojiCharacters.js');
    /**@type {Discord.TextChannel} */
    const host_channel = client.channels.cache.get(config.host_channel_id);
    /**@type {Discord.TextChannel} */
    const games_channel = client.channels.cache.get(config.games_channel_id);
    let timer = config.default_timer;
    let timerText = '';

    // Set up the message as an embed, ready to post
    let mapChoices = [];

    args.forEach(function (arg, i) {
        args[i] = arg.toLowerCase();
    });

    if (args.length > 0) {
        if (parseInt(args[args.length - 1]) || args[args.length - 1] == 0) {
            timer = parseInt(args[args.length - 1]);
            args.splice(args.length - 1, 1);
        }
        if (isNaN(timer)) {
            host_channel.send(new Discord.MessageEmbed()
                .setColor(0xff0000)
                .setTitle('Error!')
                .setDescription('Minutes is missing or not a number!')
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).catch(console.error);
            return;
        }
        if (args[0] === 'wm') args[0] = 'warmode';
    }

    if (timer == 1)
        timerText = 'minute';
    else
        timerText = 'minutes';
    if (args.length > 0) {
        if (args[0] !== 'all' && args[0] !== 'warmode') {
            if (args.some(map => map.includes('erangel')))
                mapChoices.push(`${emojiCharacters['Erangel']} for Erangel`);
            if (args.some(map => map.includes('miramar')))
                mapChoices.push(`${emojiCharacters['Miramar']} for Miramar`);
            if (args.some(map => map.includes('sanhok')))
                mapChoices.push(`${emojiCharacters['Sanhok']} for Sanhok`);
            if (args.some(map => map.includes('vikendi')))
                mapChoices.push(`${emojiCharacters['Vikendi']} for Vikendi`);
        }
        else if (args[0] === 'warmode') {
            if (!args.some(map => ['erangel', 'miramar', 'sanhok', 'vikendi'].includes(map)))
                mapChoices = [
                    `${emojiCharacters['Erangel']} for Erangel`,
                    `${emojiCharacters['Miramar']} for Miramar`,
                    `${emojiCharacters['Sanhok']} for Sanhok`,
                    `${emojiCharacters['Vikendi']} for Vikendi`,
                    `${emojiCharacters['Jackal']} for Camp Jackal`
                ];
            else {
                if (args.some(map => map.includes('erangel')))
                    mapChoices.push(`${emojiCharacters['Erangel']} for Erangel`);
                if (args.some(map => map.includes('miramar')))
                    mapChoices.push(`${emojiCharacters['Miramar']} for Miramar`);
                if (args.some(map => map.includes('sanhok')))
                    mapChoices.push(`${emojiCharacters['Sanhok']} for Sanhok`);
                if (args.some(map => map.includes('vikendi')))
                    mapChoices.push(`${emojiCharacters['Vikendi']} for Vikendi`);
                if (args.some(map => map.includes('jackal')))
                    mapChoices.push(`${emojiCharacters['Jackal']} for Camp Jackal`);
            }
        }
        else
            mapChoices = [
                `${emojiCharacters['Erangel']} for Erangel`,
                `${emojiCharacters['Miramar']} for Miramar`,
                `${emojiCharacters['Sanhok']} for Sanhok`,
                `${emojiCharacters['Vikendi']} for Vikendi`,
            ];
    }
    else
        mapChoices = [
            `${emojiCharacters['Erangel']} for Erangel`,
            `${emojiCharacters['Miramar']} for Miramar`,
            `${emojiCharacters['Sanhok']} for Sanhok`,
            `${emojiCharacters['Vikendi']} for Vikendi`,
        ];

    if (timer == 0) {
        games_channel.send(new Discord.MessageEmbed()
            .setColor(0x3366ff)
            .setTitle('Random map selection')
            .setDescription('The map for the next game will be chosen randomly out of the choices provided')
            .addField('Choices', mapChoices.join('\n'), true)
            .addField('Selection', mapChoices[Math.floor(Math.random() * Math.floor(mapChoices.length))], true)
            .setTimestamp()
            .setFooter('', client.user.displayAvatarURL())
        ).catch(console.error);
        if (config.host_channel_messages === true) {
            host_channel.send(new Discord.MessageEmbed()
                .setColor(0x3366ff)
                .setTitle('Random map selection')
                .setDescription('The map for the next game will be chosen randomly out of the choices provided')
                .addField('Choices', mapChoices.join('\n'), true)
                .addField('Selection', mapChoices[Math.floor(Math.random() * Math.floor(mapChoices.length))], true)
                .setTimestamp()
                .setFooter('', client.user.displayAvatarURL())
            ).catch(console.error);
        }
    }
    else {
        try {
            await games_channel
                .send(new Discord.MessageEmbed()
                    .setColor(0x3366ff)
                    .setTitle('Vote for map!')
                    .setDescription('Please vote on the map for the next game!')
                    .addField('Choose a reaction', mapChoices.join('\n'))
                    .addField('Vote will close in', `${timer} ${timerText}`)
                    .setTimestamp()
                    .setFooter('', client.user.displayAvatarURL())
                )
                .then(async embedMessage => {
                    /**@param {Discord.MessageReaction} reaction @param {Discord.User} user*/
                    const filter = (reaction, user) => reaction.users.cache.has(client.user.id);
                    const collector = embedMessage.createReactionCollector(filter);
                    if (args.length > 0) {
                        if (args[0] !== 'all' && args[0] !== 'warmode') {
                            if (args.some(map => map.includes('erangel')))
                                await embedMessage.react(emojiCharacters['Erangel']);
                            if (args.some(map => map.includes('miramar')))
                                await embedMessage.react(emojiCharacters['Miramar']);
                            if (args.some(map => map.includes('sanhok')))
                                await embedMessage.react(emojiCharacters['Sanhok']);
                            if (args.some(map => map.includes('vikendi')))
                                await embedMessage.react(emojiCharacters['Vikendi']);
                        }
                        else if (args[0] === 'warmode') {
                            if (!args.some(map => ['erangel', 'miramar', 'sanhok', 'vikendi'].includes(map))) {
                                await embedMessage.react(emojiCharacters['Erangel']);
                                await embedMessage.react(emojiCharacters['Miramar']);
                                await embedMessage.react(emojiCharacters['Sanhok']);
                                await embedMessage.react(emojiCharacters['Vikendi']);
                                await embedMessage.react(emojiCharacters['Jackal']);
                            } else {
                                if (args.some(map => map.includes('erangel')))
                                    await embedMessage.react(emojiCharacters['Erangel']);
                                if (args.some(map => map.includes('miramar')))
                                    await embedMessage.react(emojiCharacters['Miramar']);
                                if (args.some(map => map.includes('sanhok')))
                                    await embedMessage.react(emojiCharacters['Sanhok']);
                                if (args.some(map => map.includes('vikendi')))
                                    await embedMessage.react(emojiCharacters['Vikendi']);
                                if (args.some(map => map.includes('jackal')))
                                    await embedMessage.react(emojiCharacters['Jackal']);
                            }
                        }
                        else {
                            await embedMessage.react(emojiCharacters['Erangel']);
                            await embedMessage.react(emojiCharacters['Miramar']);
                            await embedMessage.react(emojiCharacters['Sanhok']);
                            await embedMessage.react(emojiCharacters['Vikendi']);
                        }
                    }
                    else {
                        await embedMessage.react(emojiCharacters['Erangel']);
                        await embedMessage.react(emojiCharacters['Miramar']);
                        await embedMessage.react(emojiCharacters['Sanhok']);
                        await embedMessage.react(emojiCharacters['Vikendi']);
                    }
                    if (config.custom_role_ping == true) {
                        await customRole.setMentionable(true, 'Role needs to be pinged').catch(console.error);
                        await games_channel.send(`${customRole} - get voting!`).then(msg =>
                            setTimeout(function () {
                                msg.delete();
                            }, timer * 60 * 1000)
                        ).catch(console.error);
                        await customRole.setMentionable(false, 'Role no longer needs to be pinged').catch(console.error);
                    }
                    collector.on('end', reactions => {
                        let reactionID;
                        let maxCount = 0;
                        reactions.forEach(r => {
                            if (r.count > maxCount) {
                                maxCount = r.count;
                                reactionID = r.emoji.name;
                            }
                        });
                        let draws = [];
                        reactions.forEach(r => {
                            if (r.count == maxCount)
                                draws.push(r.emoji.name);
                        });
                        if (draws.length > 1)
                            reactionID = draws[Math.floor(Math.random() * Math.floor(draws.length))];
                        let winReact;

                        switch (reactionID) {
                            case emojiCharacters['Erangel']:
                                winReact = `${reactionID} for Erangel`;
                                break;
                            case emojiCharacters['Miramar']:
                                winReact = `${reactionID} for Miramar`;
                                break;
                            case emojiCharacters['Sanhok']:
                                winReact = `${reactionID} for Sanhok`;
                                break;
                            case emojiCharacters['Vikendi']:
                                winReact = `${reactionID} for Vikendi`;
                                break;
                            case emojiCharacters['Jackal']:
                                winReact = `${reactionID} for Camp Jackal`;
                        }
                        let fields = [];
                        if (draws.length > 1)
                            fields = [
                                {
                                    name: 'Draws',
                                    value: `${draws.join(' ')}`,
                                    inline: true
                                },
                                {
                                    name: 'The winning map is:',
                                    value: `${winReact}`,
                                    inline: true
                                }
                            ];
                        else
                            fields = [
                                {
                                    name: 'The winning map is:',
                                    value: `${winReact}`,
                                    inline: true
                                }
                            ];

                        embedMessage.delete();
                        games_channel.send(new Discord.MessageEmbed()
                            .setColor(0x009900)
                            .setTitle('Vote for map!')
                            .addFields(fields)
                            .setTimestamp()
                            .setFooter('', client.user.displayAvatarURL())
                        ).catch(console.error);
                        if (config.host_channel_messages === true) {
                            host_channel.send(new Discord.MessageEmbed()
                                .setColor(0x009900)
                                .setTitle('Vote for map!')
                                .addFields(fields)
                                .setTimestamp()
                                .setFooter('', client.user.displayAvatarURL())
                            ).catch(console.error);
                        }
                    });
                    const timeToVote = setTimeout(function () {
                        collector.stop();
                    }, timer * 60 * 1000);
                    // Checks if message is deleted
                    const checkIfDeleted = setInterval(function () {
                        if (embedMessage.deleted) {
                            clearTimeout(timeToVote);
                            clearInterval(checkIfDeleted);
                        }
                    }, 1000);
                });
        }
        catch (error) {
            console.log(`${error}`);
        }
    }

    // Post the message and set up the reactions
};
