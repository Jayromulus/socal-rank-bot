require('dotenv').config();
const Discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const guild_members = [
  'Darkari',
  'Atkins',
  'Masive',
  'AL\'Gren',
  'Yuuki',
  'Tiramisu',
  'S3dkiller',
  'Sharia',
  'Forma',
  'Kniief',
  'Emman',
  'Suzaku',
  'Arc',
  'Jayromulus',
  'Sol',
  'Gister',
  'Winadan',
  'Daze',
  'Symothy',
  'Korse',
  'E30',
  'Frog',
  'Monkey4012',
  'Batax',
  'Enigma',
  'WonderChef',
  'Kei',
  'Bart',
  'Kiomi',
].sort();
// console.log('member runs:', memberRuns);
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"], partials: ['MESSAGE', 'REACTION', 'CHANNEL'] });
const models = require('./models');
const { Op } = require('sequelize');
const e = require('express');

let index = 0;
let playerRunsGeneral;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity('Running some test, hopefully.');
})

client.on('messageReactionAdd', async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  // Now the message has been cached and is fully available
  console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
  // The reaction is now also fully available and the properties will be reflected accurately:
  console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

client.on('messageCreate', async (message) => {
  // console.log(message);
  if (message.author.bot) return;
  if (message.channelId === process.env.CHANNEL_1 || message.channelId === process.env.CHANNEL_2) {
    if (message.content.indexOf(process.env.PREFIX) !== 0) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let playerInfo;
    // if (command === 'ping') {
    //   message.channel.send('Pong.');
    // }
    if (command === 'rank') {
      playerRunsGeneral = await models.Team.findAll({ where: { member: { [Op.iLike]: `%${args[0]}%` } } })
      
      // console.log('playerRuns',playerRunsGeneral, args[0]);

      switch (args.length) {
        case 0:
          message.channel.send('No player input');
          break;
        case 1:
          // find all things accorgind to player (each month and score)
          playerInfo = await models.Rank.findAll({ where: { player: { [Op.iLike]: `%${args[0]}%` } }, order: [['createdAt', 'DESC']] })
          // console.log(playerInfo);
          if (playerInfo[0]) {
            const exampleEmbed = newEmbed(playerInfo[index], findDamage(playerRunsGeneral, playerInfo[index].month), playerInfo.length)

            // const msg = await message.channel.send({ embeds: [exampleEmbed] })
            const backId = 'back'
            const forwardId = 'forward'
            const backButton = new MessageButton({
              style: 'SECONDARY',
              label: 'Newer',
              emoji: '⬅️',
              customId: backId
            })
            const forwardButton = new MessageButton({
              style: 'SECONDARY',
              label: 'Older',
              emoji: '➡️',
              customId: forwardId
            })

            const msg = await message.channel.send({
              embeds: [exampleEmbed],
              components: playerInfo.length === 1
                ? []
                : [new MessageActionRow({ components: [forwardButton] })]
            })

            if (playerInfo.length === 0) return

            // Collect button interactions (when a user clicks a button),
            // but only when the button as clicked by the original message author
            const collector = msg.createMessageComponentCollector({
              filter: ({ user }) => true
            })

            let currentIndex = index
            collector.on('collect', async interaction => {
              // Increase/decrease index
              interaction.customId === backId ? (currentIndex -= 1) : (currentIndex += 1)
              // Respond to interaction by updating message with new embed
              await interaction.update({
                embeds: [newEmbed(playerInfo[currentIndex], findDamage(playerRunsGeneral, playerInfo[currentIndex].month), playerInfo.length)],
                components: [
                  new MessageActionRow({
                    components: [
                      // back button if it isn't the start
                      ...(currentIndex ? [backButton] : []),
                      // forward button if it isn't the end
                      ...(currentIndex + 1 < playerInfo.length ? [forwardButton] : [])
                    ]
                  })
                ]
              })
            })
          }
          break;
        case 2:
          // find rank of player in year
          playerInfo = await models.Rank.findAll({ where: { player: { [Op.iLike]: `%${args[0]}%` }, year: args[1] }, order: [['createdAt', 'DESC']] })
          if (playerInfo[0]) {
            const exampleEmbed = newEmbed(playerInfo[index],findDamage(playerRunsGeneral, playerInfo[index].month), playerInfo.length)


            const backId = 'back'
            const forwardId = 'forward'
            const backButton = new MessageButton({
              style: 'SECONDARY',
              label: 'Newer',
              emoji: '⬅️',
              customId: backId
            })
            const forwardButton = new MessageButton({
              style: 'SECONDARY',
              label: 'Older',
              emoji: '➡️',
              customId: forwardId
            })

            const msg = await message.channel.send({
              embeds: [exampleEmbed],
              components: playerInfo.length === 1
                ? []
                : [new MessageActionRow({ components: [forwardButton] })]
            })

            if (playerInfo.length === 0) return

            // Collect button interactions (when a user clicks a button),
            // but only when the button as clicked by the original message author
            const collector = msg.createMessageComponentCollector({
              filter: ({ user }) => true
            })

            let currentIndex = index
            collector.on('collect', async interaction => {
              // Increase/decrease index
              interaction.customId === backId ? (currentIndex -= 1) : (currentIndex += 1)
              // Respond to interaction by updating message with new embed
              await interaction.update({
                embeds: [newEmbed(playerInfo[currentIndex],findDamage(playerRunsGeneral, playerInfo[currentIndex].month), playerInfo.length)],
                components: [
                  new MessageActionRow({
                    components: [
                      // back button if it isn't the start
                      ...(currentIndex ? [backButton] : []),
                      // forward button if it isn't the end
                      ...(currentIndex + 1 < playerInfo.length ? [forwardButton] : [])
                    ]
                  })
                ]
              })
            })
            // msg.react('◀');
            // msg.react('▶');
          }
          break;
        case 3:
          // find rank of player in month and year
          // console.log(args);
          playerInfo = await models.Rank.findOne({ where: { player: { [Op.iLike]: `%${args[0]}%` }, month: { [Op.iLike]: `%${args[1]}%` }, year: args[2] } })
          // console.log(playerInfo);
          const exampleEmbed = newEmbed(playerInfo,findDamage(playerRunsGeneral, playerInfo.month), 1)
          const msg = await message.channel.send({ embeds: [exampleEmbed] })
          break;
        default:
          message.channel.send('Invalid input. Type `!help` for help on usage.');
      }
    }
    if (command === 'runs') {
// REWORK THIS TO HAVE NO ARGUMENTS FOR CURRENT DAY RUNS AND A MONTH YEAR TO GET SPECIFIC CB RUNS (Op.iLike %month% AND Op.includes? year)

      // const TODAY_START = new Date().setHours(0, 0, 0, 0);
      // const NOW = new Date().setHours(23.59, 59, 999);
      const NOW = new Date()
      const TODAY_START = new Date(NOW)

      TODAY_START.setDate(TODAY_START.getDate() - 1)

      NOW.setHours(9, 0, 0, 0)
      TODAY_START.setHours(8.59, 59, 59)
      let memberRuns = Array.from({ length: guild_members.length }, () => 0);

      const daily = await models.Team.findAll({
        where: {
          createdAt: {
            [Op.gte]: TODAY_START,
            [Op.lte]: NOW
          },
        },
      });

      daily.forEach(run => {
        if (!run.overkill) {
          const index = guild_members.findIndex(el => el === run.member);
          // console.log('run:', index);
          memberRuns[index]++;
        }
      })

      let runTotals = guild_members.map((member, i) => {
        const index = guild_members.findIndex(el => el === member);
        return ({ name: member, value: `${memberRuns[index]}/3`, inline: true });
      })

      let runs = runEmbed(runTotals, 0);

      const backId = 'back'
      const forwardId = 'forward'
      const backButton = new MessageButton({
        style: 'SECONDARY',
        label: 'Back',
        emoji: '⬅️',
        customId: backId
      })
      const forwardButton = new MessageButton({
        style: 'SECONDARY',
        label: 'Forward',
        emoji: '➡️',
        customId: forwardId
      })


      const canFitOnOnePage = guild_members.length <= 15
      const embedMessage = await message.channel.send({
        embeds: [runs],
        components: canFitOnOnePage
          ? []
          : [new MessageActionRow({ components: [forwardButton] })]
      })
      // Exit if there is only one page of guilds (no need for all of this)
      if (canFitOnOnePage) return

      // Collect button interactions (when a user clicks a button),
      // but only when the button as clicked by the original message author
      const collector = embedMessage.createMessageComponentCollector({
        filter: ({ user }) => true
      })

      let currentIndex = 0
      collector.on('collect', async interaction => {
        // Increase/decrease index
        interaction.customId === backId ? (currentIndex -= 15) : (currentIndex += 15)
        // Respond to interaction by updating message with new embed
        await interaction.update({
          embeds: [runEmbed(runTotals, currentIndex)],
          components: [
            new MessageActionRow({
              components: [
                // back button if it isn't the start
                ...(currentIndex ? [backButton] : []),
                // forward button if it isn't the end
                ...(currentIndex + 15 < guild_members.length ? [forwardButton] : [])
              ]
            })
          ]
        })
      })
    }

    // rework the channel check to only allow rank in certain channels but it will 
    // make a command that will give you the team that does the most damage against a specific boss on a given lap for cb
    // then make it so that it will list all teams used against a specific boss and cycle through them

    if (command === 'help') {
      message.channel.send('Commands are: \n\n Find rank of one player ```!rank <playerName>``` \n Find rank of player in year ```!rank <playerName> <year>``` \n Find rank of player in specific cb ```!rank <playerName> <month> <year>```');
    }
  }
})

function newEmbed(info, damage, length) {
  return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(info.player)
    // .setURL('https://discord.js.org/')
    // .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
    // .setDescription('Some description here')
    // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
      // { name: 'Regular field title', value: 'Some value here' },
      // { name: '\u200B', value: '\u200B' },
      { name: 'CB', value: `${info.month} ${info.year}`, inline: true },
      { name: 'Rank', value: `${info.rank}`, inline: true },
      { name: 'Score', value: `${info.score}`, inline: true },
      { name: '\u200B', value: `\u200B`, inline: true },
      { name: '\u200B', value: `\u200B`, inline: true },
      { name: 'Damage', value: `${damage !== 0 ? damage : '*unavailable*'}`, inline: true }
    )
    // .addField('Inline field title', 'Some value here', true)
    // .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter('Use the buttons to scroll the results');
}

function runEmbed(totals, start) {
  let displayFields = [];
  // console.log(totals, start);
  for (let i = start; i < (start + 15); i++) {
    // console.log('loop:', totals);
    if (totals[i] !== undefined)
      displayFields.push(totals[i])
  }
  // console.log(displayFields);
  return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Member Runs')
    // .setURL('https://discord.js.org/')
    // .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
    // .setDescription('Some description here')
    // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
      // { name: 'Regular field title', value: 'Some value here' },
      // { name: '\u200B', value: '\u200B' },
      displayFields
    )
    // .addField('Inline field title', 'Some value here', true)
    // .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
  // .setFooter('Use the emoted to filter the results');
}

function findDamage(runs, month) {
  // console.log(runs[runs.length-1].cb.includes(month), runs[0].damage);
  // console.log('Damage:',runs.filter(r => r.cb.includes(month)).reduce((a,b) => {a?.damage + b?.damage}, 0));
  let temp = runs.filter(r => {console.log(r.cb.includes(month)); return r.cb.includes(month)})
  // console.log('runs',runs.length);
  // console.log('temp',temp.length);
  // console.log(temp[0]?.damage);
  // console.log(temp[0]);
  let test = temp.reduce((a,b) => a + b.damage, 0)
  // console.log(test);
  return test
}

// client.on('messageReactionAdd', async (react_orig, user) => {
//   if(react_orig.message.author.id === user.id) return;
//   // when the app loads, make it so that the current index is the last spot on the array, forward resets to the first spot
//   // react_orig.message.channel.send('if this going the right place?')
//   console.log(react_orig);
// })

client.login(process.env.TOKEN);