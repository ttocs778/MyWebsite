---
title: Material properties
tags:
  - graphics
  - shading
updated: '2026-09-24T01:48:21.517Z'
source: Material properties
---

The parameters a physically based material exposes, and what each one actually controls in the shading model. They aren't independent knobs — Base Color, Metallic, and Roughness together decide how light splits between diffuse and specular; everything past that either adds detail on top or models a different way light interacts with the surface.

## Base Color
The surface's raw color with all lighting removed — no baked shadows, no highlights, no ambient occlusion. For a dielectric it's the diffuse color; for a metal it isn't a diffuse color at all, it's repurposed as the specular reflectance at normal incidence.

**Gotcha:** painting the final look — shadows, highlights, dirt — straight into Base Color double-counts that information once real lighting is applied. It should look flat and slightly wrong in isolation.

```
finalColor ≈ BaseColor × diffuseLight + specularReflection(Roughness, Metallic, ...)
```

## Metallic
A binary switch between two reflection models, not a continuous slider in any physically real sense: 0 is a dielectric, 1 is a conductor. It decides whether light diffuses into the surface and re-emerges, or reflects entirely at the surface.

**Gotcha:** 0.5 isn't "half metal." A mid-value only makes sense as a *blend mask* between two distinct materials sharing a pixel — rust over bare steel — never as a material that's itself half-metallic.

```
reflectance   = lerp(dielectric_F0, BaseColor, Metallic)
diffuseWeight = 1 - Metallic
```

## Roughness
Microsurface irregularity, at a scale far too small to see as actual bumps. Low roughness clusters the microfacets so light bounces off tightly, reading as a small sharp highlight. High roughness scatters those normals widely into a broad, dim highlight.

**Gotcha:** Roughness reshapes the highlight, Specular resizes it. If a surface reflects too much light outright, that's a Specular/Metallic/Base Color problem — turning up Roughness to compensate just smears the same energy over a wider area.

## Specular
Sets the reflectance of a non-metal surface at normal incidence — how much incoming light bounces straight off versus scattering underneath and re-emerging as the diffuse term. The dielectric counterpart to what Base Color does for metals.

**Gotcha:** almost never worth touching without a reference value. Real dielectrics cluster tightly around 4% reflectance; pushing this without measuring the actual material usually just looks physically wrong.

## Normal Map
A tangent-space texture that perturbs the surface normal per pixel, so lighting reacts as if fine geometric detail existed, without adding a single polygon. Fakes shading, not silhouette.

Stored as RGB, each channel remapped from $[0,255]$ to $[-1,1]$ (0→-1, 255→1, 128≈0). The "flat/identity" color $(128,128,255)$ decodes to $(0,0,1)$ — a normal pointing straight out of the surface, unperturbed.

That $(0,0,1)$ is defined relative to a local coordinate system anchored at that exact point on the mesh — tangent space, also called texture space: Z = the surface normal at that point, X/Y = the tangent/bitangent, following the UV directions. **This space is different at every point on the mesh**, not one space shared by the whole object — a sphere's tangent space rotates continuously across its surface, and even a flat plane's shifts if its UVs are rotated or mirrored.

Because the sampled normal lives in this local, per-point space, it has to be transformed into object/world space before it's usable for lighting — that's the TBN matrix (Tangent, Bitangent, Normal; built per-vertex or per-triangle from the mesh's tangent data, with bitangent = [cross](/notes/cross-product)(normal, tangent)):

```
offsetNormal = TBN * sample_normal_map(uv)
```

**Gotcha:** a flipped green channel reads as caved-in geometry. Tangent-space handedness has to match the target renderer, or raised detail reads as pressed in.

## Diffuse Lighting (Lambertian)
Once you have a normal — perturbed by a normal map, or just the raw surface normal — the light contribution is the [Dot product](/notes/dot-product) with the light direction, scaled by the light's own color and the surface's base color:

```
diffuse    = max(0, dot(N, L))
finalColor = diffuse * lightColor * sampleTexture(uv)
```

Go **[Lighting](/notes/lighting)** for better details

**Gotcha:** two terms get dropped constantly. Skip `max(0, ...)` and a surface facing away from the light produces a negative dot product, which multiplies through into a negative, meaningless color. Skip `lightColor` and you've silently assumed pure white light — the moment a scene has colored lighting (sunset, firelight, colored bulbs), leaving this out means the object never picks up the light's tint, only its own texture color scaled by brightness.

## Emissive
Self-illumination that ignores scene lighting entirely — a flat color and intensity added straight to the final pixel. On its own it does nothing to the lighting of anything else in the scene.

**Gotcha:** it doesn't light the room by default. Making it actually illuminate nearby geometry needs baked GI, a real-time GI pass that reads emissive surfaces, or a paired light — turning up intensity alone won't do it.

## Opacity / Alpha
Controls transparency from fully opaque to fully see-through, paired with a blend mode that decides how the pixel composites with what's behind it.

**Gotcha:** full translucency is expensive and often the wrong tool. It needs back-to-front sorting and disables depth early-outs; a masked/cutout mode is far cheaper for a hard edge like a leaf or fence.

## Ambient Occlusion
An approximation of how much indirect light a point can receive based on how enclosed it is by nearby geometry — darkens creases and contact points.

**Gotcha:** it should darken ambient light, not everything. Multiplying full-strength AO into Base Color also darkens direct light, flattening contrast where the scene's real lighting should be doing the work.

## Subsurface Scattering
Models light entering a surface, scattering internally, and exiting elsewhere — why skin, wax, marble, and leaves look soft and slightly glowing when backlit.

**Gotcha:** it's not a cheap stand-in for Opacity. SSS is light traveling through solid material; Opacity is light passing through empty space where the surface isn't there.

## Anisotropy
Stretches the specular highlight along one tangent direction instead of scattering it round — the signature of directional micro-grooves like brushed metal or hair.

**Gotcha:** the stretch direction comes from the mesh's tangents, not a slider. Without consistent tangents (usually from UVs), the stretch direction swims or points arbitrarily.

## Clear Coat
Layers a second, independent specular response on top of the base material — a thin film like car lacquer or table varnish, with its own roughness.

**Gotcha:** linking Coat Roughness to the base Roughness erases the point of it. Coat exists to show a glossy film over a rougher base; if they're tied together, that "wet gloss over matte" effect never shows up.

## Displacement / Height
Two ways to fake surface depth from a grayscale texture. Displacement physically moves geometry along the normal. Height, used for parallax/relief mapping, shifts which texel gets sampled instead — no geometry moves.

**Gotcha:** the height-map illusion breaks exactly at silhouettes and grazing angles, where genuinely displaced geometry would show real occlusion and a height-mapped surface can't.

## Related
[Matrix composition order (SRT)](/notes/matrix-composition-order-srt)
