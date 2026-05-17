// =====================================================
// CHANGE TASK STATUS
// SCENE 2 — TWO SOLUTIONS
//   1. Handler map  — one row per transition
//   2. Documentation — every case spelled out
// =====================================================

import {
  makeScene2D,
  Rect,
  Txt,
  Line,
} from '@motion-canvas/2d';

import {
  all,
  createRef,
  waitFor,
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
      text={'Two ways out of the if-chain'}
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
      text={'handler map  +  per-case documentation'}
      y={-400}
      fontSize={26}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* title().opacity(1, 0.8);
  yield* subtitle().opacity(1, 0.5);
  yield* waitFor(0.4);

  // =====================================================
  // ===============  SOLUTION 1 — HANDLER MAP  ==========
  // =====================================================

  const sectionA = createRef<Txt>();
  view.add(
    <Txt
      ref={sectionA}
      text={'1.  Handler map  —  one row per transition'}
      y={-310}
      fontSize={32}
      fill={'#10b981'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* sectionA().opacity(1, 0.5);

  // ----- Map panel (left) -----
  const mapPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={mapPanel}
      x={-380}
      y={40}
      width={920}
      height={460}
      radius={16}
      fill={'#101827'}
      stroke={'#10b981'}
      lineWidth={2}
      opacity={0}
    />,
  );
  yield* mapPanel().opacity(1, 0.5);

  const mapHeader = createRef<Txt>();
  view.add(
    <Txt
      ref={mapHeader}
      text={'const handlers = {'}
      x={-380}
      y={-90}
      width={860}
      textAlign={'left'}
      fontSize={24}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  const mapClose = createRef<Txt>();
  view.add(
    <Txt
      ref={mapClose}
      text={'};'}
      x={-380}
      y={210}
      width={860}
      textAlign={'left'}
      fontSize={24}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* all(mapHeader().opacity(1, 0.4), mapClose().opacity(1, 0.4));

  const mapEntries = [
    "  'todo->running':  handleStart,",
    "  'todo->done':     handleComplete,",
    "  'running->done':  handleFinish,",
    "  'done->todo':     handleReopen,",
  ];
  const mapEntryYs = [-30, 30, 90, 150];
  const mapEntryRefs: ReturnType<typeof createRef<Txt>>[] = [];
  for (let i = 0; i < mapEntries.length; i++) {
    const r = createRef<Txt>();
    mapEntryRefs.push(r);
    view.add(
      <Txt
        ref={r}
        text={mapEntries[i]}
        x={-380}
        y={mapEntryYs[i]}
        width={860}
        textAlign={'left'}
        fontSize={22}
        fill={'#e2e8f0'}
        opacity={0}
        fontFamily={'monospace'}
      />,
    );
  }
  for (let i = 0; i < mapEntryRefs.length; i++) {
    yield* mapEntryRefs[i]().opacity(1, 0.35);
    yield* waitFor(0.18);
  }
  yield* waitFor(0.3);

  // ----- Dispatch panel (right) -----
  const dispatchPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={dispatchPanel}
      x={620}
      y={-130}
      width={520}
      height={160}
      radius={16}
      fill={'#182031'}
      stroke={'#2c3954'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'dispatch'}
        y={-50}
        fontSize={22}
        fill={'#94a3b8'}
        fontFamily={'monospace'}
      />
      <Txt
        text={'handlers[`${from}->${to}`](task)'}
        y={20}
        fontSize={22}
        fill={'#67e8f9'}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* dispatchPanel().opacity(1, 0.5);
  yield* waitFor(0.3);

  // ----- Arrow: dispatch -> map -----
  const arrow = createRef<Line>();
  view.add(
    <Line
      ref={arrow}
      points={[[360, -100], [130, -100]]}
      stroke={'#06b6d4'}
      lineWidth={5}
      endArrow
      arrowSize={14}
      opacity={0}
    />,
  );
  const arrowLbl = createRef<Txt>();
  view.add(
    <Txt
      ref={arrowLbl}
      text={'lookup'}
      x={245}
      y={-130}
      fontSize={20}
      fill={'#67e8f9'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* all(arrow().opacity(1, 0.4), arrowLbl().opacity(1, 0.4));
  yield* waitFor(0.4);

  // ----- Caption -----
  const captionA = createRef<Txt>();
  view.add(
    <Txt
      ref={captionA}
      text={'add a row  ->  done.  No if-chain.'}
      y={380}
      fontSize={26}
      fill={'#34d399'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* captionA().opacity(1, 0.5);

  yield* waitFor(2);

  // =====================================================
  // FADE OUT SECTION A
  // =====================================================
  yield* all(
    sectionA().opacity(0, 0.4),
    mapPanel().opacity(0, 0.4),
    mapHeader().opacity(0, 0.4),
    mapClose().opacity(0, 0.4),
    dispatchPanel().opacity(0, 0.4),
    arrow().opacity(0, 0.4),
    arrowLbl().opacity(0, 0.4),
    captionA().opacity(0, 0.4),
    ...mapEntryRefs.map(r => r().opacity(0, 0.4)),
  );

  // =====================================================
  // =============  SOLUTION 2 — DOCUMENT EVERY CASE  ====
  // =====================================================

  const sectionB = createRef<Txt>();
  view.add(
    <Txt
      ref={sectionB}
      text={'2.  Document every case  —  no case forgotten'}
      y={-310}
      fontSize={32}
      fill={'#f59e0b'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* sectionB().opacity(1, 0.5);

  // ----- Doc table panel -----
  const docPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={docPanel}
      x={0}
      y={40}
      width={1240}
      height={520}
      radius={16}
      fill={'#101827'}
      stroke={'#f59e0b'}
      lineWidth={2}
      opacity={0}
    />,
  );
  yield* docPanel().opacity(1, 0.5);

  // Column centers (view x): FROM=-440, TO=-220, BEHAVIOR=140, COVERED=500
  // Header row
  const docHeader = createRef<Rect>();
  view.add(
    <Rect
      ref={docHeader}
      x={0}
      y={-160}
      width={1180}
      height={54}
      radius={10}
      fill={'#1a1220'}
      stroke={'#2c3954'}
      lineWidth={1}
      opacity={0}
    >
      <Txt text={'FROM'} x={-440} fontSize={22} fill={'#fbbf24'} fontFamily={'monospace'}/>
      <Txt text={'TO'} x={-220} fontSize={22} fill={'#fbbf24'} fontFamily={'monospace'}/>
      <Txt text={'BEHAVIOR'} x={140} fontSize={22} fill={'#fbbf24'} fontFamily={'monospace'} width={420} textAlign={'left'}/>
      <Txt text={'COVERED'} x={500} fontSize={22} fill={'#fbbf24'} fontFamily={'monospace'}/>
    </Rect>,
  );
  yield* docHeader().opacity(1, 0.4);

  type DocRow = {from: string; to: string; behavior: string};
  const docRows: DocRow[] = [
    {from: 'todo',    to: 'running', behavior: 'begin work; clear blockers'},
    {from: 'todo',    to: 'done',    behavior: 'skip & mark complete'},
    {from: 'running', to: 'done',    behavior: 'finalize; record duration'},
    {from: 'done',    to: 'todo',    behavior: 'reopen; restore state'},
    {from: 'parent',  to: '*',       behavior: 'cascade transition to subtasks'},
  ];
  const docRowYs = [-90, -30, 30, 90, 150];

  const docRowRefs: ReturnType<typeof createRef<Rect>>[] = [];
  const docCheckRefs: ReturnType<typeof createRef<Txt>>[] = [];

  for (let i = 0; i < docRows.length; i++) {
    const row = docRows[i];
    const rowRef = createRef<Rect>();
    const checkRef = createRef<Txt>();
    docRowRefs.push(rowRef);
    docCheckRefs.push(checkRef);
    view.add(
      <Rect
        ref={rowRef}
        x={0}
        y={docRowYs[i]}
        width={1180}
        height={54}
        radius={10}
        fill={'#0f1a2c'}
        stroke={'#2c3954'}
        lineWidth={1}
        opacity={0}
      >
        <Txt text={row.from} x={-440} fontSize={22} fill={'#e2e8f0'} fontFamily={'monospace'}/>
        <Txt text={row.to} x={-220} fontSize={22} fill={'#e2e8f0'} fontFamily={'monospace'}/>
        <Txt text={row.behavior} x={140} fontSize={20} fill={'#94a3b8'} fontFamily={'monospace'} width={420} textAlign={'left'}/>
        <Txt
          ref={checkRef}
          text={'OK'}
          x={500}
          fontSize={22}
          fill={'#34d399'}
          opacity={0}
          fontFamily={'monospace'}
        />
      </Rect>,
    );
  }

  for (let i = 0; i < docRowRefs.length; i++) {
    yield* docRowRefs[i]().opacity(1, 0.3);
    yield* docCheckRefs[i]().opacity(1, 0.25);
    yield* waitFor(0.18);
  }

  yield* waitFor(0.4);

  // ----- Caption -----
  const captionB = createRef<Txt>();
  view.add(
    <Txt
      ref={captionB}
      text={'the spec lives in the code.  every transition is accounted for.'}
      y={380}
      fontSize={24}
      fill={'#fbbf24'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );
  yield* captionB().opacity(1, 0.5);

  yield* waitFor(2);

  // =====================================================
  // FADE OUT SECTION B
  // =====================================================
  yield* all(
    sectionB().opacity(0, 0.4),
    docPanel().opacity(0, 0.4),
    docHeader().opacity(0, 0.4),
    captionB().opacity(0, 0.4),
    ...docRowRefs.map(r => r().opacity(0, 0.4)),
  );

  // =====================================================
  // CLOSING BANNER
  // =====================================================
  const closing = createRef<Rect>();
  view.add(
    <Rect
      ref={closing}
      width={1200}
      height={170}
      x={0}
      y={0}
      radius={18}
      fill={'#1a1220'}
      stroke={'#e2e8f0'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Handler map   ->   clean dispatch.'}
        y={-30}
        fill={'#34d399'}
        fontSize={28}
        fontFamily={'monospace'}
      />
      <Txt
        text={'Documentation  ->  complete coverage.'}
        y={28}
        fill={'#fbbf24'}
        fontSize={28}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* closing().opacity(1, 0.7);

  yield* waitFor(2.5);
});
