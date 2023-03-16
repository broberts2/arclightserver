module.exports = async (models: any, BaseModelMod: any, publicURI: string) => {
	const permissions = await models.model.findOne({
		_type: "permissions",
	});
	if (!permissions)
		await models.model.create(
			Object.assign(
				{
					_type: "permissions",
					_system: true,
					create: {
						lookup: "profile",
						_type: "Array",
						type: Array,
						unique: true,
						required: true,
					},
					read: {
						lookup: "profile",
						_type: "Array",
						type: Array,
						unique: true,
						required: true,
					},
					edit: {
						lookup: "profile",
						_type: "Array",
						type: Array,
						unique: true,
						required: true,
					},
					delete: {
						lookup: "profile",
						_type: "Array",
						type: Array,
						unique: true,
						required: true,
					},
					img: {
						_type: "String",
						type: String,
						unique: false,
						required: false,
					},
					_app: false,
					publicread: false,
					text: "Permissions",
					icon: "shield",
					subicon: "user-shield",
					metaimg: `${publicURI}/static/defaultart/permissions.jpg`,
				},
				BaseModelMod
			)
		);
};
