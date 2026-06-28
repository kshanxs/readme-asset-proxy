module.exports = async (req, res) => {
  const { side, type } = req.query;

  // WIZARD PROFESSORS POOL (Snape + Lupin + Sirius + Dumbledore)
  const wizardPool = [
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/harry_potter/snape_lie.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/harry_potter/lupin.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/harry_potter/serius.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/harry_potter/albus_clap.gif"
  ];

  // LEFT SIDE POOL (Luffy + both Naruto GIFs)
  const leftFacingPool = [
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/anime/luffy.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/anime/naruto_rage.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/anime/naruto.gif"
  ];

  // RIGHT SIDE POOL (Itachi + Nezuko + Goku)
  const rightFacingPool = [
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/anime/itachi_mirrored.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/anime/nezuko.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/anime/goku.gif"
  ];

  let pool;
  if (type === "wizard" || side === "wizard") {
    pool = wizardPool;
  } else if (side === "right") {
    pool = rightFacingPool;
  } else {
    pool = leftFacingPool;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedGifUrl = pool[randomIndex];

  try {
    const response = await fetch(selectedGifUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Surrogate-Control", "no-store");

    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).send("Error serving GIF asset");
  }
};
