export default async function handler(req, res) {
  // Wizarding Professors pool (Snape + Lupin)
  const wizardPool = [
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/harry_potter/snape_lie.gif",
    "https://raw.githubusercontent.com/kshanxs/kshanxs/main/resources/harry_potter/lupin.gif"
  ];

  const randomIndex = Math.floor(Math.random() * wizardPool.length);
  const selectedGifUrl = wizardPool[randomIndex];

  try {
    const response = await fetch(selectedGifUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch wizard asset: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Surrogate-Control", "no-store");

    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).send("Error serving wizard GIF asset");
  }
}
