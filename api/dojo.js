export default async function handler(req, res) {
  const { side } = req.query;

  // LEFT SIDE POOL (Luffy + both Naruto GIFs)
  const leftFacingPool = [
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/new/luffy.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/naruto_rage.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/new/naruto.gif"
  ];

  // RIGHT SIDE POOL (Itachi + Nezuko + Goku)
  const rightFacingPool = [
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/itachi_mirrored.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/new/nezuko.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/goku.gif"
  ];

  const pool = side === "right" ? rightFacingPool : leftFacingPool;
  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedGifUrl = pool[randomIndex];

  try {
    const response = await fetch(selectedGifUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Surrogate-Control", "no-store");

    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).send("Error serving GIF asset");
  }
}
