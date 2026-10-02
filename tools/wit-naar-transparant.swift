// Maakt een witte achtergrond transparant ("kleur naar alfa"), zonder harde randen.
// Per pixel: alfa = grootste afstand tot wit over R/G/B; kleur wordt teruggerekend zodat
// de pixel op wit er precies hetzelfde uitziet. Zwart en gekleurde tekst blijven dus intact.
// Gebruik: swift tools/wit-naar-transparant.swift <invoer> <uitvoer.png>
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
guard a.count == 3,
      let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil),
      let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
  print("Gebruik: swift wit-naar-transparant.swift <invoer> <uitvoer.png>"); exit(1)
}
let w = img.width, h = img.height
var px = [UInt8](repeating: 0, count: w * h * 4)
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
// Eerst op wit tekenen, zodat eventuele bestaande transparantie ook als wit telt.
let ctx = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4, space: cs,
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))

for i in stride(from: 0, to: px.count, by: 4) {
  let r = Double(px[i]) / 255, g = Double(px[i+1]) / 255, b = Double(px[i+2]) / 255
  var alpha = max(1 - r, 1 - g, 1 - b)
  if alpha < 0.02 { alpha = 0 }            // bijna-wit (ruis) volledig weg
  if alpha == 0 { px[i] = 0; px[i+1] = 0; px[i+2] = 0; px[i+3] = 0; continue }
  // Oorspronkelijke kleur c = alpha*k + (1-alpha)*1  =>  k = (c - (1-alpha)) / alpha
  // Opslag is premultiplied: k*alpha = c - (1-alpha)
  func pm(_ c: Double) -> UInt8 { UInt8(max(0, min(1, c - (1 - alpha))) * 255 + 0.5) }
  px[i] = pm(r); px[i+1] = pm(g); px[i+2] = pm(b); px[i+3] = UInt8(alpha * 255 + 0.5)
}

let out = ctx.makeImage()!
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, out, nil)
CGImageDestinationFinalize(dest)
print("Klaar: \(a[2]) (\(w)x\(h))")
