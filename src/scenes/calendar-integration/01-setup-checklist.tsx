// =====================================================
// CALENDAR INTEGRATION
// SCENE 1 — SETUP CHECKLIST (the four moving parts)
// =====================================================

import {
  makeScene2D,
  Rect,
  Txt,
  Circle,
  Line,
} from '@motion-canvas/2d';

import {
  all,
  createRef,
  waitFor,
} from '@motion-canvas/core';

type ChecklistItem = {
  index: number;
  title: string;
  subtitle: string;
  badgeColor: string;
};

const items: ChecklistItem[] = [
  {
    index: 1,
    title: 'Connect to Google Calendar',
    subtitle: 'OAuth handshake — get + store tokens',
    badgeColor: '#3b82f6',
  },
  {
    index: 2,
    title: 'Store events locally',
    subtitle: 'PostgreSQL — our source of truth',
    badgeColor: '#10b981',
  },
  {
    index: 3,
    title: 'Register a webhook',
    subtitle: 'Google → us  when calendar changes',
    badgeColor: '#f59e0b',
  },
  {
    index: 4,
    title: 'Open a WebSocket channel',
    subtitle: 'us → Frontend  for live UI updates',
    badgeColor: '#06b6d4',
  },
];

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
      text={'Setting up calendar sync'}
      y={-440}
      fontSize={56}
      fill={'white'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  view.add(
    <Txt
      ref={subtitle}
      text={'Four moving parts you need'}
      y={-370}
      fontSize={28}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* title().opacity(1, 0.8);
  yield* subtitle().opacity(1, 0.6);
  yield* waitFor(0.4);

  // =====================================================
  // CHECKLIST ROWS
  // =====================================================

  const rowRefs: ReturnType<typeof createRef<Rect>>[] = [];
  const badgeRefs: ReturnType<typeof createRef<Circle>>[] = [];
  const badgeTextRefs: ReturnType<typeof createRef<Txt>>[] = [];
  const checkRefs: ReturnType<typeof createRef<Line>>[] = [];

  const startY = -210;
  const rowGap = 130;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const row = createRef<Rect>();
    const badge = createRef<Circle>();
    const badgeText = createRef<Txt>();
    const check = createRef<Line>();
    rowRefs.push(row);
    badgeRefs.push(badge);
    badgeTextRefs.push(badgeText);
    checkRefs.push(check);

    const y = startY + i * rowGap;

    // Row container
    view.add(
      <Rect
        ref={row}
        width={1100}
        height={110}
        radius={16}
        fill={'#101827'}
        stroke={'#2c3954'}
        lineWidth={2}
        x={0}
        y={y}
        opacity={0}
      >
        <Txt
          text={item.title}
          x={-150}
          y={-18}
          fontSize={30}
          fill={'white'}
          fontFamily={'monospace'}
        />

        <Txt
          text={item.subtitle}
          x={-150}
          y={22}
          fontSize={22}
          fill={'#94a3b8'}
          fontFamily={'monospace'}
        />
      </Rect>,
    );

    // Badge circle on the left side of the row
    view.add(
      <Circle
        ref={badge}
        width={70}
        height={70}
        fill={item.badgeColor}
        stroke={item.badgeColor}
        lineWidth={3}
        x={-470}
        y={y}
        opacity={0}
      />,
    );

    view.add(
      <Txt
        ref={badgeText}
        text={item.index.toString()}
        x={-470}
        y={y}
        fontSize={32}
        fill={'#0b1020'}
        opacity={0}
        fontFamily={'monospace'}
      />,
    );

    // Check mark (hidden initially, revealed later)
    view.add(
      <Line
        ref={check}
        points={[[-485, y + 4], [-475, y + 16], [-455, y - 10]]}
        stroke={'#0b1020'}
        lineWidth={6}
        lineCap={'round'}
        lineJoin={'round'}
        opacity={0}
      />,
    );
  }

  // Animate rows in one by one
  for (let i = 0; i < items.length; i++) {
    yield* all(
      rowRefs[i]().opacity(1, 0.4),
      badgeRefs[i]().opacity(1, 0.4),
      badgeTextRefs[i]().opacity(1, 0.4),
    );
    yield* waitFor(0.4);
  }

  yield* waitFor(0.6);

  // =====================================================
  // CHECK MARKS — show all four are ready
  // =====================================================

  for (let i = 0; i < items.length; i++) {
    yield* all(
      badgeTextRefs[i]().opacity(0, 0.25),
      checkRefs[i]().opacity(1, 0.25),
    );
    yield* waitFor(0.12);
  }

  yield* waitFor(0.6);

  // =====================================================
  // CLOSING BANNER
  // =====================================================

  const banner = createRef<Rect>();
  view.add(
    <Rect
      ref={banner}
      width={1000}
      height={90}
      x={0}
      y={420}
      radius={16}
      fill={'#1a1220'}
      stroke={'#e2e8f0'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'All four wired up  →  the calendar stays in sync.'}
        fill={'#e2e8f0'}
        fontSize={26}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* banner().opacity(1, 0.7);

  yield* waitFor(2.5);
});
