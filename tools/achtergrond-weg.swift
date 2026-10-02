// Maakt de witte achtergrond rondom een product doorzichtig, zonder het product zelf aan te tasten.
// Anders dan wit-naar-transparant.swift werkt dit met een vulling vanaf de rand: alleen wit dat
// aan de buitenkant vastzit verdwijnt, dus een wit flesje in het midden blijft volledig staan.
// Gebruik: swift tools/achtergrond-weg.swift <invoer> <uitvoer.png> [drempel 0-255, standaard 238]
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
guard a.count >= 3,
      let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil),
      let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
  print("Gebruik: swift achtergrond-weg.swift <invoer> <uitvoer.png> [drempel]"); exit(1)
}
let drempel = a.count >= 4 ? (Int(a[3]) ?? 238) : 238
let w = img.width, h = img.height
var px = [UInt8](repeating: 0, count: w * h * 4)
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                    space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))

@inline(__always) func donkerste(_ i: Int) -> Int {
  Int(min(px[i * 4], min(px[i * 4 + 1], px[i * 4 + 2])))
}

// Vulling vanaf de rand over alles wat licht genoeg is.
var achtergrond = [Bool](repeating: false, count: w * h)
var stapel = [Int]()
for x in 0..<w { stapel.append(x); stapel.append((h - 1) * w + x) }
for y in 0..<h { stapel.append(y * w); stapel.append(y * w + w - 1) }
while let i = stapel.popLast() {
  if achtergrond[i] || donkerste(i) < drempel { continue }
  achtergrond[i] = true
  let x = i % w, y = i / w
  if x > 0 { stapel.append(i - 1) }
  if x < w - 1 { stapel.append(i + 1) }
  if y > 0 { stapel.append(i - w) }
  if y < h - 1 { stapel.append(i + w) }
}

// Zachte rand: pixels naast de achtergrond krijgen een alfa naar hun donkerte,
// zodat er geen harde of witte zoom om het product ontstaat.
var alfa = [Double](repeating: 1, count: w * h)
for i in 0..<(w * h) where achtergrond[i] { alfa[i] = 0 }
for y in 0..<h {
  for x in 0..<w {
    let i = y * w + x
    if achtergrond[i] { continue }
    var raakt = false
    for (dx, dy) in [(-1, 0), (1, 0), (0, -1), (0, 1)] {
      let nx = x + dx, ny = y + dy
      if nx < 0 || ny < 0 || nx >= w || ny >= h { continue }
      if achtergrond[ny * w + nx] { raakt = true; break }
    }
    if raakt {
      let d = Double(255 - donkerste(i)) / Double(255 - drempel + 1)
      alfa[i] = min(1, max(0, d))
    }
  }
}

for i in 0..<(w * h) {
  let A = alfa[i]
  if A <= 0 { px[i * 4] = 0; px[i * 4 + 1] = 0; px[i * 4 + 2] = 0; px[i * 4 + 3] = 0; continue }
  // premultiplied: kleur × alfa
  for k in 0..<3 { px[i * 4 + k] = UInt8((Double(px[i * 4 + k]) * A).rounded()) }
  px[i * 4 + 3] = UInt8((A * 255).rounded())
}

let uit = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                    space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!.makeImage()!
guard let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL,
                                                 UTType.png.identifier as CFString, 1, nil) else {
  print("Kan niet schrijven"); exit(1)
}
CGImageDestinationAddImage(dest, uit, nil)
CGImageDestinationFinalize(dest)
let weg = achtergrond.filter { $0 }.count
print("Klaar: \(a[2]) — \(weg * 100 / (w * h))% achtergrond verwijderd")
