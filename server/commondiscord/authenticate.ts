module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (t: number) =>
		await D.login(t);

// await API.message("apis", {
// 	color: 0x0099ff,
// 	title: "Highmountain Labs",
// 	url: "https://www.google.com/",
// 	author: {
// 		name: "Highmountain Labs",
// 		iconURL:
// 			"https://static.wikia.nocookie.net/leagueoflegends/images/2/24/Kosmetische_essenz.png/revision/latest?cb=20180404131119&path-prefix=de",
// 		url: "https://discord.js.org",
// 	},
// 	thumbnail:
// 		"https://res.cloudinary.com/lmn/image/upload/c_limit,h_360,w_640/e_sharpen:100/f_auto,fl_lossy,q_auto/v1/gameskinnyc/b/l/u/blue-essence-rewards-4eff4.png",
// 	description: "Shalom!",
// 	image:
// 		"https://blog.turtlebeach.com/wp-content/uploads/2022/07/Blue-Essence-League-of-Legends.jpeg",
// 	footer: {
// 		text: "Some footer text here",
// 		iconURL: "https://i.imgur.com/AfFp7pu.png",
// 	},
// });
