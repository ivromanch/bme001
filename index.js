{\rtf1\ansi\ansicpg1252\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import "dotenv/config";\
import express from "express";\
import \{ Telegraf, Markup \} from "telegraf";\
import \{ createPayment, verifyNotification \} from "./tinkoff.js";\
\
const bot = new Telegraf(process.env.BOT_TOKEN);\
const app = express();\
app.use(express.json());\
\
// \uc0\u1042 \u1088 \u1077 \u1084 \u1077 \u1085 \u1085 \u1086 \u1077  \u1093 \u1088 \u1072 \u1085 \u1080 \u1083 \u1080 \u1097 \u1077  \u1087 \u1086 \u1083 \u1100 \u1079 \u1086 \u1074 \u1072 \u1090 \u1077 \u1083 \u1077 \u1081  \u1074  \u1087 \u1072 \u1084 \u1103 \u1090 \u1080 \
const users = \{\}; // \{ userId: \{ plan: null|"solo"|"coach", paid: false \} \}\
\
// ==== 1. START / WELCOME ====\
bot.start((ctx) => \{\
  const userId = ctx.from.id;\
  if (!users[userId]) users[userId] = \{ plan: null, paid: false \};\
\
  ctx.reply(\
    "\uc0\u1055 \u1088 \u1080 \u1074 \u1077 \u1090  \u55356 \u57151  \u1069 \u1090 \u1086  \u1073 \u1086 \u1090  \u1082 \u1091 \u1088 \u1089 \u1072  \'ab\u1043 \u1083 \u1091 \u1073 \u1080 \u1085 \u1072  \u1090 \u1077 \u1083 \u1072 : \u1078 \u1080 \u1074 \u1086 \u1090  \u1080  \u1090 \u1072 \u1079 \'bb.\\n" +\
      "\uc0\u1057 \u1085 \u1072 \u1095 \u1072 \u1083 \u1072  \u1103  \u1087 \u1086 \u1082 \u1072 \u1078 \u1091  \u1090 \u1077 \u1073 \u1077  \u1087 \u1077 \u1088 \u1074 \u1091 \u1102  \u1073 \u1077 \u1089 \u1087 \u1083 \u1072 \u1090 \u1085 \u1091 \u1102  \u1085 \u1077 \u1076 \u1077 \u1083 \u1102 , \u1095 \u1090 \u1086 \u1073 \u1099  \u1090 \u1099  \u1087 \u1088 \u1086 \u1095 \u1091 \u1074 \u1089 \u1090 \u1074 \u1086 \u1074 \u1072 \u1083  \u1092 \u1086 \u1088 \u1084 \u1072 \u1090 .\\n\\n" +\
      "\uc0\u1043 \u1086 \u1090 \u1086 \u1074 ?",\
    Markup.inlineKeyboard([\
      [Markup.button.callback("\uc0\u1044 \u1072 , \u1087 \u1086 \u1082 \u1072 \u1079 \u1072 \u1090 \u1100  1 \u1085 \u1077 \u1076 \u1077 \u1083 \u1102 ", "free_week")],\
      [Markup.button.callback("\uc0\u1055 \u1088 \u1086  \u1082 \u1091 \u1088 \u1089 ", "about")]\
    ])\
  );\
\});\
\
bot.action("about", (ctx) => \{\
  ctx.editMessageText(\
    "4 \uc0\u1085 \u1077 \u1076 \u1077 \u1083 \u1080  \u1090 \u1077 \u1083 \u1077 \u1089 \u1085 \u1099 \u1093  \u1080  \u1087 \u1089 \u1080 \u1093 \u1086 \u1089 \u1086 \u1084 \u1072 \u1090 \u1080 \u1095 \u1077 \u1089 \u1082 \u1080 \u1093  \u1087 \u1088 \u1072 \u1082 \u1090 \u1080 \u1082 :\\n" +\
      "1 \'97 \uc0\u1088 \u1072 \u1089 \u1089 \u1083 \u1072 \u1073 \u1083 \u1077 \u1085 \u1080 \u1077 \\n2 \'97 \u1072 \u1082 \u1090 \u1080 \u1074 \u1072 \u1094 \u1080 \u1103 \\n3 \'97 \u1078 \u1080 \u1076 \u1082 \u1086 \u1089 \u1090 \u1085 \u1099 \u1077  \u1090 \u1077 \u1093 \u1085 \u1080 \u1082 \u1080 \\n4 \'97 \u1080 \u1085 \u1090 \u1077 \u1075 \u1088 \u1072 \u1094 \u1080 \u1103 \\n\\n" +\
      "\uc0\u1052 \u1086 \u1078 \u1085 \u1086  \u1087 \u1088 \u1086 \u1081 \u1090 \u1080  \u1089 \u1072 \u1084 \u1086 \u1089 \u1090 \u1086 \u1103 \u1090 \u1077 \u1083 \u1100 \u1085 \u1086  \u1080 \u1083 \u1080  \u1089  \u1084 \u1086 \u1077 \u1081  \u1086 \u1073 \u1088 \u1072 \u1090 \u1085 \u1086 \u1081  \u1089 \u1074 \u1103 \u1079 \u1100 \u1102 .",\
    Markup.inlineKeyboard([[Markup.button.callback("\uc0\u1055 \u1086 \u1082 \u1072 \u1079 \u1072 \u1090 \u1100  1 \u1085 \u1077 \u1076 \u1077 \u1083 \u1102 ", "free_week")]])\
  );\
\});\
\
// ==== 2. \uc0\u1041 \u1045 \u1057 \u1055 \u1051 \u1040 \u1058 \u1053 \u1040 \u1071  \u1053 \u1045 \u1044 \u1045 \u1051 \u1071  ====\
// \uc0\u1090 \u1091 \u1090  \u1090 \u1099  \u1079 \u1072 \u1084 \u1077 \u1085 \u1080 \u1096 \u1100  sendMessage \u1085 \u1072  sendVideo \u1089  file_id\
bot.action("free_week", async (ctx) => \{\
  await ctx.answerCbQuery();\
  const chatId = ctx.chat.id;\
\
  // 1. \uc0\u1074 \u1089 \u1090 \u1091 \u1087 \u1080 \u1090 \u1077 \u1083 \u1100 \u1085 \u1086 \u1077  \u1074 \u1080 \u1076 \u1077 \u1086 \
  await ctx.reply("\uc0\u55356 \u57260  \u1042 \u1089 \u1090 \u1091 \u1087 \u1083 \u1077 \u1085 \u1080 \u1077  \u1082  1 \u1085 \u1077 \u1076 \u1077 \u1083 \u1077 :");\
  // \uc0\u1087 \u1088 \u1080 \u1084 \u1077 \u1088 : await ctx.replyWithVideo("file_id_\u1090 \u1074 \u1086 \u1077 \u1075 \u1086 _\u1074 \u1080 \u1076 \u1077 \u1086 ");\
  await ctx.reply("\uc0\u55357 \u56393  (\u1090 \u1091 \u1090  \u1073 \u1091 \u1076 \u1077 \u1090  \u1074 \u1080 \u1076 \u1077 \u1086 . \u1055 \u1086 \u1082 \u1072  \u1089 \u1089 \u1099 \u1083 \u1082 \u1072 ) https://t.me/\u1090 \u1074 \u1086 \u1081 _\u1082 \u1072 \u1085 \u1072 \u1083 /1");\
\
  // 2. \uc0\u1089 \u1093 \u1077 \u1084 \u1072  \u1087 \u1088 \u1072 \u1082 \u1090 \u1080 \u1082 \u1080 \
  await ctx.reply("\uc0\u55357 \u56536  \u1057 \u1093 \u1077 \u1084 \u1072  \u1087 \u1088 \u1072 \u1082 \u1090 \u1080 \u1082 \u1080  1 \u1085 \u1077 \u1076 \u1077 \u1083 \u1080 :\\nhttps://t.me/\u1090 \u1074 \u1086 \u1081 _\u1082 \u1072 \u1085 \u1072 \u1083 /2");\
\
  // 3. \uc0\u1087 \u1086 \u1076 \u1082 \u1072 \u1089 \u1090 \
  await ctx.reply("\uc0\u55356 \u57255  \u1055 \u1086 \u1076 \u1082 \u1072 \u1089 \u1090  \u1087 \u1088 \u1086  \u1087 \u1089 \u1080 \u1093 \u1086 \u1089 \u1086 \u1084 \u1072 \u1090 \u1080 \u1095 \u1077 \u1089 \u1082 \u1091 \u1102  \u1080  \u1072 \u1085 \u1072 \u1090 \u1086 \u1084 \u1080 \u1095 \u1077 \u1089 \u1082 \u1091 \u1102  \u1095 \u1072 \u1089 \u1090 \u1100 :\\nhttps://t.me/\u1090 \u1074 \u1086 \u1081 _\u1082 \u1072 \u1085 \u1072 \u1083 /3");\
\
  // 4. \uc0\u1084 \u1077 \u1076 \u1080 \u1090 \u1072 \u1094 \u1080 \u1103 \
  await ctx.reply("\uc0\u55357 \u56687 \u65039  \u1040 \u1091 \u1076 \u1080 \u1086 \u1084 \u1077 \u1076 \u1080 \u1090 \u1072 \u1094 \u1080 \u1103 :\\nhttps://t.me/\u1090 \u1074 \u1086 \u1081 _\u1082 \u1072 \u1085 \u1072 \u1083 /4");\
\
  // 5. \uc0\u1087 \u1088 \u1077 \u1076 \u1083 \u1086 \u1078 \u1077 \u1085 \u1080 \u1077  \u1086 \u1087 \u1083 \u1072 \u1090 \u1099 \
  await ctx.reply(\
    "\uc0\u1045 \u1089 \u1083 \u1080  \u1086 \u1090 \u1082 \u1083 \u1080 \u1082 \u1072 \u1077 \u1090 \u1089 \u1103  \u1080  \u1093 \u1086 \u1095 \u1077 \u1096 \u1100  \u1086 \u1090 \u1082 \u1088 \u1099 \u1090 \u1100  \u1074 \u1089 \u1077  4 \u1085 \u1077 \u1076 \u1077 \u1083 \u1080  \'97 \u1074 \u1099 \u1073 \u1077 \u1088 \u1080  \u1092 \u1086 \u1088 \u1084 \u1072 \u1090 :",\
    Markup.inlineKeyboard([\
      [Markup.button.callback("\uc0\u1057 \u1072 \u1084 \u1086 \u1089 \u1090 \u1086 \u1103 \u1090 \u1077 \u1083 \u1100 \u1085 \u1086  \'97 5000\u8381 ", "buy:solo")],\
      [Markup.button.callback("\uc0\u1057  \u1089 \u1086 \u1087 \u1088 \u1086 \u1074 \u1086 \u1078 \u1076 \u1077 \u1085 \u1080 \u1077 \u1084  \'97 12000\u8381 ", "buy:coach")]\
    ])\
  );\
\});\
\
// ==== 3. \uc0\u1055 \u1054 \u1050 \u1059 \u1055 \u1050 \u1040  ====\
bot.action(/buy:(.+)/, async (ctx) => \{\
  const plan = ctx.match[1]; // solo or coach\
  const userId = ctx.from.id;\
\
  const price = plan === "coach" ? 12000 : 5000;\
  const orderId = `G$\{Date.now()\}_$\{userId\}_$\{plan\}`;\
\
  try \{\
    const \{ paymentUrl \} = await createPayment(\{\
      amountKopecks: price * 100,\
      orderId,\
      description: `\uc0\u1050 \u1091 \u1088 \u1089  \u1043 \u1083 \u1091 \u1073 \u1080 \u1085 \u1072  \u1090 \u1077 \u1083 \u1072  ($\{plan\})`\
    \});\
\
    // \uc0\u1089 \u1086 \u1093 \u1088 \u1072 \u1085 \u1080 \u1084  \u1087 \u1086 \u1083 \u1100 \u1079 \u1086 \u1074 \u1072 \u1090 \u1077 \u1083 \u1103 \
    users[userId] = \{ plan, paid: false, orderId \};\
\
    await ctx.reply(\
      `\uc0\u1057 \u1091 \u1084 \u1084 \u1072 : $\{price\} \u8381 \\n\u1054 \u1087 \u1083 \u1072 \u1090 \u1072  \u1095 \u1077 \u1088 \u1077 \u1079  \u1058 -\u1041 \u1072 \u1085 \u1082 :\\n\u1053 \u1072 \u1078 \u1084 \u1080  \u1082 \u1085 \u1086 \u1087 \u1082 \u1091  \u1085 \u1080 \u1078 \u1077  \u55357 \u56391 `,\
      Markup.inlineKeyboard([[Markup.button.url("\uc0\u1054 \u1087 \u1083 \u1072 \u1090 \u1080 \u1090 \u1100 ", paymentUrl)]])\
    );\
    await ctx.reply("\uc0\u1055 \u1086 \u1089 \u1083 \u1077  \u1086 \u1087 \u1083 \u1072 \u1090 \u1099  \u1103  \u1087 \u1088 \u1080 \u1096 \u1083 \u1102  \u1089 \u1089 \u1099 \u1083 \u1082 \u1091  \u1085 \u1072  \u1076 \u1086 \u1089 \u1090 \u1091 \u1087  \u55357 \u56592 ");\
  \} catch (e) \{\
    await ctx.reply("\uc0\u1053 \u1077  \u1087 \u1086 \u1083 \u1091 \u1095 \u1080 \u1083 \u1086 \u1089 \u1100  \u1089 \u1086 \u1079 \u1076 \u1072 \u1090 \u1100  \u1087 \u1083 \u1072 \u1090 \u1105 \u1078 . \u1055 \u1086 \u1087 \u1088 \u1086 \u1073 \u1091 \u1081  \u1077 \u1097 \u1105  \u1088 \u1072 \u1079  \u1087 \u1086 \u1079 \u1078 \u1077 .");\
  \}\
\});\
\
// ==== 4. \uc0\u1059 \u1042 \u1045 \u1044 \u1054 \u1052 \u1051 \u1045 \u1053 \u1048 \u1045  \u1054  \u1055 \u1051 \u1040 \u1058 \u1045 \u1046 \u1045  \u1054 \u1058  \u1058 -\u1041 \u1040 \u1053 \u1050 \u1040  ====\
app.post("/payment/notification/tinkoff", async (req, res) => \{\
  const body = req.body;\
  const ok = verifyNotification(body);\
  if (!ok) return res.status(400).send("bad signature");\
\
  const \{ Status, Success, OrderId \} = body;\
  if (Success && Status === "CONFIRMED") \{\
    // \uc0\u1080 \u1079 \u1074 \u1083 \u1077 \u1095 \u1105 \u1084  userId \u1080  \u1090 \u1072 \u1088 \u1080 \u1092 \
    const parts = OrderId.split("_");\
    const userId = Number(parts[1]);\
    const plan = parts[2];\
\
    // \uc0\u1087 \u1086 \u1084 \u1077 \u1095 \u1072 \u1077 \u1084  \u1086 \u1087 \u1083 \u1072 \u1095 \u1077 \u1085 \u1085 \u1099 \u1084 \
    users[userId] = \{ plan, paid: true \};\
\
    // \uc0\u1096 \u1083 \u1105 \u1084  \u1076 \u1086 \u1089 \u1090 \u1091 \u1087 \u1099 \
    try \{\
      await bot.telegram.sendMessage(\
        userId,\
        "\uc0\u1054 \u1087 \u1083 \u1072 \u1090 \u1072  \u1087 \u1088 \u1086 \u1096 \u1083 \u1072  \u9989 \\n\u1042 \u1086 \u1090  \u1076 \u1086 \u1089 \u1090 \u1091 \u1087  \u1082  \u1082 \u1091 \u1088 \u1089 \u1091 :\\n" + process.env.COURSE_CHANNEL_LINK\
      );\
      if (plan === "coach") \{\
        await bot.telegram.sendMessage(\
          userId,\
          "\uc0\u1069 \u1090 \u1086  \u1095 \u1072 \u1090  \u1076 \u1083 \u1103  \u1086 \u1073 \u1088 \u1072 \u1090 \u1085 \u1086 \u1081  \u1089 \u1074 \u1103 \u1079 \u1080  \u1080  \u1087 \u1088 \u1086 \u1074 \u1077 \u1088 \u1082 \u1080  \u1087 \u1088 \u1072 \u1082 \u1090 \u1080 \u1082 :\\n" + process.env.SUPPORT_CHAT_LINK\
        );\
      \}\
      await bot.telegram.sendMessage(\
        userId,\
        "\uc0\u1053 \u1072 \u1095 \u1080 \u1085 \u1072 \u1081  \u1089 \u1086  2 \u1085 \u1077 \u1076 \u1077 \u1083 \u1080 . \u1071  \u1084 \u1086 \u1075 \u1091  \u1089 \u1076 \u1077 \u1083 \u1072 \u1090 \u1100  \u1074 \u1099 \u1076 \u1072 \u1095 \u1091  \u1087 \u1086  \u1085 \u1077 \u1076 \u1077 \u1083 \u1103 \u1084  \u1072 \u1074 \u1090 \u1086 \u1084 \u1072 \u1090 \u1080 \u1095 \u1077 \u1089 \u1082 \u1080 , \u1085 \u1086  \u1087 \u1086 \u1082 \u1072  \u1073 \u1077 \u1088 \u1080  \u1080 \u1079  \u1082 \u1072 \u1085 \u1072 \u1083 \u1072  \u55357 \u56397 "\
      );\
    \} catch (e) \{\
      console.log("cant send to user", e.message);\
    \}\
  \}\
\
  res.send("OK");\
\});\
\
// ==== 5. \uc0\u1054 \u1058 \u1047 \u1067 \u1042 \u1067  ====\
bot.command("reviews", (ctx) => \{\
  ctx.reply(\
    "\uc0\u1054 \u1090 \u1079 \u1099 \u1074 \u1099  \u1091 \u1095 \u1072 \u1089 \u1090 \u1085 \u1080 \u1082 \u1086 \u1074 :\\n\\n" +\
      "\'ab\uc0\u1055 \u1086 \u1089 \u1083 \u1077  \u1087 \u1077 \u1088 \u1074 \u1086 \u1081  \u1085 \u1077 \u1076 \u1077 \u1083 \u1080  \u1076 \u1099 \u1093 \u1072 \u1085 \u1080 \u1077  \u1089 \u1090 \u1072 \u1083 \u1086  \u1089 \u1074 \u1086 \u1073 \u1086 \u1076 \u1085 \u1099 \u1084 , \u1090 \u1077 \u1083 \u1086  \u1088 \u1072 \u1089 \u1087 \u1088 \u1072 \u1074 \u1080 \u1083 \u1086 \u1089 \u1100 .\'bb \'97 \u1040 \u1085 \u1085 \u1072 \\n" +\
      "\'ab\uc0\u1054 \u1095 \u1077 \u1085 \u1100  \u1084 \u1103 \u1075 \u1082 \u1080 \u1081  \u1092 \u1086 \u1088 \u1084 \u1072 \u1090 , \u1085 \u1086  \u1075 \u1083 \u1091 \u1073 \u1086 \u1082 \u1086 .\'bb \'97 \u1052 \u1072 \u1088 \u1080 \u1103 \\n" +\
      "\'ab\uc0\u1059 \u1096 \u1083 \u1072  \u1090 \u1103 \u1078 \u1077 \u1089 \u1090 \u1100  \u1074  \u1090 \u1072 \u1079 \u1091  \u1080  \u1078 \u1080 \u1074 \u1086 \u1090 \u1077 .\'bb \'97 \u1045 \u1083 \u1077 \u1085 \u1072 \\n\\n" +\
      "\uc0\u1061 \u1086 \u1095 \u1077 \u1096 \u1100  \u1086 \u1089 \u1090 \u1072 \u1074 \u1080 \u1090 \u1100  \u1086 \u1090 \u1079 \u1099 \u1074 ? \u1053 \u1072 \u1087 \u1080 \u1096 \u1080  \u1084 \u1085 \u1077  \u1090 \u1091 \u1090 , \u1103  \u1091 \u1074 \u1080 \u1078 \u1091  \u55357 \u56384 "\
  );\
\});\
\
// ==== 6. \uc0\u1047 \u1040 \u1055 \u1059 \u1057 \u1050  ====\
const PORT = process.env.PORT || 3000;\
\
if (!process.env.BASE_URL) \{\
  // \uc0\u1083 \u1086 \u1082 \u1072 \u1083 \u1100 \u1085 \u1086  \'97 long polling\
  bot.launch();\
  app.listen(PORT, () => console.log("Bot started locally"));\
\} else \{\
  // \uc0\u1085 \u1072  \u1089 \u1077 \u1088 \u1074 \u1077 \u1088 \u1077  \'97 \u1074 \u1077 \u1073 \u1093 \u1091 \u1082 \u1080 \
  const secretPath = `/tg-webhook/$\{process.env.BOT_TOKEN.split(":")[0]\}`;\
  app.use(secretPath, (req, res) => bot.webhookCallback(secretPath)(req, res));\
  bot.telegram.setWebhook(process.env.BASE_URL + secretPath);\
  app.listen(PORT, () => console.log("Bot started via webhook"));\
\}}