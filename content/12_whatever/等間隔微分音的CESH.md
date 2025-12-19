---
tags:
  - xenharmonic
  - phrase
---

<div class="piano-hover" id="piano" data-first="32" data-last="60" data-key-width="24px" data-key-height="192px" data-volume="0.2" data-duration="1.6" data-osc-type="square"></div>

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
        [41], [45], [48], [52],
        [39.5], [45.5], [46.5], [53.5],
        [40], [43], [47], [48],
    ],
    240,
    'piano'
)">FΔ -> AdΔ -> CΔ</button>

<script src="https://oignonasappy.github.io/pianojs/v1.2.1/piano.js"></script>