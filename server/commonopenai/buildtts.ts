import path from "path";
import fs from "fs";

module.exports = (openai: any) => (API: { [key: string]: any }) => async () => {
  const speechFile = path.resolve("./speech.mp3");
  const mp3 = await API.openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: "Today is a wonderful day to build something people love!",
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
};
