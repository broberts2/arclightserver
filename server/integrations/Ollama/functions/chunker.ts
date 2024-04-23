module.exports =
  (modules: { [key: string]: any }) =>
  (text: string, sentChunks: number, sentOverlap: number) => {
    const acc: Array<string> = [];
    let car: string = "";
    const ___: any = (arr: Array<string>) => {
      if (arr.length) {
        const n = arr.splice(0, sentChunks);
        acc.push(`${car} ${n.join(" ")}`.trim());
        car = n.slice(n.length - sentOverlap, n.length).join(" ");
        return ___(arr);
      }
      return acc;
    };
    return ___(modules.sentencize(text));
  };
