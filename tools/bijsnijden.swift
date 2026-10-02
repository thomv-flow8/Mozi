// Snijdt doorzichtige randen van een PNG weg (en schaalt optioneel naar een maximale breedte).
// Gebruik: swift tools/bijsnijden.swift <invoer.png> <uitvoer.png> [maxBreedte]
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
guard a.count >= 3,
      let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil),
      let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
  print("Gebruik: swift bijsnijden.swift <invoer.png> <uitvoer.png> [maxBreedte]"); exit(1)
}
let w = img.width, h = img.height
var px = [UInt8](repeating: 0, count: w * h * 4)
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                    space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))

// Grenzen van de zichtbare pixels zoeken (alfa boven de ruisdrempel).
var minX = w, minY = h, maxX = -1, maxY = -1
for y in 0..<h {
  for x in 0..<w where px[(y * w + x) * 4 + 3] > 8 {
    if x < minX { minX = x }; if x > maxX { maxX = x }
    if y < minY { minY = y }; if y > maxY { maxY = y }
  }
}
guard maxX >= minX, maxY >= minY else { print("Geen zichtbare pixels gevonden"); exit(1) }

// CoreGraphics tekent van linksonder; cropping gaat per pixelrij van bovenaf.
let rect = CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
guard let bij = img.cropping(to: CGRect(x: rect.minX, y: CGFloat(h) - rect.maxY,
                                        width: rect.width, height: rect.height)) else {
  print("Bijsnijden mislukt"); exit(1)
}

var uit = bij
if a.count >= 4, let maxB = Int(a[3]), bij.width > maxB {
  let nh = Int((Double(bij.height) / Double(bij.width) * Double(maxB)).rounded())
  let sctx = CGContext(data: nil, width: maxB, height: nh, bitsPerComponent: 8, bytesPerRow: 0,
                       space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  sctx.interpolationQuality = .high
  sctx.draw(bij, in: CGRect(x: 0, y: 0, width: maxB, height: nh))
  uit = sctx.makeImage()!
}

let out = URL(fileURLWithPath: a[2]) as CFURL
guard let dest = CGImageDestinationCreateWithURL(out, UTType.png.identifier as CFString, 1, nil) else {
  print("Kan niet schrijven"); exit(1)
}
CGImageDestinationAddImage(dest, uit, nil)
CGImageDestinationFinalize(dest)
print("\(a[2]): \(uit.width)×\(uit.height) (was \(w)×\(h))")
