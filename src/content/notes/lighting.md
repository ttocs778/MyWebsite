---
title: Lighting
tags:
  - graphics
  - shading
updated: '2026-09-24T01:45:58.655Z'
source: Lighting
---

How a surface's final color gets computed from light hitting it. Lambert handles the matte part, Phong adds a highlight and a cheap stand-in for bounced light. Neither is physically accurate; both are still the scaffolding modern PBR is built on.

## Lambert's law
Light arriving at a surface is proportional to the cosine of the angle between the light direction and the surface normal.

Why cosine: a light beam with a fixed cross-section covers a larger patch of surface as the angle increases, so the same energy is spread thinner. The stretch factor is $1/\cos\theta$, so energy per unit area is $\cos\theta$.

Since $\text{dot}(A,B) = |A||B|\cos\theta$, two normalized vectors give the cosine directly, no trig needed.


$$
I = \text{clamp}(\mathbf{N}\cdot\mathbf{L},\ 0,\ 1)
$$


$\mathbf{N}$ = surface normal, $\mathbf{L}$ = direction *toward* the light. Diffuse means the surface scatters evenly in all directions, so the result doesn't depend on where the viewer is. That's also why Lambert alone has no highlight.

## Phong reflection model
Three light paths reaching the eye, summed:


$$
C = k_d D + k_s S + k_a A
$$


| Term | What it is |
|---|---|
| $D$ | Diffuse — Lambert, $\text{dot}(N,L)$ |
| $S$ | Specular — the highlight |
| $A$ | Ambient — a constant, faking bounced light |

$k_d, k_s, k_a$ are the material's reflectance for each. Addition is correct here because light is energy and superposes; multiplication is for a *ratio* acting on energy (texture color, the $k$ terms).

Ambient is a pure hack. Real indirect light means tracing bounces; a constant just prevents pure-black regions. It can't depend on $N$, because "arriving equally from all directions" is precisely the assumption that makes orientation irrelevant.

## Blinn-Phong specular

$$
S = \max(\text{dot}(\mathbf{H},\mathbf{N}),\ 0)^{shininess} \cdot C_{spec}, \qquad \mathbf{H} = \frac{\mathbf{V}+\mathbf{L}}{2}
$$


$\mathbf{H}$ is halfway between view and light direction. The highlight peaks when $\mathbf{V}$ aligns with $\mathbf{L}$ reflected about $\mathbf{N}$. Higher `shininess` = tighter highlight.

Unlike diffuse, this depends on $\mathbf{V}$ — move the camera and the highlight moves.

## Gouraud vs Phong shading
Different axis from the reflection model: this is about *where* you evaluate it.

- **Gouraud** — compute lighting per vertex, interpolate the resulting color. Cheap. Highlights break into visible polygon facets on low-poly meshes.
- **Phong** — interpolate the normal, compute lighting per pixel. What OpenGL does. Smooth highlights on coarse geometry.

## Code
```cpp
glm::vec3 lightVec = -glm::vec3(camera.mForward);   // headlight: hoist out of the loop

// per fragment
glm::vec3 n = glm::normalize(interpNormal);         // interpolation doesn't preserve length
float lambert = glm::clamp(glm::dot(n, lightVec), 0.f, 1.f);
float intensity = glm::min(lambert + AMBIENT, 1.f);
glm::vec3 finalColor = texColor * intensity;
```

## Gotchas
- **Normalize after interpolating the normal.** A weighted average of three unit vectors is shorter than 1, and the dot product silently stops being a cosine.
- **Clamp the dot product.** A surface facing away gives a negative value, which multiplies through into a meaningless negative color.
- **Clamp the sum too.** `lambert + ambient` reaches 1.3; `qRgb` takes 0–255 ints and overflows. The ceiling is the display's, not physics' — HDR keeps the float range and tone-maps at the end instead.
- **Missing `lightColor`** silently assumes white light. Fine until the scene has a sunset or a colored bulb.
- **Light vector and normal must be in the same space.** Object-space normals against a world-space light vector is a quiet, plausible-looking wrong answer. Transforming a normal uses the *inverse transpose* of the model matrix, not the model matrix.

## Related
[Dot product](/notes/dot-product)
[Material properties](/notes/material-properties)
[Perspective-correct interpolation](/notes/perspective-correct-interpolation)
[Rasterization](/notes/rasterization)
