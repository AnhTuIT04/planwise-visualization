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
  position: number;
};

export default makeScene2D(function* (view) {
  view.fill('#0b1020');

  const items: ItemNode[] = [];

  const startY = -400;
  const gap = 60;

  // =====================================================
  // TITLE
  // =====================================================

  const title = createRef<Txt>();

  view.add(
    <Txt
      ref={title}
      text={'Fractional Indexing'}
      y={-500}
      fontSize={44}
      fill={'white'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* title().opacity(1, 1);

  // =====================================================
  // CREATE INITIAL LIST (15 ITEMS)
  // =====================================================

  for (let i = 0; i < 15; i++) {
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
        height={48}
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
    moving.positionText().fill('#000', 0.5),
  );

  // ARROW FOR FIRST MOVE
  const firstArrow = createRef<Line>();
  view.add(
    <Line
      ref={firstArrow}
      points={[
        [120, startY + 9 * gap],
        [120, startY + 3 * gap],
      ]}
      stroke={'#06b6d4'}
      lineWidth={6}
      endArrow
      opacity={0}
    />
  );
  yield* firstArrow().opacity(1, 0.4);

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
      x={550}
      y={-280}
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
    moving.rect().x(-40, 0.6),
    moving.rect().zIndex(100),
  );

  // SHIFT ITEMS 4-9 DOWN
  yield* all(
    ...items
      .filter((i) => i.id >= 4 && i.id <= 9)
      .map((item) =>
        item.rect().y(item.rect().y() + gap, 0.8, easeInOutCubic),
      ),
  );

  yield* all(
    moving.rect().x(-180, 1),
    moving.rect().y(
      startY + 3 * gap,
      1,
      easeInOutCubic,
    ),
  );

  yield* firstArrow().opacity(0, 0.5);

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
      x={550}
      y={-80}
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
    formulaPanel().opacity(0, 0.5),
    benefit().opacity(0, 0.5),
  );

  const problemPanel = createRef<Rect>();

  view.add(
    <Rect
      ref={problemPanel}
      width={620}
      height={160}
      x={550}
      y={-280}
      radius={18}
      fill={'#2a0f0f'}
      stroke={'#ef4444'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'The Precision Issue'}
        y={-30}
        fill={'#fca5a5'}
        fontSize={34}
        fontFamily={'monospace'}
      />
      <Txt
        text={'Repeated inserts shrink the gap'}
        y={30}
        fill={'white'}
        fontSize={26}
        fontFamily={'monospace'}
      />
    </Rect>
  );

  yield* problemPanel().opacity(1, 0.8);

  yield* waitFor(0.5);

  // =====================================================
  // REPEATED INSERTS
  // =====================================================

  const moveIds = [11, 12, 13, 14, 15];
  let currentTop = 3.0;
  let currentBottom = 3.5;

  const history = createRef<Txt>();

  view.add(
    <Txt
      ref={history}
      text={'3.5'}
      x={550}
      y={-10}
      fill={'#fbbf24'}
      fontSize={28}
      lineHeight={42}
      opacity={0}
      fontFamily={'monospace'}
      align={'left'}
    />,
  );

  yield* history().opacity(1, 0.5);

  // Track which items are currently in the gap or below it
  const shiftedDownIds = [10, 4, 5, 6, 7, 8, 9];
  let lastMovedNode = moving;

  for (let step = 0; step < moveIds.length; step++) {
    const id = moveIds[step];
    const node = items.find(n => n.id === id)!;

    const newPosition = (currentTop + currentBottom) / 2;
    const text = step === 0
        ? `3.5\n${newPosition}`
        : `${history().text()}\n${newPosition}`;

    currentBottom = newPosition;

    // ARROW FOR REPEATED MOVE
    const arrow = createRef<Line>();
    view.add(
      <Line
        ref={arrow}
        points={[
          [120, node.rect().y()],
          [120, startY + 3 * gap],
        ]}
        stroke={'#06b6d4'}
        lineWidth={6}
        endArrow
        opacity={0}
      />
    );

    // Reset previous item and Highlight current one
    yield* all(
      lastMovedNode.rect().fill('#182031', 0.4),
      lastMovedNode.rect().scale(1, 0.4),
      lastMovedNode.positionText().fill('#94a3b8', 0.4),
      
      node.rect().fill('#06b6d4', 0.4),
      node.rect().scale(1.08, 0.4),
      node.positionText().fill('#000', 0.4),
      node.rect().zIndex(200 + step),
      node.rect().x(-40, 0.5),
      arrow().opacity(1, 0.4),
    );

    lastMovedNode = node;

    // Shift previous items down to avoid overlap
    yield* all(
        ...items
            .filter(i => shiftedDownIds.includes(i.id))
            .map(item => item.rect().y(item.rect().y() + gap, 0.5, easeInOutCubic))
    );

    shiftedDownIds.push(id);

    // Move to gap and update text
    yield* all(
      node.rect().y(startY + 3 * gap, 0.8, easeInOutCubic),
      node.rect().x(-180, 0.8),
      node.positionText().text(`position: ${newPosition.toString().substring(0, 10)}`, 0.8),
      history().text(text, 0.8),
      arrow().opacity(0, 0.5),
    );

    yield* waitFor(0.2);
  }

  // =====================================================
  // SHOW EXTREME PRECISION
  // =====================================================

  const precisionPanel = createRef<Rect>();

  view.add(
    <Rect
      ref={precisionPanel}
      width={620}
      height={180}
      x={550}
      y={220}
      radius={20}
      fill={'#2a0f0f'}
      stroke={'#ef4444'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Eventually becomes:'}
        y={-48}
        fill={'#fca5a5'}
        fontSize={28}
        fontFamily={'monospace'}
      />

      <Txt
        text={'3.000000000000xx'}
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

  yield* all(
      problemPanel().opacity(0, 0.5),
      history().opacity(0, 0.5),
      precisionPanel().opacity(0, 0.5),
  );

  const conclusionPanel = createRef<Rect>();

  view.add(
    <Rect
      ref={conclusionPanel}
      width={680}
      height={180}
      x={550}
      y={0}
      radius={18}
      fill={'#1a1220'}
      stroke={'#e2e8f0'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Fractional indexing reduces updates\nbut breaks at extreme precision'}
        fill={'#e2e8f0'}
        fontSize={28}
        lineHeight={46}
        fontFamily={'monospace'}
      />
    </Rect>,
  );

  yield* conclusionPanel().opacity(1, 1);

  yield* waitFor(3);
});