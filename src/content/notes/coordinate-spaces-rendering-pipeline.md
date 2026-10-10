---
title: Coordinate spaces (rendering pipeline)
tags:
  - graphics
updated: '2026-09-23T22:21:38.874Z'
source: Coordinate spaces (rendering pipeline)
---

The five coordinate spaces a vertex passes through between the scene and the screen, and the exact matrix or formula that moves it each direction. Ordered here to match the actual rendering pipeline: World → Camera → Clip → Screen → Pixel.

## The five spaces, in rendering order
<img src="/notes-img/pasted-image-20260921144754.webp" alt="" width="1285" height="952" loading="lazy" decoding="async" />

## Step 1: World → Camera Space
`View_Mat * P` — the camera's own world transform, inverted, so that after this the camera sits at the origin looking down a fixed axis. Reverse: `View_Mat⁻¹ * P`.
<img src="/notes-img/pasted-image-20260922233053.webp" alt="" width="599" height="237" loading="lazy" decoding="async" />

**Why the order is `Rᵀ * T⁻¹`**: the view matrix moves the world, not the camera. Placing the camera in the world is `T * R`; the view matrix undoes that, and inverting a product reverses the order:


$$
V = (TR)^{-1} = R^{-1}T^{-1} = R^{T}T^{-1}
$$


So orientation ends up on the left. `R` is orthonormal, so `R⁻¹ = Rᵀ` — just write the camera axes as rows instead of columns. Multiplied out, the fourth column is `-dot(axis, eye)`, not `-eye`, because the translation is expressed in the camera axes. See [Matrix composition order (SRT)](/notes/matrix-composition-order-srt) for the right-to-left rule this inverts.

## Step 2: Camera → Clip Space
`Proj_Mat * P` — encodes the field of view and near/far planes, and sets up $w_k = z_c$ (clip-space w is just a copy of camera-space depth, carried along purely so the next step has something to divide by). Reverse: `Proj_Mat⁻¹ * P`.

<img src="/notes-img/pasted-image-20260923182111.webp" alt="" width="302" height="216" loading="lazy" decoding="async" />
**Sign-convention note**: some derivations write $w_c = -z_v$ instead (right-handed view space, camera looking down $-z$, so visible points have negative $z_v$ and the negation keeps $w$ positive). Whether you need the negative sign depends on how your source already defines $z_c$ — check before assuming one form is wrong. See [Clipping](/notes/clipping) for where this actually comes from in the projection matrix.

**Between this step and the next, clipping happens** — triangles are cut against the frustum boundaries while still in clip space, before anything is divided. See [Clipping](/notes/clipping) for why this order is mandatory, not just convention.

## Step 3: Clip → Screen Space (perspective divide)

$$
P_{screen} = P_{clip} / w_k
$$

The step that actually creates the perspective effect. Reverse: `P *= wk`. See [Perspective-correct interpolation](/notes/perspective-correct-interpolation) for why this divide distorts linearity in screen space, and how rasterization corrects for it when interpolating attributes.

## Step 4: Screen → Pixel Space (viewport transform)

$$
x_p = \frac{x_s + 1}{2} \times \text{width}, \qquad y_p = \frac{1 - y_s}{2} \times \text{height}
$$


Reverse:

$$
x_s = \frac{x_p}{\text{width}} \times 2 - 1, \qquad y_s = 1 - \frac{y_p}{\text{height}} \times 2
$$


**Why y flips here**: NDC's y increases upward (math convention), pixel space's y increases downward (row 0 is the top of the screen) — this is the one step where that flip is actually applied.

## Gotcha
Rasterization (both coverage-test methods) operates in **pixel space** — the final destination of this whole pipeline, it needs actual pixel coordinates to compare against. But the w value from before the perspective divide (Step 3) has to be preserved and carried through anyway, because attribute interpolation (perspective-correct interpolation) needs it even though the coverage test itself doesn't.

## Related
[Perspective-correct interpolation](/notes/perspective-correct-interpolation)
[Rasterization](/notes/rasterization)
[Clipping](/notes/clipping)
