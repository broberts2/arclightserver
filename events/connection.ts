const timeout = (callback: any, io: any, socket: any) => {
	try {
		callback();
	} catch (e: any) {
		console.log(e);
		io.to(socket.id).emit(`servererror`, {
			code: 500,
			msg: e.message,
		});
	}
};

export default (
	io: { [key: string]: any },
	operations: { [key: string]: any }
) =>
	io.on("connection", (socket: { [key: string]: any }) => {
		//
		// needs future auth logic here
		//
		const calls: { [key: string]: any } = {
			getdatamodels: true,
			createdatamodels: true,
			updatedatamodels: true,
			deletedatamodels: true,
			getrecords: ["user", "profile", "permissions", "settings"],
			createrecords: ["user", "profile", "permissions", "settings"],
			updaterecords: ["user", "profile", "permissions", "settings"],
			deleterecords: ["user", "profile", "permissions", "settings"],
		};
		socket.on("join", () => operations._init(io, socket, calls));
		Object.keys(calls).map((k) =>
			Array.isArray(calls[k])
				? calls[k].map((type: string) =>
						socket.on(`${k}_${type}`, (msg: { [key: string]: any }) =>
							timeout(
								() => operations[k](io, socket)({ ...msg, _model: type }),
								io,
								socket
							)
						)
				  )
				: socket.on(k, (msg: { [key: string]: any }) =>
						timeout(() => operations[k](io, socket)(msg), io, socket)
				  )
		);
	});
