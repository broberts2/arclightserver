export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		try {
			if (transforms.restrictions(io, socket, msg)) return;
			const model = await modules._models.model.findOne({ _id: msg._id });
			const records = await modules._models.model[
				msg.search || !msg._id ? "updateMany" : "updateOne"
			](
				msg.search ? msg.search : msg._id ? { _id: msg._id } : {},
				transforms.reduce(msg, model)
			);
			io.to(socket.id).emit(`updatedatamodels`, {
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
