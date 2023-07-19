module.exports = (t: string | number) => {
	if (t === "text") return 0;
	else if (t === "voice") return 2;
	return typeof t === "string" ? 0 : t;
};
