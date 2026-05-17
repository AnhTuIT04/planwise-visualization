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
  position: string;
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
      text={'Lexicographical Ordering'}
      y={-500}
      fontSize={44}
      fill={'white'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* title().opacity(1, 1);

  // =====================================================
  // INITIAL LIST (15 ITEMS)
  // =====================================================

  const initialPositions = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'
  ];

  for (let i = 0; i < initialPositions.length; i++) {
    const rect = createRef<Rect>();
    const positionText = createRef<Txt>();
    const pos = initialPositions[i];

    items.push({
      id: i + 1,
      rect,
      positionText,
      position: pos,
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
          text={`pos: "${pos}"`}
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
  // INSERTION DEMO: Item 10 between 'a' and 'b'
  // =====================================================

  const moving = items.find(n => n.id === 10)!;

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
        [120, startY + gap],
      ]}
      stroke={'#06b6d4'}
      lineWidth={6}
      endArrow
      opacity={0}
    />
  );
  yield* firstArrow().opacity(1, 0.4);

  // FORMULA PANEL
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
        text={'String Midpoint'}
        y={-52}
        fill={'#67e8f9'}
        fontSize={30}
        fontFamily={'monospace'}
      />
      <Txt
        ref={formulaText}
        text={'Between "a" and "b"'}
        y={20}
        fill={'white'}
        fontSize={34}
        fontFamily={'monospace'}
      />
    </Rect>
  );

  yield* formulaPanel().opacity(1, 0.8);
  yield* waitFor(0.5);
  yield* formulaText().text('Result: "an"', 0.8);

  // MOVE ITEM 10
  yield* all(
    moving.rect().x(-40, 0.6),
    moving.rect().zIndex(100),
  );

  // SHIFT ITEMS 2-9 DOWN
  yield* all(
    ...items
      .filter((i) => i.id >= 2 && i.id <= 9)
      .map((item) =>
        item.rect().y(item.rect().y() + gap, 0.8, easeInOutCubic),
      ),
  );

  yield* all(
    moving.rect().x(-180, 1),
    moving.rect().y(startY + gap, 1, easeInOutCubic),
    moving.positionText().text('pos: "an"', 0.8),
  );

  yield* firstArrow().opacity(0, 0.5);

  yield* waitFor(1);

  // =====================================================
  // SHOW INFINITE INSERTION
  // =====================================================

  yield* all(
    formulaPanel().opacity(0, 0.5),
  );

  const solutionPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={solutionPanel}
      width={620}
      height={160}
      x={550}
      y={-280}
      radius={18}
      fill={'#06281d'}
      stroke={'#34d399'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Infinite Growth'}
        y={-30}
        fill={'#34d399'}
        fontSize={34}
        fontFamily={'monospace'}
      />
      <Txt
        text={'Strings grow to avoid collisions'}
        y={30}
        fill={'white'}
        fontSize={26}
        fontFamily={'monospace'}
      />
    </Rect>
  );
  yield* solutionPanel().opacity(1, 0.8);

  const history = createRef<Txt>();
  view.add(
    <Txt
      ref={history}
      text={'"an"'}
      x={550}
      y={-10}
      fill={'#fbbf24'}
      fontSize={28}
      lineHeight={42}
      opacity={0}
      fontFamily={'monospace'}
      align={'left'}
    />
  );
  yield* history().opacity(1, 0.5);

  const moveIds = [11, 12, 13, 14, 15];
  const steps = ['"ah"', '"ad"', '"ab"', '"aan"', '"aah"'];
  const shiftedDownIds = [10, 2, 3, 4, 5, 6, 7, 8, 9];
  let lastMovedNode = moving;

  for (let i = 0; i < moveIds.length; i++) {
    const id = moveIds[i];
    const node = items.find(n => n.id === id)!;
    const nextPos = steps[i];

    yield* history().text(`${history().text()}\n${nextPos}`, 0.6);
    
    // ARROW FOR REPEATED MOVE
    const arrow = createRef<Line>();
    view.add(
      <Line
        ref={arrow}
        points={[
          [120, node.rect().y()],
          [120, startY + gap],
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
        node.rect().zIndex(200 + i),
        node.rect().x(-40, 0.5),
        arrow().opacity(1, 0.4),
    );

    lastMovedNode = node;

    // Shift previous items down to avoid overlap
    yield* all(
        ...items
            .filter(item => shiftedDownIds.includes(item.id))
            .map(item => item.rect().y(item.rect().y() + gap, 0.5, easeInOutCubic))
    );

    shiftedDownIds.push(id);

    // Move to gap
    yield* all(
        node.rect().y(startY + gap, 0.8, easeInOutCubic),
        node.rect().x(-180, 0.8),
        node.positionText().text(`pos: ${nextPos}`, 0.8),
        arrow().opacity(0, 0.5),
    );

    yield* waitFor(0.2);
  }

  // =====================================================
  // FINAL CONCLUSION
  // =====================================================
  yield* all(
      solutionPanel().opacity(0, 0.5),
      history().opacity(0, 0.5),
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
        text={'Standard for modern task managers\nInfinite precision with string keys'}
        fill={'#e2e8f0'}
        fontSize={28}
        lineHeight={46}
        fontFamily={'monospace'}
      />
    </Rect>
  );

  yield* conclusionPanel().opacity(1, 1);
  yield* waitFor(3);
});
