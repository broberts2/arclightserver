const restrictions = (io: any, socket: any, msg: any) => {
	if (msg.username === "administrator")
		return io.to(socket.id).emit(`servererror`, {
			msg: `The username 'administrator' is reserved and cannot be set.`,
			code: 403,
		});
};

export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		try {
			if (msg._model === "user" && msg.username === "administrator") {
				delete msg.username;
				delete msg.profiles;
			}
			if (restrictions(io, socket, msg)) return;
			const updateObj: { [key: string]: any } = {};
			Object.keys(msg).map((k: string) =>
				k.slice(0, 1) !== "_" ? (updateObj[k] = msg[k]) : null
			);
			const records = await modules._models.model[
				msg.search || !msg._id ? "updateMany" : "updateOne"
			](msg.search ? msg.search : msg._id ? { _id: msg._id } : {}, updateObj);
			io.to(socket.id).emit(`${name}_${msg._model}`, {
				[msg._model]: records,
				_triggerFetch: true,
			});
			io.to(socket.id).emit(`serversuccess`, {
				code: 202,
				msg: `Update successful.`,
			});
		} catch (e: any) {
			io.to(socket.id).emit(`servererror`, {
				code: 500,
				msg: e.message,
			});
		}
	};
