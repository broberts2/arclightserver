module.exports =
  (modules: { [key: string]: any }) =>
  async (Settings: any, msg: { [key: string]: any }) => {
    try {
      const uri = Settings.settings.redirect_uri.split("://");
      const res = await modules
        .fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          body: new URLSearchParams({
            client_id: Settings.apivalues.client_id,
            client_secret: Settings.apivalues.client_secret,
            grant_type: "authorization_code",
            redirect_uri: `${uri[0]}://${
              msg.subdomain ? `${msg.subdomain}.` : ""
            }${uri[1]}`,
            code: msg.code,
            scope: "the scopes",
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res: any) => res.json());
      const user = await modules
        .fetch("https://discord.com/api/users/@me", {
          headers: {
            authorization: `Bearer ${res.access_token}`,
          },
        })
        .then((res: any) => res.json());
      return user;
    } catch (e) {
      console.log(e);
    }
  };
