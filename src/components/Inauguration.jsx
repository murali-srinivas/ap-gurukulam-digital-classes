import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Inauguration() {
  const [searchParams] = useSearchParams();
  const showCurtain = searchParams.has('showcurtain');

  if (!showCurtain) return null;

  const [isOpen, setIsOpen] = useState(false);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  // Audio state
  const ctxRef = useRef(null);
  const crowdBufRef = useRef(null);
  const irBufRef = useRef(null);
  const masterGainRef = useRef(null);
  const DUR = 4.8;

  // Flower animation refs
  const flRef = useRef([]);
  const rafRef = useRef(0);
  const spawnUntilRef = useRef(0);
  const lastRef = useRef(0);
  const timerRef = useRef(null);

  const COLS = ['#ff4d79', '#ffb300', '#ff7043', '#ffffff', '#ff80ab', '#ffd54f', '#e53935'];

  // =========================================================
  // WEB AUDIO SYNTHESIZED APPLAUSE
  // APPLAUSE EXTENDED BY 7 SECONDS
  // =========================================================

  // IMPORTANT:
  // If your original code has something like:
  // const DUR = 8;
  // change it to:
  // const DUR = 15;
  //
  // Or, if DUR is already defined elsewhere, use:
  // const APPLAUSE_EXTRA_TIME = 7;
  // and make sure the final DUR value includes it.

  const APPLAUSE_EXTRA_TIME = 7;

  // If DUR is already declared elsewhere in your component,
  // DO NOT declare it again.
  // Instead, replace the original DUR value with:
  // const DUR = ORIGINAL_DUR + APPLAUSE_EXTRA_TIME;
  //
  // Example:
  // const DUR = 15;


  // --- Web Audio Synthesized Applause ---

  const buildCrowd = () => {

    if (!ctxRef.current) {

      const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

      if (AudioContextClass) {
        ctxRef.current =
          new AudioContextClass();
      }
    }

    const ctx = ctxRef.current;

    if (
      !ctx ||
      crowdBufRef.current
    ) {
      return;
    }


    const sr = ctx.sampleRate;
    const R = Math.random;

    // Applause duration is now the original
    // duration + 7 seconds.
    const applauseDuration =
      DUR + APPLAUSE_EXTRA_TIME;

    const N =
      Math.floor(
        sr * applauseDuration
      );


    const bank = [];


    // ---------------------------------------------------------
    // CREATE INDIVIDUAL CLAP SOUNDS
    // ---------------------------------------------------------

    for (
      let v = 0;
      v < 48;
      v++
    ) {

      const L =
        Math.floor(
          sr * 0.1
        );

      const x =
        new Float32Array(L);


      const f =
        900 +
        R() * 2800;


      const r =
        0.88 +
        R() * 0.07;


      const a1 =
        2 *
        r *
        Math.cos(
          2 *
          Math.PI *
          f /
          sr
        );


      const a2 =
        -r * r;


      const hits = [
        0,
        (
          0.003 +
          R() * 0.005
        ) *
        sr |
        0
      ];


      if (
        R() < 0.5
      ) {

        hits.push(
          (
            0.009 +
            R() * 0.006
          ) *
          sr |
          0
        );

      }


      hits.forEach(
        (h, k) => {

          for (
            let i = h;
            i < L;
            i++
          ) {

            const t =
              (i - h) /
              sr;


            x[i] +=
              (R() * 2 - 1) *
              (k ? 0.6 : 1) *
              Math.exp(
                -t / 0.008
              );

          }

        }
      );


      const y =
        new Float32Array(L);


      let y1 = 0;
      let y2 = 0;
      let pk = 0;


      for (
        let i = 0;
        i < L;
        i++
      ) {

        const t =
          i / sr;


        const o =
          x[i] * 0.35 +
          a1 * y1 +
          a2 * y2 +
          0.25 *
          Math.sin(
            2 *
            Math.PI *
            (
              300 +
              R() * 200
            ) *
            t
          ) *
          Math.exp(
            -t / 0.007
          ) *
          (
            i <
              sr * 0.03
              ? 1
              : 0
          );


        y[i] = o;


        y2 = y1;
        y1 = o;


        pk =
          Math.max(
            pk,
            Math.abs(o)
          );

      }


      for (
        let i = 0;
        i < L;
        i++
      ) {

        y[i] /=
          (pk || 1);

      }


      bank.push(y);

    }


    // ---------------------------------------------------------
    // CREATE CROWD
    // ---------------------------------------------------------

    const Lc =
      new Float32Array(N);

    const Rc =
      new Float32Array(N);


    const people = 260;


    for (
      let p = 0;
      p < people;
      p++
    ) {

      const pan =
        R() * 2 - 1;


      const gl =
        Math.cos(
          (pan + 1) *
          Math.PI /
          4
        );


      const gr =
        Math.sin(
          (pan + 1) *
          Math.PI /
          4
        );


      const vol =
        0.25 +
        R() * 0.75;


      const period =
        0.24 +
        R() * 0.2;


      let t =
        R() * 1.3;


      // IMPORTANT:
      // Crowd now continues until the
      // extended applause duration.

      const end =
        applauseDuration -
        0.2 -
        R() * 1.6;


      while (
        t < end
      ) {

        const c =
          bank[
          (R() * 48) | 0
          ];


        const g =
          vol *
          (
            0.6 +
            R() * 0.4
          );


        const st =
          (t * sr) | 0;


        for (
          let i = 0;
          i < c.length &&
          st + i < N;
          i++
        ) {

          const v =
            c[i] * g;


          Lc[
            st + i
          ] +=
            v * gl;


          Rc[
            st + i
          ] +=
            v * gr;

        }


        t +=
          period *
          (
            0.85 +
            R() * 0.3
          );

      }

    }


    // ---------------------------------------------------------
    // NORMALIZE AUDIO
    // ---------------------------------------------------------

    let pk = 0;


    for (
      let i = 0;
      i < N;
      i++
    ) {

      pk =
        Math.max(
          pk,
          Math.abs(Lc[i]),
          Math.abs(Rc[i])
        );

    }


    const k =
      0.9 /
      (pk || 1);


    for (
      let i = 0;
      i < N;
      i++
    ) {

      Lc[i] *= k;
      Rc[i] *= k;

    }


    // ---------------------------------------------------------
    // CREATE AUDIO BUFFER
    // ---------------------------------------------------------

    crowdBufRef.current =
      ctx.createBuffer(
        2,
        N,
        sr
      );


    crowdBufRef.current
      .copyToChannel(
        Lc,
        0
      );


    crowdBufRef.current
      .copyToChannel(
        Rc,
        1
      );


    // ---------------------------------------------------------
    // REVERB
    // ---------------------------------------------------------

    const irLen =
      Math.floor(
        sr * 1.8
      );


    irBufRef.current =
      ctx.createBuffer(
        2,
        irLen,
        sr
      );


    for (
      let c = 0;
      c < 2;
      c++
    ) {

      const d =
        irBufRef.current
          .getChannelData(c);


      for (
        let i = 0;
        i < irLen;
        i++
      ) {

        d[i] =
          (R() * 2 - 1) *
          Math.pow(
            1 -
            i / irLen,
            2.8
          );

      }

    }

  };


  // =========================================================
  // PLAY APPLAUSE
  // =========================================================

  const playApplause = () => {

    buildCrowd();


    const ctx =
      ctxRef.current;


    if (
      !ctx ||
      !crowdBufRef.current ||
      !irBufRef.current
    ) {
      return;
    }


    if (
      ctx.state ===
      'suspended'
    ) {

      ctx.resume();

    }


    const t0 =
      ctx.currentTime +
      0.03;


    // Extended duration
    const applauseDuration =
      DUR +
      APPLAUSE_EXTRA_TIME;


    const master =
      ctx.createGain();


    masterGainRef.current =
      master;


    // ---------------------------------------------------------
    // FADE IN
    // ---------------------------------------------------------

    master.gain
      .setValueAtTime(
        0.0001,
        t0
      );


    master.gain
      .exponentialRampToValueAtTime(
        1,
        t0 + 0.5
      );


    // ---------------------------------------------------------
    // KEEP FULL VOLUME FOR EXTENDED DURATION
    // ---------------------------------------------------------

    master.gain
      .setValueAtTime(
        1,
        t0 +
        applauseDuration -
        1.2
      );


    // ---------------------------------------------------------
    // FADE OUT
    // ---------------------------------------------------------

    master.gain
      .exponentialRampToValueAtTime(
        0.0001,
        t0 +
        applauseDuration
      );


    // ---------------------------------------------------------
    // AUDIO SOURCE
    // ---------------------------------------------------------

    const src =
      ctx.createBufferSource();


    src.buffer =
      crowdBufRef.current;


    // ---------------------------------------------------------
    // REVERB
    // ---------------------------------------------------------

    const rev =
      ctx.createConvolver();


    rev.buffer =
      irBufRef.current;


    const wet =
      ctx.createGain();


    wet.gain.value =
      0.3;


    // ---------------------------------------------------------
    // CONNECT AUDIO
    // ---------------------------------------------------------

    src.connect(master);

    master.connect(
      ctx.destination
    );

    master.connect(rev);

    rev.connect(wet);

    wet.connect(
      ctx.destination
    );


    // ---------------------------------------------------------
    // START
    // ---------------------------------------------------------

    src.start(t0);

  };


  // =========================================================
  // STOP APPLAUSE
  // =========================================================

  const stopApplause = () => {

    const ctx =
      ctxRef.current;

    const master =
      masterGainRef.current;


    if (
      master &&
      ctx
    ) {

      try {

        master.gain
          .cancelScheduledValues(
            ctx.currentTime
          );


        master.gain
          .setTargetAtTime(
            0.0001,
            ctx.currentTime,
            0.1
          );

      } catch (e) {

        // Ignore audio cancellation
        // edge cases.

      }

    }

  };


  // =========================================================
  // FALLING FLOWERS ANIMATION
  // =========================================================

  const fit = () => {

    const cv =
      canvasRef.current;

    const stage =
      stageRef.current;


    if (
      !cv ||
      !stage
    ) {
      return;
    }


    const cx =
      cv.getContext('2d');


    const d =
      window.devicePixelRatio ||
      1;


    cv.width =
      stage.clientWidth *
      d;


    cv.height =
      stage.clientHeight *
      d;


    cx.setTransform(
      d,
      0,
      0,
      d,
      0,
      0
    );

  };


  // =========================================================
  // SPAWN FLOWERS
  // =========================================================

  const spawn = () => {

    const stage =
      stageRef.current;


    if (!stage) {
      return;
    }


    const W =
      stage.clientWidth;


    const k =
      W / 1000;


    const f = {

      x:
        Math.random() * W,

      y:
        -30 * k,

      vy:
        (
          70 +
          Math.random() * 90
        ) * k,

      amp:
        (
          20 +
          Math.random() * 40
        ) * k,

      ph:
        Math.random() *
        6.28,

      sw:
        1 +
        Math.random() * 1.5,

      rot:
        Math.random() *
        6.28,

      vr:
        (
          Math.random() -
          0.5
        ) * 3,

      fp:
        Math.random() *
        6.28,

      fs:
        2 +
        Math.random() * 3,

      s:
        (
          14 +
          Math.random() * 18
        ) * k,

      c:
        COLS[
        (
          Math.random() *
          COLS.length
        ) | 0
        ],

      petal:
        Math.random() <
        0.35,

      bx:
        0

    };


    f.bx =
      f.x;


    flRef.current.push(f);

  };


  // =========================================================
  // DRAW FLOWERS
  // =========================================================

  const draw = (
    cx,
    f
  ) => {

    cx.save();


    cx.translate(
      f.x,
      f.y
    );


    cx.rotate(
      f.rot
    );


    cx.scale(
      1,
      0.45 +
      0.55 *
      Math.abs(
        Math.cos(f.fp)
      )
    );


    cx.fillStyle =
      f.c;


    cx.strokeStyle =
      'rgba(0,0,0,.18)';


    cx.lineWidth =
      1;


    if (f.petal) {

      cx.beginPath();


      cx.ellipse(
        0,
        0,
        f.s * 0.3,
        f.s * 0.55,
        0,
        0,
        6.283
      );


      cx.fill();
      cx.stroke();

    }

    else {

      for (
        let i = 0;
        i < 5;
        i++
      ) {

        cx.rotate(
          1.2566
        );


        cx.beginPath();


        cx.ellipse(
          0,
          -f.s * 0.5,
          f.s * 0.3,
          f.s * 0.5,
          0,
          0,
          6.283
        );


        cx.fill();
        cx.stroke();

      }


      cx.fillStyle =
        f.c === '#ffb300' ||
          f.c === '#ffd54f'
          ? '#e65100'
          : '#ffc107';


      cx.beginPath();


      cx.arc(
        0,
        0,
        f.s * 0.2,
        0,
        6.283
      );


      cx.fill();

    }


    cx.restore();

  };


  // =========================================================
  // FLOWER ANIMATION LOOP
  // =========================================================

  const loop = (t) => {

    const cv =
      canvasRef.current;

    const stage =
      stageRef.current;


    if (
      !cv ||
      !stage
    ) {
      return;
    }


    const cx =
      cv.getContext('2d');


    const dt =
      Math.min(
        0.05,
        (
          t -
          lastRef.current
        ) /
        1000 ||
        0.016
      );


    lastRef.current =
      t;


    const W =
      stage.clientWidth;


    const H =
      stage.clientHeight;


    cx.clearRect(
      0,
      0,
      W,
      H
    );


    if (
      t <
      spawnUntilRef.current
    ) {

      const n =
        Math.round(
          30 * dt +
          Math.random()
        );


      for (
        let i = 0;
        i < n;
        i++
      ) {

        spawn();

      }

    }


    flRef.current =
      flRef.current.filter(
        f =>
          f.y <
          H + 40
      );


    flRef.current.forEach(
      f => {

        f.y +=
          f.vy *
          dt;


        f.ph +=
          f.sw *
          dt;


        f.x =
          f.bx +
          Math.sin(
            f.ph
          ) *
          f.amp;


        f.rot +=
          f.vr *
          dt;


        f.fp +=
          f.fs *
          dt;


        draw(
          cx,
          f
        );

      }
    );


    if (
      flRef.current.length ||
      t <
      spawnUntilRef.current
    ) {

      rafRef.current =
        requestAnimationFrame(
          loop
        );

    }

    else {

      rafRef.current =
        0;

    }

  };


  // =========================================================
  // START FLOWERS
  // =========================================================

  const startFlowers = () => {

    fit();


    clearTimeout(
      timerRef.current
    );


    timerRef.current =
      setTimeout(
        () => {

          lastRef.current =
            performance.now();


          spawnUntilRef.current =
            lastRef.current +
            6500;


          if (
            !rafRef.current
          ) {

            rafRef.current =
              requestAnimationFrame(
                loop
              );

          }

        },
        400
      );

  };


  // =========================================================
  // STOP FLOWERS
  // =========================================================

  const stopFlowers = () => {

    clearTimeout(
      timerRef.current
    );


    spawnUntilRef.current =
      0;


    flRef.current =
      [];


    if (
      rafRef.current
    ) {

      cancelAnimationFrame(
        rafRef.current
      );


      rafRef.current =
        0;

    }


    const cv =
      canvasRef.current;

    const stage =
      stageRef.current;


    if (
      cv &&
      stage
    ) {

      const cx =
        cv.getContext('2d');


      cx.clearRect(
        0,
        0,
        stage.clientWidth,
        stage.clientHeight
      );

    }

  };


  // =========================================================
  // INITIALIZATION
  // =========================================================

  useEffect(() => {

    const handleResize =
      () => fit();


    window.addEventListener(
      'resize',
      handleResize
    );


    try {

      setTimeout(
        buildCrowd,
        100
      );

    } catch (e) {
      // Ignore initialization errors
    }


    return () => {

      window.removeEventListener(
        'resize',
        handleResize
      );


      stopFlowers();

    };

  }, []);


  // =========================================================
  // CURTAIN / CELEBRATION TOGGLE
  // =========================================================

  const toggleCurtain = () => {

    const nextState =
      !isOpen;


    setIsOpen(
      nextState
    );


    if (nextState) {

      startFlowers();


      try {

        playApplause();

      } catch (e) {

        // Ignore audio errors

      }

    }

    else {

      stopFlowers();

      stopApplause();

    }

  };
  return (
    <div className="inauguration-section">
      <div className="separator" style={{ clear: 'both', textAlign: 'center', marginBottom: '20px' }}>
        <a
          href="https://blogger.googleusercontent.com/img/a/AVvXsEgvLVSX1NBq89quY36RhXlu7tjYurt-33-lju24Z3O2z1Hl-_4wswl46razYp7aBWES_9RyYLDVajW_XBletE95xjSFqzMTxUhKAsme0ULiPgH1AQ0MBT7fDfF4pXpIK2huSx5OTiAa5a0u4oElWzaJ8q8UVA9dmCSxKPaw-P92NIakylzEo66b6z6Fw5EJ"
          style={{ marginLeft: '1em', marginRight: '1em' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Gurukulam Banner"
            height="100"
            src="https://blogger.googleusercontent.com/img/a/AVvXsEgvLVSX1NBq89quY36RhXlu7tjYurt-33-lju24Z3O2z1Hl-_4wswl46razYp7aBWES_9RyYLDVajW_XBletE95xjSFqzMTxUhKAsme0ULiPgH1AQ0MBT7fDfF4pXpIK2huSx5OTiAa5a0u4oElWzaJ8q8UVA9dmCSxKPaw-P92NIakylzEo66b6z6Fw5EJ"
            width="320"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </a>
      </div>

      <div className={`stage ${isOpen ? 'open' : ''}`} ref={stageRef}>
        <div className="valance"></div>
        <div className="curtain left"></div>
        <div className="curtain right"></div>
        <canvas
          ref={canvasRef}
          style={{ height: '100%', inset: 0, pointerEvents: 'none', position: 'absolute', width: '100%', zIndex: 6 }}
        ></canvas>
        <div className="tie tl"></div>
        <div className="tie tr"></div>
        <div aria-live="polite" className="stage-text" style={{ marginTop: '-80px' }}>
          <h1 className="t1" style={{ fontWeight: 400 }}>
            <br />
            Inauguration of
            <br /> Gurukulam Digital Classes
          </h1>
          <p className="by">By</p>
          <p className="name">Sri.&nbsp; M. M. NAYAK, IAS</p>
          <p className="desig">Hon’ble Principal Secretary , TW Dept</p>
          <p className="name">Smt. M.Gowthami, IAS</p>
          <p className="desig">Secretary, Gurukulam</p>
          <p className="date">
            On 6<sup>th</sup> October&nbsp; 2026
          </p>
          <a
            className="blog"
            href="https://apgurukulamdigitalclasses.vercel.app"
            rel="noopener noreferrer"
            target="_blank"
          >
            Visit Gurukulam Digital Classes →
          </a>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="curtain-btn" type="button" onClick={toggleCurtain}>
          {isOpen ? 'Close Curtain' : 'Open Curtain'}
        </button>
      </div>
    </div>
  );
}
