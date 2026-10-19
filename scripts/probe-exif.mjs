import exifr from "exifr";

const files = [
  "C:\\Users\\Bryce\\OneDrive\\Honey\\IMG_7808.JPEG",
  "C:\\Users\\Bryce\\OneDrive\\Honey\\IMG_4941.JPG",
  "C:\\Users\\Bryce\\OneDrive\\Honey\\scan80984.jpg",
  "C:\\Users\\Bryce\\OneDrive\\Honey\\IMG_7628.MP4",
];

for (const f of files) {
  try {
    const data = await exifr.parse(f, {
      pick: ["DateTimeOriginal","CreateDate","GPSLatitude","GPSLongitude","GPSLatitudeRef","GPSLongitudeRef","Make","Model","ImageWidth","ImageHeight"],
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
    });
    console.log("\n" + f.split("\\").pop());
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.log(f.split("\\").pop(), "ERROR:", e.message);
  }
}
