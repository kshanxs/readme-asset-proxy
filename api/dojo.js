export default async function handler(req, res) {
  const { side } = req.query;

  // LEFT SIDE POOL (Luffy + both Naruto GIFs) - using immutable commit SHA for 100% uptime
  const leftFacingPool = [
    "https://raw.githubusercontent.com/kshanxs/kshanxs/f2fd2761f46f20ad7660fc23ddf69ba30ed5a3b6/resources/new/luffy.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/f2fd2761f46f20ad7660fc23ddf69ba30ed5a3b6/resources/naruto_rage.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/f2fd2761f46f20ad7660fc23ddf69ba30ed5a3b6/resources/new/naruto.gif"
  ];

  // RIGHT SIDE POOL (Itachi + Nezuko + Goku) - using immutable commit SHA for 100% uptime
  const rightFacingPool = [
    "https://raw.githubusercontent.com/kshanxs/kshanxs/f2fd2761f46f20ad7660fc23ddf69ba30ed5a3b6/resources/itachi_mirrored.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/f2fd2761f46f20ad7660fc23ddf69ba30ed5a3b6/resources/new/nezuko.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/f2fd2761f46f20ad7660fc23ddf69ba30ed5a3b6/resources/goku.gif"
  ];

  const pool = side === "right" ? rightFacingPool : leftFacingPool;
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
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Surrogate-Control", "no-store");

    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).send("Error serving GIF asset");
  }
}
