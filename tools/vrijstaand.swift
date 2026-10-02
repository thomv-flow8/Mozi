// Snijdt een persoon vrij met Apple Vision (lokaal, geen externe dienst).
// Gebruik: swift tools/vrijstaand.swift <invoer> <uitvoer.png> [belichting]
// Schrijft een PNG met transparante achtergrond, licht opgefrist.
import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count >= 3 else {
    print("Gebruik: swift vrijstaand.swift <invoer> <uitvoer.png> [belichting]")
    exit(1)
}
let invoer = URL(fileURLWithPath: args[1])
let uitvoer = URL(fileURLWithPath: args[2])
let belichting = args.count > 3 ? Float(args[3]) ?? 0.12 : 0.12

guard let bron = CIImage(contentsOf: invoer, options: [.applyOrientationProperty: true]) else {
    print("Kan invoer niet lezen"); exit(1)
}

let handler = VNImageRequestHandler(ciImage: bron)
let verzoek = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([verzoek])
guard let resultaat = verzoek.results?.first else {
    print("Geen persoon gevonden"); exit(1)
}
let maskBuffer = try resultaat.generateScaledMaskForImage(forInstances: resultaat.allInstances, from: handler)
let masker = CIImage(cvPixelBuffer: maskBuffer)

// Opfrissen: iets lichter, iets meer levendigheid.
let exp = CIFilter.exposureAdjust()
exp.inputImage = bron
exp.ev = belichting
let vib = CIFilter.vibrance()
vib.inputImage = exp.outputImage
vib.amount = 0.12
let opgefrist = vib.outputImage ?? bron

let blend = CIFilter.blendWithMask()
blend.inputImage = opgefrist
blend.backgroundImage = CIImage.empty()
blend.maskImage = masker
guard let uit = blend.outputImage?.cropped(to: bron.extent) else {
    print("Samenvoegen mislukt"); exit(1)
}

let ctx = CIContext()
guard let cg = ctx.createCGImage(uit, from: bron.extent, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!) else {
    print("Renderen mislukt"); exit(1)
}
guard let dest = CGImageDestinationCreateWithURL(uitvoer as CFURL, UTType.png.identifier as CFString, 1, nil) else {
    print("Kan uitvoer niet schrijven"); exit(1)
}
CGImageDestinationAddImage(dest, cg, nil)
CGImageDestinationFinalize(dest)
print("Klaar: \(uitvoer.path) (\(cg.width)x\(cg.height))")
