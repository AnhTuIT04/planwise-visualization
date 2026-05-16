// =====================================================
// SCENE 2
// FRACTIONAL INDEXING
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
  easeInOutCubic,
} from '@motion-canvas/core';

type ItemNode = {
  id: number;
  rect: ReturnType<typeof createRef<Rect>>;
  positionText: ReturnType<typeof createRef<Txt>>;
  y: number;
  position: number;
};

export default makeScene2D(function* (view) {
  view.fill('#0b1020');

  const items: ItemNode[] = [];

  const startY = -320;
  const gap = 70;

  // =====================================================
  // TITLE
  // =====================================================

  const title = createRef<Txt>();

  view.add(
    <Txt
      ref={title}
      text={'Fractional Indexing'}
      y={-470}
      fontSize={44}
      fill={'white'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* title().opacity(1, 1);

  // =====================================================
  // CREATE INITIAL LIST
  // =====================================================

  for (let i = 0; i < 10; i++) {
    const rect = createRef<Rect>();
    const positionText = createRef<Txt>();

    const position = i + 1;

    items.push({
      id: i + 1,
      rect,
      positionText,
      y: startY + i * gap,
      position,
    });

    view.add(
      <Rect
        ref={rect}
        width={500}
        height={52}
        radius={10}
        fill={'#182031'}
        stroke={'#2c3954'}
        lineWidth={2}
        x={-180}
        y={startY + i * gap}
      >
        <Txt
          text={`Item ${i + 1}`}
          x={-130}
          fill={'white'}
          fontSize={24}
          fontFamily={'monospace'}
        />

        <Txt
          ref={positionText}
          text={`position: ${position.toFixed(1)}`}
          x={120}
          fill={'#94a3b8'}
          fontSize={24}
          fontFamily={'monospace'}
        />
      </Rect>,
    );
  }

  yield* waitFor(1);

  // =====================================================
  // MOVE ITEM 10 NEAR POSITION 4
  // =====================================================

  const moving = items.find((i) => i.id === 10)!;

  yield* all(
    moving.rect().fill('#06b6d4', 0.5),
    moving.rect().scale(1.08, 0.5),
  );

  // =====================================================
  // SHOW TARGET GAP
  // =====================================================

  const targetLine = createRef<Line>();

  view.add(
    <Line
      ref={targetLine}
      points={[
        [120, startY + 2.5 * gap],
        [120, startY + 3.5 * gap],
      ]}
      stroke={'#06b6d4'}
      lineWidth={6}
      endArrow
      opacity={0}
    />,
  );

  yield* targetLine().opacity(1, 0.5);

  // =====================================================
  // SHOW FORMULA PANEL
  // =====================================================

  const formulaPanel = createRef<Rect>();
  const formulaText = createRef<Txt>();

  view.add(
    <Rect
      ref={formulaPanel}
      width={620}
      height={180}
      x={500}
      y={-120}
      radius={18}
      fill={'#101827'}
      stroke={'#06b6d4'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Compute New Position'}
        y={-52}
        fill={'#67e8f9'}
        fontSize={30}
        fontFamily={'monospace'}
      />

      <Txt
        ref={formulaText}
        text={'(3.0 + 4.0) / 2 = 3.5'}
        y={20}
        fill={'white'}
        fontSize={34}
        fontFamily={'monospace'}
      />
    </Rect>,
  );

  yield* formulaPanel().opacity(1, 0.8);

  yield* waitFor(0.5);

  // =====================================================
  // MOVE ONLY ONE ITEM
  // =====================================================

  yield* all(
    moving.rect().x(-40, 0.8),
    moving.rect().y(
      startY + 3 * gap,
      1,
      easeInOutCubic,
    ),
  );

  yield* moving.positionText().text(
    'position: 3.5',
    0.8,
  );

  moving.position = 3.5;

  yield* waitFor(0.5);

  // =====================================================
  // BENEFIT PANEL
  // =====================================================

  const benefit = createRef<Rect>();

  view.add(
    <Rect
      ref={benefit}
      width={620}
      height={160}
      x={500}
      y={120}
      radius={18}
      fill={'#06281d'}
      stroke={'#10b981'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Only one row updated'}
        y={-18}
        fill={'#34d399'}
        fontSize={34}
        fontFamily={'monospace'}
      />

      <Txt
        text={'No mass rewrites required'}
        y={38}
        fill={'white'}
        fontSize={28}
        fontFamily={'monospace'}
      />
    </Rect>,
  );

  yield* benefit().opacity(1, 0.8);

  yield* waitFor(1.2);

  // =====================================================
  // PROBLEM SECTION
  // =====================================================

  yield* all(
    formulaPanel().opacity(0.15, 0.5),
    benefit().opacity(0.15, 0.5),
  );

  const problemTitle = createRef<Txt>();

  view.add(
    <Txt
      ref={problemTitle}
      text={'But repeated inserts create precision issues'}
      y={370}
      fill={'#f87171'}
      fontSize={34}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* problemTitle().opacity(1, 0.8);

  yield* waitFor(0.5);

  // =====================================================
  // REPEATED INSERTS
  // =====================================================

  const insertOrder = [8, 6, 9, 10, 12, 14, 15];

  let currentTop = 3.0;
  let currentBottom = 3.5;

  const history = createRef<Txt>();

  view.add(
    <Txt
      ref={history}
      text={'3.5'}
      x={500}
      y={320}
      fill={'#fbbf24'}
      fontSize={28}
      lineHeight={42}
      opacity={0}
      fontFamily={'monospace'}
      align={'left'}
    />,
  );

  yield* history().opacity(1, 0.5);

  for (let step = 0; step < insertOrder.length; step++) {
    const id = insertOrder[step];

    const newPosition =
      (currentTop + currentBottom) / 2;

    const text =
      step === 0
        ? `3.5\n${newPosition}`
        : `${history().text()}\n${newPosition}`;

    // fake floating precision growth
    currentBottom = newPosition;

    // animate one item entering
    const floating = createRef<Rect>();
    const floatingText = createRef<Txt>();

    view.add(
      <Rect
        ref={floating}
        width={500}
        height={52}
        radius={10}
        fill={'#f59e0b'}
        stroke={'#fbbf24'}
        lineWidth={2}
        x={220}
        y={-420}
        opacity={0}
      >
        <Txt
          text={`Item ${id}`}
          x={-130}
          fill={'black'}
          fontSize={24}
          fontFamily={'monospace'}
        />

        <Txt
          ref={floatingText}
          text={`position: ${newPosition}`}
          x={120}
          fill={'black'}
          fontSize={22}
          fontFamily={'monospace'}
        />
      </Rect>,
    );

    yield* all(
      floating().opacity(1, 0.3),
      floating().y(
        startY + 3 * gap,
        0.8,
        easeInOutCubic,
      ),
    );

    yield* history().text(text, 0.5);

    yield* waitFor(0.25);

    yield* floating().opacity(0.15, 0.4);
  }

  // =====================================================
  // SHOW EXTREME PRECISION
  // =====================================================

  const precisionPanel = createRef<Rect>();

  view.add(
    <Rect
      ref={precisionPanel}
      width={700}
      height={180}
      y={430}
      radius={20}
      fill={'#2a0f0f'}
      stroke={'#ef4444'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Eventually positions become:'}
        y={-48}
        fill={'#fca5a5'}
        fontSize={28}
        fontFamily={'monospace'}
      />

      <Txt
        text={'3.000000000000000000xx'}
        y={30}
        fill={'white'}
        fontSize={34}
        fontFamily={'monospace'}
      />
    </Rect>,
  );

  yield* precisionPanel().opacity(1, 1);

  yield* waitFor(0.5);

  // =====================================================
  // FINAL CONCLUSION
  // =====================================================

  const finalText = createRef<Txt>();

  view.add(
    <Txt
      ref={finalText}
      text={
        'Fractional indexing reduces updates\nbut floating-point precision eventually breaks down'
      }
      y={560}
      fill={'#e2e8f0'}
      fontSize={30}
      lineHeight={46}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* finalText().opacity(1, 1);

  yield* waitFor(2);
});