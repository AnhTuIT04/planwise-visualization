// =====================================================
// CALENDAR INTEGRATION
// SCENE 2 — END-TO-END DATA FLOW
// =====================================================

import {
  makeScene2D,
  Rect,
  Txt,
  Line,
  Circle,
} from '@motion-canvas/2d';

import {
  all,
  createRef,
  waitFor,
  easeInOutCubic,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#0b1020');

  // =====================================================
  // TITLE
  // =====================================================

  const title = createRef<Txt>();

  view.add(
    <Txt
      ref={title}
      text={'End-to-end  —  the data flow'}
      y={-470}
      fontSize={48}
      fill={'white'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* title().opacity(1, 0.8);
  yield* waitFor(0.3);

  // =====================================================
  // PHASE INDICATOR (top-right)
  // =====================================================

  const phaseBox = createRef<Rect>();
  const phaseText = createRef<Txt>();

  view.add(
    <Rect
      ref={phaseBox}
      width={460}
      height={70}
      x={550}
      y={-400}
      radius={14}
      fill={'#101827'}
      stroke={'#475569'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        ref={phaseText}
        text={'Phase 1 — Connect'}
        fill={'#3b82f6'}
        fontSize={26}
        fontFamily={'monospace'}
      />
    </Rect>,
  );

  // =====================================================
  // TOPOLOGY — 5 BOXES
  // =====================================================

  const nodes = {
    user:     {rect: createRef<Rect>(), label: 'User',              x: -780, y: -200},
    frontend: {rect: createRef<Rect>(), label: 'Frontend',          x: -400, y: -200},
    backend:  {rect: createRef<Rect>(), label: 'Backend',           x: 0,    y: 30},
    google:   {rect: createRef<Rect>(), label: 'Google\nCalendar',  x: 500,  y: -200},
    db:       {rect: createRef<Rect>(), label: 'PostgreSQL',        x: 0,    y: 300},
  };

  for (const key of Object.keys(nodes) as (keyof typeof nodes)[]) {
    const n = nodes[key];
    view.add(
      <Rect
        ref={n.rect}
        width={230}
        height={100}
        radius={14}
        fill={'#182031'}
        stroke={'#2c3954'}
        lineWidth={2}
        x={n.x}
        y={n.y}
        opacity={0}
      >
        <Txt
          text={n.label}
          fill={'white'}
          fontSize={24}
          fontFamily={'monospace'}
          textAlign={'center'}
        />
      </Rect>,
    );
  }

  yield* all(
    nodes.user.rect().opacity(1, 0.4),
    nodes.frontend.rect().opacity(1, 0.4),
    nodes.backend.rect().opacity(1, 0.4),
    nodes.google.rect().opacity(1, 0.4),
    nodes.db.rect().opacity(1, 0.4),
  );

  yield* phaseBox().opacity(1, 0.5);

  // =====================================================
  // HELPER — animated arrow flash
  // =====================================================

  const flash = function* (
    from: [number, number],
    to: [number, number],
    color: string,
    label?: string,
    labelOffset: [number, number] = [0, -20],
  ) {
    const a = createRef<Line>();
    const lbl = createRef<Txt>();

    view.add(
      <Line
        ref={a}
        points={[from, to]}
        stroke={color}
        lineWidth={5}
        endArrow
        arrowSize={14}
        opacity={0}
      />,
    );

    if (label) {
      const midX = (from[0] + to[0]) / 2 + labelOffset[0];
      const midY = (from[1] + to[1]) / 2 + labelOffset[1];
      view.add(
        <Txt
          ref={lbl}
          text={label}
          x={midX}
          y={midY}
          fontSize={18}
          fill={'#e2e8f0'}
          opacity={0}
          fontFamily={'monospace'}
        />,
      );
    }

    yield* all(
      a().opacity(1, 0.3),
      label ? lbl().opacity(1, 0.3) : a().opacity(1, 0.3),
    );

    return {arrow: a, label: lbl};
  };

  // =====================================================
  // HELPER — backend↔Google flash that fades the previous
  // label on the same connection so labels don't overlap.
  // =====================================================

  let prevBGLabel: ReturnType<typeof createRef<Txt>> | null = null;

  const showBG = function* (
    from: [number, number],
    to: [number, number],
    color: string,
    label: string,
    labelOffset: [number, number] = [0, -20],
  ) {
    if (prevBGLabel) {
      const fading = prevBGLabel;
      prevBGLabel = null;
      yield* fading().opacity(0, 0.3);
    }
    const r = yield* flash(from, to, color, label, labelOffset);
    prevBGLabel = r.label;
  };

  yield* waitFor(0.4);

  // =====================================================
  // PHASE 1 — CONNECT (OAuth, condensed)
  // =====================================================

  yield* flash([-655, -200], [-520, -200], '#3b82f6', '"Connect"');
  yield* flash([-280, -200], [-120, -40],  '#3b82f6');
  yield* showBG([120, -40],   [375, -200],  '#3b82f6', 'OAuth handshake', [10, 18]);
  yield* showBG([375, -200],  [120, -40],   '#3b82f6', 'tokens', [-10, 36]);
  yield* flash([0, 90],      [0, 245],     '#3b82f6', 'save tokens', [80, 0]);

  yield* waitFor(0.8);

  // =====================================================
  // PHASE 2 — FIRST SYNC
  // =====================================================

  yield* phaseText().text('Phase 2 — First sync', 0.3);
  yield* phaseText().fill('#10b981', 0.3);

  // Add a "window" indicator over Google to show wide range
  const windowBadge = createRef<Rect>();
  view.add(
    <Rect
      ref={windowBadge}
      width={290}
      height={50}
      x={500}
      y={-280}
      radius={10}
      fill={'#06281d'}
      stroke={'#34d399'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'window: −30d  →  +365d'}
        fill={'#34d399'}
        fontSize={20}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* windowBadge().opacity(1, 0.4);

  yield* showBG([120, -40], [375, -200], '#10b981', 'GET all events', [-10, 18]);

  // Many event cards stream back from Google into DB via Backend
  const streamCards: ReturnType<typeof createRef<Rect>>[] = [];
  for (let i = 0; i < 6; i++) {
    const c = createRef<Rect>();
    streamCards.push(c);
    view.add(
      <Rect
        ref={c}
        width={56}
        height={26}
        x={375 - i * 28}
        y={-110 - (i % 2) * 6}
        radius={5}
        fill={'#06b6d4'}
        opacity={0}
      >
        <Txt
          text={'evt'}
          fill={'#0b1020'}
          fontSize={14}
          fontFamily={'monospace'}
        />
      </Rect>,
    );
  }

  yield* all(...streamCards.map(c => c().opacity(1, 0.25)));

  // Stream them down through Backend into DB
  yield* all(
    ...streamCards.map((c, i) =>
      c().position([0 - i * 12, 300], 1.0, easeInOutCubic),
    ),
  );
  yield* all(...streamCards.map(c => c().opacity(0, 0.3)));

  // Show syncToken being saved
  const tokenBadge = createRef<Rect>();
  const tokenBadgeText = createRef<Txt>();
  view.add(
    <Rect
      ref={tokenBadge}
      width={300}
      height={50}
      x={-470}
      y={250}
      radius={10}
      fill={'#101827'}
      stroke={'#fbbf24'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        ref={tokenBadgeText}
        text={'save syncToken'}
        fill={'#fbbf24'}
        fontSize={22}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* tokenBadge().opacity(1, 0.5);

  yield* waitFor(0.7);

  // =====================================================
  // PHASE 3 — INCREMENTAL SYNC (loops)
  // =====================================================

  yield* phaseText().text('Phase 3 — Incremental sync', 0.3);
  yield* phaseText().fill('#06b6d4', 0.3);

  yield* all(
    windowBadge().opacity(0, 0.3),
  );

  // Show that we use the syncToken to fetch only deltas
  yield* tokenBadge().position([500, -280], 0.8, easeInOutCubic);
  yield* tokenBadgeText().text('with syncToken', 0.3);
  yield* tokenBadgeText().fill('#06b6d4', 0.3);
  yield* tokenBadge().stroke('#06b6d4', 0.3);
  yield* tokenBadge().fill('#0f1f2c', 0.3);

  // Do one round
  yield* showBG([120, -40], [375, -200], '#06b6d4', 'GET (delta only)', [-10, 18]);

  // 2 small event cards come back
  const deltaCards: ReturnType<typeof createRef<Rect>>[] = [];
  for (let i = 0; i < 2; i++) {
    const c = createRef<Rect>();
    deltaCards.push(c);
    view.add(
      <Rect
        ref={c}
        width={56}
        height={26}
        x={375 - i * 28}
        y={-110}
        radius={5}
        fill={'#06b6d4'}
        opacity={0}
      >
        <Txt
          text={'evt'}
          fill={'#0b1020'}
          fontSize={14}
          fontFamily={'monospace'}
        />
      </Rect>,
    );
  }
  yield* all(...deltaCards.map(c => c().opacity(1, 0.25)));
  yield* all(...deltaCards.map((c, i) => c().position([0 - i * 12, 300], 0.9, easeInOutCubic)));
  yield* all(...deltaCards.map(c => c().opacity(0, 0.3)));

  // Show a "repeats periodically" indicator
  const repeatBadge = createRef<Rect>();
  view.add(
    <Rect
      ref={repeatBadge}
      width={300}
      height={50}
      x={500}
      y={-340}
      radius={10}
      fill={'#101827'}
      stroke={'#06b6d4'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'repeats periodically'}
        fill={'#06b6d4'}
        fontSize={20}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* repeatBadge().opacity(1, 0.4);

  yield* waitFor(0.7);

  // =====================================================
  // PHASE 4 — LIVE UPDATE (user changes event in Google)
  // =====================================================

  yield* all(
    phaseText().text('Phase 4 — Live update', 0.3),
    phaseText().fill('#f59e0b', 0.3),
    repeatBadge().opacity(0, 0.3),
    tokenBadge().opacity(0, 0.3),
  );

  // A "change happens" pulse on Google
  const changePulse = createRef<Circle>();
  view.add(
    <Circle
      ref={changePulse}
      width={20}
      height={20}
      fill={'#f59e0b'}
      x={500}
      y={-200}
      opacity={0}
    />,
  );
  yield* all(
    changePulse().opacity(1, 0.2),
    changePulse().scale(4, 0.6),
    changePulse().opacity(0, 0.6),
  );

  const changeLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={changeLabel}
      text={'event edited in Google'}
      x={500}
      y={-300}
      fontSize={20}
      fill={'#fbbf24'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* changeLabel().opacity(1, 0.3);

  // Webhook: Google → Backend
  yield* showBG([375, -200], [120, -40], '#f59e0b', 'webhook fires', [-30, 30]);

  // Backend pulls delta
  yield* showBG([120, -40], [375, -200], '#f59e0b', 'GET delta', [-10, -14]);
  yield* showBG([375, -200], [120, -40], '#f59e0b', 'changed event', [-10, 38]);

  // Backend → DB upsert
  yield* flash([0, 90], [0, 245], '#f59e0b', 'upsert', [80, 0]);

  // Backend → WebSocket → Frontend (via direct arrow with WS label)
  const wsArrow = createRef<Line>();
  view.add(
    <Line
      ref={wsArrow}
      points={[[-120, -40], [-400, -150]]}
      stroke={'#f59e0b'}
      lineWidth={5}
      endArrow
      arrowSize={14}
      lineDash={[12, 8]}
      opacity={0}
    />,
  );
  view.add(
    <Txt
      text={'WebSocket  push'}
      x={-280}
      y={-130}
      fontSize={20}
      fill={'#fbbf24'}
      fontFamily={'monospace'}
    />,
  );
  yield* wsArrow().opacity(1, 0.4);

  // Frontend lights up
  yield* all(
    nodes.frontend.rect().stroke('#f59e0b', 0.3),
    nodes.frontend.rect().fill('#2a1d05', 0.3),
  );

  const feLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={feLabel}
      text={'UI updates'}
      x={-400}
      y={-90}
      fontSize={20}
      fill={'#fbbf24'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* feLabel().opacity(1, 0.4);

  yield* waitFor(2);
});
