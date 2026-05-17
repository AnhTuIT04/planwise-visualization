// =====================================================
// CALENDAR INTEGRATION
// SCENE 3 — TWO OPTIMIZATIONS
//   1. syncToken — only fetch what changed
//   2. lastModifiedByApp — skip echoes from our own writes
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
  const subtitle = createRef<Txt>();

  view.add(
    <Txt
      ref={title}
      text={'Two tricks that keep this fast'}
      y={-470}
      fontSize={48}
      fill={'white'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  view.add(
    <Txt
      ref={subtitle}
      text={'syncToken  +  anti-echo flag'}
      y={-400}
      fontSize={26}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* title().opacity(1, 0.8);
  yield* subtitle().opacity(1, 0.5);
  yield* waitFor(0.5);

  // =====================================================
  // ===========  OPTIMIZATION 1 — syncToken  ============
  // =====================================================

  const sectionTitle = createRef<Txt>();
  view.add(
    <Txt
      ref={sectionTitle}
      text={'1.  syncToken  —  only fetch what changed'}
      y={-310}
      fontSize={32}
      fill={'#10b981'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* sectionTitle().opacity(1, 0.5);

  // ----- WITHOUT panel -----
  const withoutPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={withoutPanel}
      width={820}
      height={220}
      x={-450}
      y={-100}
      radius={16}
      fill={'#101827'}
      stroke={'#ef4444'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Without syncToken'}
        y={-80}
        fill={'#fca5a5'}
        fontSize={26}
        fontFamily={'monospace'}
      />
      <Txt
        text={'every poll re-fetches the entire window'}
        y={-40}
        fill={'#94a3b8'}
        fontSize={20}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* withoutPanel().opacity(1, 0.5);

  // Many events streaming out — visualize "lots of data"
  const bigCards: ReturnType<typeof createRef<Rect>>[] = [];
  for (let i = 0; i < 18; i++) {
    const c = createRef<Rect>();
    bigCards.push(c);
    const col = i % 9;
    const row = Math.floor(i / 9);
    view.add(
      <Rect
        ref={c}
        width={62}
        height={22}
        x={-770 + col * 70}
        y={-30 + row * 30}
        radius={5}
        fill={'#06b6d4'}
        opacity={0}
      >
        <Txt
          text={'evt'}
          fill={'#0b1020'}
          fontSize={13}
          fontFamily={'monospace'}
        />
      </Rect>,
    );
  }
  yield* all(...bigCards.map(c => c().opacity(1, 0.3)));

  // ----- WITH panel -----
  const withPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={withPanel}
      width={820}
      height={220}
      x={450}
      y={-100}
      radius={16}
      fill={'#101827'}
      stroke={'#10b981'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'With syncToken'}
        y={-80}
        fill={'#34d399'}
        fontSize={26}
        fontFamily={'monospace'}
      />
      <Txt
        text={'fetch only the delta since last sync'}
        y={-40}
        fill={'#94a3b8'}
        fontSize={20}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* withPanel().opacity(1, 0.5);

  // Few cards on the right side
  const smallCards: ReturnType<typeof createRef<Rect>>[] = [];
  for (let i = 0; i < 2; i++) {
    const c = createRef<Rect>();
    smallCards.push(c);
    view.add(
      <Rect
        ref={c}
        width={62}
        height={22}
        x={420 + i * 70}
        y={-10}
        radius={5}
        fill={'#10b981'}
        opacity={0}
      >
        <Txt
          text={'evt'}
          fill={'#0b1020'}
          fontSize={13}
          fontFamily={'monospace'}
        />
      </Rect>,
    );
  }
  yield* all(...smallCards.map(c => c().opacity(1, 0.4)));

  // Saving caption under With
  const winCaption = createRef<Txt>();
  view.add(
    <Txt
      ref={winCaption}
      text={'less bandwidth · less DB work · faster sync'}
      y={50}
      fontSize={20}
      fill={'#34d399'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* winCaption().opacity(1, 0.5);

  yield* waitFor(1.8);

  // =====================================================
  // FADE OUT FIRST OPTIMIZATION
  // =====================================================

  yield* all(
    sectionTitle().opacity(0, 0.4),
    withoutPanel().opacity(0, 0.4),
    withPanel().opacity(0, 0.4),
    winCaption().opacity(0, 0.4),
    ...bigCards.map(c => c().opacity(0, 0.4)),
    ...smallCards.map(c => c().opacity(0, 0.4)),
  );

  // =====================================================
  // ===========  OPTIMIZATION 2 — ANTI-ECHO  ============
  // =====================================================

  const section2 = createRef<Txt>();
  view.add(
    <Txt
      ref={section2}
      text={'2.  lastModifiedByApp  —  skip our own echoes'}
      y={-310}
      fontSize={32}
      fill={'#f59e0b'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* section2().opacity(1, 0.5);

  // Honest framing line
  const framing = createRef<Txt>();
  view.add(
    <Txt
      ref={framing}
      text={'when we write an event, Google notifies us about... our own write.'}
      y={-260}
      fontSize={22}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* framing().opacity(1, 0.4);

  // ----- WITHOUT panel — show the echo loop -----
  const echoPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={echoPanel}
      width={820}
      height={340}
      x={-450}
      y={20}
      radius={16}
      fill={'#101827'}
      stroke={'#ef4444'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Without the flag'}
        y={-140}
        fill={'#fca5a5'}
        fontSize={26}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* echoPanel().opacity(1, 0.5);

  // Three mini nodes inside: App, Google, "resync"
  const echoApp = createRef<Rect>();
  const echoGoogle = createRef<Rect>();

  view.add(
    <Rect
      ref={echoApp}
      width={160}
      height={64}
      x={-680}
      y={20}
      radius={10}
      fill={'#182031'}
      stroke={'#2c3954'}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={'App'} fill={'white'} fontSize={22} fontFamily={'monospace'}/>
    </Rect>,
  );
  view.add(
    <Rect
      ref={echoGoogle}
      width={160}
      height={64}
      x={-220}
      y={20}
      radius={10}
      fill={'#182031'}
      stroke={'#2c3954'}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={'Google'} fill={'white'} fontSize={22} fontFamily={'monospace'}/>
    </Rect>,
  );

  yield* all(
    echoApp().opacity(1, 0.4),
    echoGoogle().opacity(1, 0.4),
  );

  // 1. App writes to Google
  const arr1 = createRef<Line>();
  view.add(
    <Line
      ref={arr1}
      points={[[-600, 8], [-300, 8]]}
      stroke={'#06b6d4'}
      lineWidth={5}
      endArrow
      arrowSize={14}
      opacity={0}
    />,
  );
  const arr1Lbl = createRef<Txt>();
  view.add(
    <Txt
      ref={arr1Lbl}
      text={'write event'}
      x={-450}
      y={-14}
      fontSize={18}
      fill={'#67e8f9'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* all(arr1().opacity(1, 0.4), arr1Lbl().opacity(1, 0.4));

  // 2. Google → App webhook
  const arr2 = createRef<Line>();
  view.add(
    <Line
      ref={arr2}
      points={[[-300, 38], [-600, 38]]}
      stroke={'#ef4444'}
      lineWidth={5}
      endArrow
      arrowSize={14}
      opacity={0}
    />,
  );
  const arr2Lbl = createRef<Txt>();
  view.add(
    <Txt
      ref={arr2Lbl}
      text={'webhook (about our own write)'}
      x={-450}
      y={66}
      fontSize={18}
      fill={'#fca5a5'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* all(arr2().opacity(1, 0.4), arr2Lbl().opacity(1, 0.4));

  // 3. App resyncs the change it already made
  const arr3 = createRef<Line>();
  view.add(
    <Line
      ref={arr3}
      points={[[-600, 100], [-300, 100]]}
      stroke={'#ef4444'}
      lineWidth={5}
      endArrow
      arrowSize={14}
      lineDash={[10, 8]}
      opacity={0}
    />,
  );
  const arr3Lbl = createRef<Txt>();
  view.add(
    <Txt
      ref={arr3Lbl}
      text={'wasted re-sync  →  noisy WebSocket push'}
      x={-450}
      y={128}
      fontSize={18}
      fill={'#fca5a5'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* all(arr3().opacity(1, 0.4), arr3Lbl().opacity(1, 0.4));

  // ----- WITH panel -----
  const withFlagPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={withFlagPanel}
      width={820}
      height={340}
      x={450}
      y={20}
      radius={16}
      fill={'#101827'}
      stroke={'#10b981'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'With the flag'}
        y={-140}
        fill={'#34d399'}
        fontSize={26}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* withFlagPanel().opacity(1, 0.5);

  // Mini topology with flag
  const flagApp = createRef<Rect>();
  const flagGoogle = createRef<Rect>();

  view.add(
    <Rect
      ref={flagApp}
      width={160}
      height={64}
      x={220}
      y={20}
      radius={10}
      fill={'#182031'}
      stroke={'#2c3954'}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={'App'} fill={'white'} fontSize={22} fontFamily={'monospace'}/>
    </Rect>,
  );
  view.add(
    <Rect
      ref={flagGoogle}
      width={160}
      height={64}
      x={680}
      y={20}
      radius={10}
      fill={'#182031'}
      stroke={'#2c3954'}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={'Google'} fill={'white'} fontSize={22} fontFamily={'monospace'}/>
    </Rect>,
  );

  yield* all(
    flagApp().opacity(1, 0.4),
    flagGoogle().opacity(1, 0.4),
  );

  // 1. App writes + sets flag
  const fArr1 = createRef<Line>();
  view.add(
    <Line
      ref={fArr1}
      points={[[300, 8], [600, 8]]}
      stroke={'#06b6d4'}
      lineWidth={5}
      endArrow
      arrowSize={14}
      opacity={0}
    />,
  );
  const fArr1Lbl = createRef<Txt>();
  view.add(
    <Txt
      ref={fArr1Lbl}
      text={'write event   (set flag)'}
      x={450}
      y={-14}
      fontSize={18}
      fill={'#67e8f9'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* all(fArr1().opacity(1, 0.4), fArr1Lbl().opacity(1, 0.4));

  // The flag badge on App
  const flagBadge = createRef<Rect>();
  view.add(
    <Rect
      ref={flagBadge}
      width={280}
      height={42}
      x={220}
      y={90}
      radius={8}
      fill={'#06281d'}
      stroke={'#34d399'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'lastModifiedByApp = true'}
        fill={'#34d399'}
        fontSize={18}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* flagBadge().opacity(1, 0.4);

  // 2. Webhook from Google
  const fArr2 = createRef<Line>();
  view.add(
    <Line
      ref={fArr2}
      points={[[600, 38], [300, 38]]}
      stroke={'#f59e0b'}
      lineWidth={5}
      endArrow
      arrowSize={14}
      opacity={0}
    />,
  );
  yield* fArr2().opacity(1, 0.4);

  // 3. Check flag → skip
  const skipBadge = createRef<Rect>();
  view.add(
    <Rect
      ref={skipBadge}
      width={360}
      height={56}
      x={450}
      y={150}
      radius={10}
      fill={'#1a1220'}
      stroke={'#e2e8f0'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'flag set < 30s  →  skip'}
        fill={'#e2e8f0'}
        fontSize={22}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* skipBadge().opacity(1, 0.5);

  yield* waitFor(2);

  // =====================================================
  // CLOSING
  // =====================================================

  yield* all(
    section2().opacity(0, 0.4),
    framing().opacity(0, 0.4),
    echoPanel().opacity(0, 0.4),
    withFlagPanel().opacity(0, 0.4),
    echoApp().opacity(0, 0.4),
    echoGoogle().opacity(0, 0.4),
    arr1().opacity(0, 0.4),
    arr1Lbl().opacity(0, 0.4),
    arr2().opacity(0, 0.4),
    arr2Lbl().opacity(0, 0.4),
    arr3().opacity(0, 0.4),
    arr3Lbl().opacity(0, 0.4),
    flagApp().opacity(0, 0.4),
    flagGoogle().opacity(0, 0.4),
    fArr1().opacity(0, 0.4),
    fArr1Lbl().opacity(0, 0.4),
    fArr2().opacity(0, 0.4),
    flagBadge().opacity(0, 0.4),
    skipBadge().opacity(0, 0.4),
  );

  const closing = createRef<Rect>();
  view.add(
    <Rect
      ref={closing}
      width={1100}
      height={150}
      x={0}
      y={0}
      radius={18}
      fill={'#1a1220'}
      stroke={'#e2e8f0'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'syncToken  shrinks every request.'}
        y={-22}
        fill={'#34d399'}
        fontSize={28}
        fontFamily={'monospace'}
      />
      <Txt
        text={'lastModifiedByApp  silences our own echoes.'}
        y={22}
        fill={'#fbbf24'}
        fontSize={28}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* closing().opacity(1, 0.7);

  yield* waitFor(3);
});
