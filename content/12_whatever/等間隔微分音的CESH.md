---
tags:
  - xenharmonic
  - phrase
---

<div class="piano-hover" id="piano" data-first="36" data-last="72" data-key-width="24px" data-key-height="192px" data-volume="0.3" data-duration="1.6" data-osc-type="square"></div>

<button onclick="sequencer(
    (value) => {
        playKeys('piano', value);
    },
    [
        1/12, 1/12, 1/12, 1/4,
        1/12, 1/12, 1/12, 1/4,
        1/12, 1/12, 1/12, 1/4,
    ],
    [
        [53, 52.9], [57, 56.9], [60, 59.9], [64, 63.9],
        [51.5, 51.4], [57.5, 57.4], [58.5, 58.4], [65.5, 65.4],
        [52, 51.9], [55, 54.9], [59, 58.9], [60, 59.9],
    ],
    240,
    'piano'
)">FΔ -> AdΔ -> CΔ</button>

<script src="https://oignonasappy.github.io/pianojs/v1.2.1/piano.js"></script>