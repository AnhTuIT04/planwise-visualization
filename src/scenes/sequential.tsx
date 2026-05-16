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
};

export default makeScene2D(function* (view) {
  view.fill('#0b1020');

  const items: ItemNode[] = [];

  const startY = -360;
  const gap = 60;

  // =====================================================
  // TITLE
  // =====================================================

  const title = createRef<Txt>();

  view.add(
    <Txt
      ref={title}
      text={'Sequential Reordering'}
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

  for (let i = 0; i < 15; i++) {
    const rect = createRef<Rect>();
    const positionText = createRef<Txt>();

    items.push({
      id: i + 1,
      rect,
      positionText,
    });

    view.add(
      <Rect
        ref={rect}
        width={460}
        height={48}
        radius={8}
        fill={'#182031'}
        stroke={'#2c3954'}
        lineWidth={2}
        x={-180}
        y={startY + i * gap}
      >
        <Txt
          text={`Item ${i + 1}`}
          x={-120}
          fill={'white'}
          fontSize={24}
          fontFamily={'monospace'}
        />

        <Txt
          ref={positionText}
          text={`position: ${i + 1}`}
          x={100}
          fill={'#94a3b8'}
          fontSize={24}
          fontFamily={'monospace'}
        />
      </Rect>,
    );
  }

  yield* waitFor(1);

  // =====================================================
  // MOVE ITEM 10 -> POSITION 4
  // =====================================================

  const moving = items.find((i) => i.id === 10)!;

  yield* all(
    moving.rect().fill('#06b6d4', 0.5),
    moving.rect().scale(1.08, 0.5),
    moving.positionText().fill('#000', 0.5),
  );

  // ARROW
  const arrow = createRef<Line>();

  view.add(
    <Line
      ref={arrow}
      points={[
        [120, startY + 9 * gap],
        [120, startY + 3 * gap],
      ]}
      stroke={'#06b6d4'}
      lineWidth={4}
      endArrow
      opacity={0}
    />,
  );

  yield* arrow().opacity(1, 0.4);

  // =====================================================
  // STEP 1
  // PICK UP ITEM 10
  // =====================================================

  yield* all(
    moving.rect().zIndex(100),

    moving.rect().fill('#06b6d4', 0.5),
    moving.rect().scale(1.08, 0.5),

    // lift item visually
    moving.rect().x(-40, 0.6),
  );

  // =====================================================
  // STEP 2
  // SHIFT 4-9 DOWN
  // =====================================================

  yield* all(
    ...items
      .filter(
        (i) => i.id >= 4 && i.id <= 9,
      )
      .map((item) =>
        item.rect().y(
          item.rect().y() + gap,
          1,
          easeInOutCubic,
        ),
      ),
  );

  yield* waitFor(0.2);

  // =====================================================
  // STEP 3
  // INSERT ITEM 10 INTO POSITION 4
  // =====================================================

  yield* all(
    moving.rect().x(-180, 1),

    moving.rect().y(
      startY + 3 * gap,
      1,
      easeInOutCubic,
    ),
  );

  yield* waitFor(0.5);

  // =====================================================
  // SHOW PROBLEM PANEL
  // =====================================================

  const panel = createRef<Rect>();

  view.add(
    <Rect
      ref={panel}
      width={520}
      height={240}
      x={470}
      y={70}
      radius={18}
      fill={'#1a1220'}
      stroke={'#ef4444'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Problem'}
        y={-78}
        fill={'#ef4444'}
        fontSize={34}
        fontFamily={'monospace'}
      />

      <Txt
        text={
          'Moving one item requires \n updating multiple rows.'
        }
        y={12}
        fill={'white'}
        fontSize={28}
        lineHeight={42}
        fontFamily={'monospace'}
      />
    </Rect>,
  );

  yield* panel().opacity(1, 0.8);

  yield* waitFor(0.3);

  // =====================================================
  // FINAL ORDER
  // =====================================================

  const finalOrder = [
    1,
    2,
    3,
    10,
    4,
    5,
    6,
    7,
    8,
    9,
    11,
    12,
    13,
    14,
    15,
  ];

  // =====================================================
  // UPDATE POSITIONS SEQUENTIALLY
  // =====================================================

  for (let i = 0; i < finalOrder.length; i++) {
    const itemId = finalOrder[i];

    // only affected rows
    if (
      itemId !== 10 &&
      (itemId < 4 || itemId > 9)
    ) {
      continue;
    }

    const node = items.find(
      (n) => n.id === itemId,
    )!;

    const newPosition = i + 1;

    const color =
      itemId === 10
        ? '#06b6d4'
        : '#f59e0b';

    yield* all(
      node.rect().fill(color, 0.35),

      node.positionText().fill('#000', 0.5),

    );

    yield* node.positionText().text(
      `position: ${newPosition}`,
      0.45,
    );

    yield* waitFor(0.1);
  }

  yield* waitFor(0.8);

  // =====================================================
  // CONCLUSION
  // =====================================================

  const conclusion = createRef<Txt>();

  view.add(
    <Txt
      ref={conclusion}
      text={
        '7 affected rows\nmust be rewritten'
      }
      x={470}
      y={270}
      fill={'#f87171'}
      fontSize={38}
      lineHeight={54}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* conclusion().opacity(1, 1);

  yield* waitFor(2);
});