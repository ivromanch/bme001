{\rtf1\ansi\ansicpg1252\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import axios from "axios";\
import crypto from "crypto";\
\
const TINKOFF_URL = "https://securepay.tinkoff.ru/v2";\
const TERMINAL_KEY = process.env.TINKOFF_TERMINAL_KEY;\
const PASSWORD = process.env.TINKOFF_PASSWORD;\
\
function sign(data) \{\
  const payload = \{ ...data, Password: PASSWORD \};\
  const sorted = Object.keys(payload)\
    .sort()\
    .reduce((acc, key) => (\{ ...acc, [key]: payload[key] \}), \{\});\
  const str = Object.values(sorted).join("");\
  return crypto.createHash("sha256").update(str).digest("hex");\
\}\
\
export async function createPayment(\{ amountKopecks, orderId, description \}) \{\
  const payload = \{\
    TerminalKey: TERMINAL_KEY,\
    Amount: amountKopecks,\
    OrderId: orderId,\
    Description: description\
  \};\
  const Token = sign(payload);\
  const \{ data \} = await axios.post(`$\{TINKOFF_URL\}/Init`, \{\
    ...payload,\
    Token\
  \});\
  if (!data.Success) \{\
    throw new Error(data.Message || "Tinkoff init failed");\
  \}\
  return \{ paymentUrl: data.PaymentURL, paymentId: data.PaymentId \};\
\}\
\
export function verifyNotification(body) \{\
  const \{ Token, ...rest \} = body;\
  const expected = sign(rest);\
  return Token && Token.toLowerCase() === expected.toLowerCase();\
\}}