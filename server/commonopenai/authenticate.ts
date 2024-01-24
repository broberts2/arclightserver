module.exports =
  (openai: any) => (API: { [key: string]: any }) => async (apiKey: string) => {
    API.openai = new openai({ apiKey });
  };
