const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
const { text } = require('telegraf');
require('dotenv').config() 
const non = require('./const')
const bot = new Telegraf(process.env.BOT_TOKEN)


// start
bot.command('start', async (ctx) => {
  try {
    const channels = ['@zrschannell']
    const user = ctx.from.id
    const buttons = []

    let subscribedToAll = true

    for (let i = 0; i < channels.length; i++) {
      const result = await ctx.telegram.getChatMember(channels[i], user)

      if (result.status === 'member' || result.status === 'creator' || result.status === 'administrator') {
     
      } else {
        subscribedToAll = false
        buttons.push([Markup.button.url(`Подписаться на ${channels[i]}`, `https://t.me/${channels[i].slice(1)}`)])
      }
    }

    if (subscribedToAll) {
      await ctx.replyWithHTML('<b>Что вы хотели посмотреть </b>', Markup.inlineKeyboard(
        [
            [Markup.button.callback('Кино','btn_1')],
            [Markup.button.callback('Аниме','btn_2')],
            [Markup.button.callback('Мультик','btn_3')],
            
        ]
      ))
    } else {
      await ctx.replyWithHTML(`<b>Чтобы узнать название вашего кино, аниме или мультика. Сначала подпишитесь на эти каналы:</b>`,
        Markup.inlineKeyboard(buttons))
    }
  } catch (error) {
    console.error(error)
    ctx.reply('Произошла ошибка при проверке подписки. Попробуйте еще раз позже.')
  }
})


// help

bot.help((ctx) => ctx.reply(non.commands));


// add action on zrskino

function addActionBotKino(name,src){
  bot.action(name,async (ctx) =>{
      try{
      await ctx.answerCbQuery()
      if(src !== false){
          await ctx.replyWithPhoto({
              source:src
          })
      }
     await ctx.replyWithHTML(`<b>Выберите номер вашего кино :</b>`,Markup.inlineKeyboard(
      [
        [Markup.button.callback('0001','btn_kino_1')],
        [Markup.button.callback('0002','btn_kino_2')],
        [Markup.button.callback('0003','btn_kino_3')],
        [Markup.button.callback('0004','btn_kino_4')],
        [Markup.button.callback('-----  Назад  -----','btn_back')],
      ]
     ))
  }catch(e){
      console.error(e)
  }
  })
}

// reply on button 'btn_1'

addActionBotKino('btn_1',false)


// add action on zrsanime

function addActionBotAnime(name,src){
  bot.action(name,async (ctx) =>{
      try{
      await ctx.answerCbQuery()
      if(src !== false){
          await ctx.replyWithPhoto({
              source:src
          })
      }
     await ctx.replyWithHTML(`<b>Выберите номер вашего Аниме :</b>`,Markup.inlineKeyboard(
      [
        [Markup.button.callback('0001','btn_anime_1')],
        [Markup.button.callback('0002','btn_anime_2')],
        [Markup.button.callback('-----  Назад  -----','btn_back')],
      ]
     ))
  }catch(e){
      console.error(e)
  }
  })
}


// reply on 'btn_2'

addActionBotAnime('btn_2',false)

// answer on buttons zrskino , zrsanime and zrsmult
function addActionBotAll(name, src, url, buttonText) {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (src !== false) {
        await ctx.replyWithPhoto({ source: src });
      }
      await ctx.replyWithHTML(`<b>Нажми на :</b> <a href="${url}">${buttonText}</a>`, {
        disable_web_page_preview: true,
      });

    } catch (e) {
      console.error(e);
    }   
  });
}


 // button back

bot.action('btn_back', async(ctx)=> {
  try{
  await ctx.answerCbQuery()
  await ctx.deleteMessage(); 

  }catch(e){
    console.error(e)
  }
})
 
addActionBotAll('btn_kino_1', './img/kino1.jpg', 'https://t.me/zrskinot/4', '🎥 Астерикс и Обеликс: Поднебесная (2023 zrs.kino)') 
addActionBotAll('btn_kino_2','./img/kino2.jfif','https://t.me/zrskinot/5', '🎥 Крик 6 Год (2023 zrs.kino)')
addActionBotAll('btn_kino_3','./img/kino3.jfif','https://t.me/zrskinot/7', '🎥Стражи Галактики 3 (zrs.kino [1080p])')
addActionBotAll('btn_kino_4','./img/kino4.jpg','https://t.me/zrskinot/9', '🎥 Ренфилд(2023) (zrs.kino [1080p])')
addActionBotAll('btn_anime_1','./img/anime1.jpg','https://t.me/zrsanime/5', 'Звёздное Дитя (1 сезон) , Год: 2023 zrs.kino')
addActionBotAll('btn_anime_2','./img/anime2.jpg','https://t.me/zrsanime/8', 'Время ниндзя(1 сезон) , Год: 2022 zrs.kino')
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


