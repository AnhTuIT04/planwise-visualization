// =====================================================
// CHANGE TASK STATUS
// SCENE 3 — SCALING PROOF
//   Add a new status ("blocked").
//   Without the pattern: branches explode.
//   With the pattern: a couple of rows.
// =====================================================

import {
  makeScene2D,
  Rect,
  Txt,
} from '@motion-canvas/2d';

import {
  all,
  createRef,
  waitFor,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#0b1020');

  // =====================================================
  // TITLE  +  "blocked" badge
  // =====================================================

  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text={'What happens when we add a new status?'}
      y={-475}
      fontSize={44}
      fill={'white'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  const badge = createRef<Rect>();
  view.add(
    <Rect
      ref={badge}
      width={220}
      height={56}
      x={0}
      y={-400}
      radius={28}
      fill={'#06281d'}
      stroke={'#67e8f9'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'+ blocked'}
        fill={'#67e8f9'}
        fontSize={26}
        fontFamily={'monospace'}
      />
    </Rect>,
  );

  yield* title().opacity(1, 0.7);
  yield* badge().opacity(1, 0.5);
  yield* waitFor(0.4);

  // =====================================================
  // PANELS — left "without", right "with"
  // =====================================================

  const withoutPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={withoutPanel}
      x={-470}
      y={30}
      width={900}
      height={700}
      radius={16}
      fill={'#101827'}
      stroke={'#ef4444'}
      lineWidth={2}
      opacity={0}
    />,
  );

  const withPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={withPanel}
      x={470}
      y={30}
      width={900}
      height={700}
      radius={16}
      fill={'#101827'}
      stroke={'#10b981'}
      lineWidth={2}
      opacity={0}
    />,
  );

  yield* all(withoutPanel().opacity(1, 0.5), withPanel().opacity(1, 0.5));

  // ----- Headers -----
  const headerWithout = createRef<Txt>();
  view.add(
    <Txt
      ref={headerWithout}
      text={'Without the pattern'}
      x={-470}
      y={-280}
      fontSize={28}
      fill={'#fca5a5'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  const headerWith = createRef<Txt>();
  view.add(
    <Txt
      ref={headerWith}
      text={'With the pattern'}
      x={470}
      y={-280}
      fontSize={28}
      fill={'#34d399'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* all(headerWithout().opacity(1, 0.4), headerWith().opacity(1, 0.4));

  // =====================================================
  // EXISTING CONTENT (same starting point in both)
  // =====================================================

  // ----- LEFT: existing if-chain -----
  const existingIfLines = [
    "if (todo    -> running) ...",
    "if (todo    -> done)    ...",
    "if (running -> done)    ...",
    "if (done    -> todo)    ...",
  ];
  const existingIfYs = [-220, -180, -140, -100];
  const existingIfRefs: ReturnType<typeof createRef<Txt>>[] = [];
  for (let i = 0; i < existingIfLines.length; i++) {
    const r = createRef<Txt>();
    existingIfRefs.push(r);
    view.add(
      <Txt
        ref={r}
        text={existingIfLines[i]}
        x={-470}
        y={existingIfYs[i]}
        width={840}
        textAlign={'left'}
        fontSize={20}
        fill={'#94a3b8'}
        opacity={0}
        fontFamily={'monospace'}
      />,
    );
  }

  // ----- RIGHT: existing handler map -----
  const mapOpen = createRef<Txt>();
  view.add(
    <Txt
      ref={mapOpen}
      text={'const handlers = {'}
      x={470}
      y={-220}
      width={840}
      textAlign={'left'}
      fontSize={20}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  const existingMapLines = [
    "  'todo->running':  handleStart,",
    "  'todo->done':     handleComplete,",
    "  'running->done':  handleFinish,",
    "  'done->todo':     handleReopen,",
  ];
  const existingMapYs = [-180, -140, -100, -60];
  const existingMapRefs: ReturnType<typeof createRef<Txt>>[] = [];
  for (let i = 0; i < existingMapLines.length; i++) {
    const r = createRef<Txt>();
    existingMapRefs.push(r);
    view.add(
      <Txt
        ref={r}
        text={existingMapLines[i]}
        x={470}
        y={existingMapYs[i]}
        width={840}
        textAlign={'left'}
        fontSize={20}
        fill={'#94a3b8'}
        opacity={0}
        fontFamily={'monospace'}
      />,
    );
  }
  const mapCloseLine = createRef<Txt>();
  view.add(
    <Txt
      ref={mapCloseLine}
      text={'};'}
      x={470}
      y={-20}
      width={840}
      textAlign={'left'}
      fontSize={20}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  // Fade in existing content together
  yield* all(
    mapOpen().opacity(1, 0.4),
    mapCloseLine().opacity(1, 0.4),
    ...existingIfRefs.map(r => r().opacity(1, 0.4)),
    ...existingMapRefs.map(r => r().opacity(1, 0.4)),
  );
  yield* waitFor(0.6);

  // =====================================================
  // ADDING "blocked":  divider labels
  // =====================================================

  const dividerLeft = createRef<Txt>();
  view.add(
    <Txt
      ref={dividerLeft}
      text={"// adding 'blocked':"}
      x={-470}
      y={-40}
      width={840}
      textAlign={'left'}
      fontSize={20}
      fill={'#67e8f9'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  const dividerRight = createRef<Txt>();
  view.add(
    <Txt
      ref={dividerRight}
      text={"// adding 'blocked':"}
      x={470}
      y={50}
      width={840}
      textAlign={'left'}
      fontSize={20}
      fill={'#67e8f9'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* all(dividerLeft().opacity(1, 0.4), dividerRight().opacity(1, 0.4));
  yield* waitFor(0.4);

  // =====================================================
  // LEFT: SIX new red branches — one at a time (painful)
  // =====================================================

  const newIfLines = [
    "if (todo    -> blocked) ...",
    "if (running -> blocked) ...",
    "if (done    -> blocked) ...",
    "if (blocked -> todo)    ...",
    "if (blocked -> running) ...",
    "if (blocked -> done)    ...",
  ];
  const newIfYs = [0, 40, 80, 120, 160, 200];
  const newIfRefs: ReturnType<typeof createRef<Txt>>[] = [];
  for (let i = 0; i < newIfLines.length; i++) {
    const r = createRef<Txt>();
    newIfRefs.push(r);
    view.add(
      <Txt
        ref={r}
        text={newIfLines[i]}
        x={-470}
        y={newIfYs[i]}
        width={840}
        textAlign={'left'}
        fontSize={20}
        fill={'#f87171'}
        opacity={0}
        fontFamily={'monospace'}
      />,
    );
  }

  // =====================================================
  // RIGHT: TWO new green entries
  // =====================================================

  const newMapLines = [
    "  '*->blocked':       handleBlock,",
    "  'blocked->*':       handleResume,",
  ];
  const newMapYs = [90, 130];
  const newMapRefs: ReturnType<typeof createRef<Txt>>[] = [];
  for (let i = 0; i < newMapLines.length; i++) {
    const r = createRef<Txt>();
    newMapRefs.push(r);
    view.add(
      <Txt
        ref={r}
        text={newMapLines[i]}
        x={470}
        y={newMapYs[i]}
        width={840}
        textAlign={'left'}
        fontSize={20}
        fill={'#34d399'}
        opacity={0}
        fontFamily={'monospace'}
      />,
    );
  }
  const docNote = createRef<Txt>();
  view.add(
    <Txt
      ref={docNote}
      text={'+ 1 row in the docs table'}
      x={470}
      y={200}
      width={840}
      textAlign={'left'}
      fontSize={20}
      fill={'#34d399'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  // Reveal: left slowly, right quickly — visual contrast
  // Kick off the right side's quick reveal alongside the first left line.
  yield* all(
    newIfRefs[0]().opacity(1, 0.3),
    newMapRefs[0]().opacity(1, 0.3),
  );
  yield* waitFor(0.25);
  yield* all(
    newIfRefs[1]().opacity(1, 0.3),
    newMapRefs[1]().opacity(1, 0.3),
  );
  yield* waitFor(0.25);
  yield* all(
    newIfRefs[2]().opacity(1, 0.3),
    docNote().opacity(1, 0.3),
  );
  yield* waitFor(0.25);
  // Continue painfully on the left only
  yield* newIfRefs[3]().opacity(1, 0.3);
  yield* waitFor(0.25);
  yield* newIfRefs[4]().opacity(1, 0.3);
  yield* waitFor(0.25);
  yield* newIfRefs[5]().opacity(1, 0.3);
  yield* waitFor(0.5);

  // =====================================================
  // COUNTERS
  // =====================================================

  const counterLeft = createRef<Rect>();
  view.add(
    <Rect
      ref={counterLeft}
      x={-470}
      y={300}
      width={780}
      height={70}
      radius={12}
      fill={'#1a1220'}
      stroke={'#ef4444'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'10 branches  ·  20 with subtasks'}
        fontSize={24}
        fill={'#fca5a5'}
        fontFamily={'monospace'}
      />
    </Rect>,
  );

  const counterRight = createRef<Rect>();
  view.add(
    <Rect
      ref={counterRight}
      x={470}
      y={300}
      width={780}
      height={70}
      radius={12}
      fill={'#06281d'}
      stroke={'#10b981'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'2 handler rows  +  1 doc row'}
        fontSize={24}
        fill={'#34d399'}
        fontFamily={'monospace'}
      />
    </Rect>,
  );

  yield* all(counterLeft().opacity(1, 0.6), counterRight().opacity(1, 0.6));
  yield* waitFor(1.8);

  // =====================================================
  // CLOSING BANNER
  // =====================================================

  yield* all(
    headerWithout().opacity(0.3, 0.4),
    headerWith().opacity(0.3, 0.4),
    ...existingIfRefs.map(r => r().opacity(0.2, 0.4)),
    ...existingMapRefs.map(r => r().opacity(0.2, 0.4)),
    mapOpen().opacity(0.2, 0.4),
    mapCloseLine().opacity(0.2, 0.4),
    dividerLeft().opacity(0.2, 0.4),
    dividerRight().opacity(0.2, 0.4),
    ...newIfRefs.map(r => r().opacity(0.4, 0.4)),
    ...newMapRefs.map(r => r().opacity(0.4, 0.4)),
    docNote().opacity(0.4, 0.4),
  );

  const closing = createRef<Rect>();
  view.add(
    <Rect
      ref={closing}
      width={1200}
      height={170}
      x={0}
      y={20}
      radius={18}
      fill={'#1a1220'}
      stroke={'#e2e8f0'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Scale linearly,  not combinatorially.'}
        y={-30}
        fill={'white'}
        fontSize={32}
        fontFamily={'monospace'}
      />
      <Txt
        text={'add a row,  not a branch.'}
        y={28}
        fill={'#34d399'}
        fontSize={28}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* closing().opacity(1, 0.7);

  yield* waitFor(3);
});
