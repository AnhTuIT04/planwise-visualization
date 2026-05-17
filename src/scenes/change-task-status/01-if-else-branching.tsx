// =====================================================
// CHANGE TASK STATUS
// SCENE 1 — IF/ELSE BRANCHING (the problem)
//   Walk through the four transitions, add an if per case,
//   then show subtasks double everything.
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
  // TITLE
  // =====================================================

  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();

  view.add(
    <Txt
      ref={title}
      text={"Changing a task's status"}
      y={-470}
      fontSize={52}
      fill={'white'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  view.add(
    <Txt
      ref={subtitle}
      text={'how many branches does this take?'}
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
  // CODE PANEL (left)
  // =====================================================

  const codePanel = createRef<Rect>();
  view.add(
    <Rect
      ref={codePanel}
      x={-380}
      y={20}
      width={1020}
      height={560}
      radius={16}
      fill={'#101827'}
      stroke={'#2c3954'}
      lineWidth={2}
      opacity={0}
    />,
  );
  yield* codePanel().opacity(1, 0.5);

  const fnSig = createRef<Txt>();
  view.add(
    <Txt
      ref={fnSig}
      text={'function onChange(from, to, task) {'}
      x={-380}
      y={-220}
      width={960}
      textAlign={'left'}
      fontSize={24}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  const fnClose = createRef<Txt>();
  view.add(
    <Txt
      ref={fnClose}
      text={'}'}
      x={-380}
      y={240}
      width={960}
      textAlign={'left'}
      fontSize={24}
      fill={'#94a3b8'}
      opacity={0}
      fontFamily={'monospace'}
    />,
  );

  yield* all(fnSig().opacity(1, 0.4), fnClose().opacity(1, 0.4));

  // Pre-create branch lines, fade in one at a time below
  const branchData = [
    "  if (from==='todo'    && to==='running') handleStart(task);",
    "  if (from==='todo'    && to==='done')    handleComplete(task);",
    "  if (from==='running' && to==='done')    handleFinish(task);",
    "  if (from==='done'    && to==='todo')    handleReopen(task);",
  ];
  const branchYs = [-140, -80, -20, 40];

  const branchRefs: ReturnType<typeof createRef<Txt>>[] = [];
  for (let i = 0; i < branchData.length; i++) {
    const ref = createRef<Txt>();
    branchRefs.push(ref);
    view.add(
      <Txt
        ref={ref}
        text={branchData[i]}
        x={-380}
        y={branchYs[i]}
        width={960}
        textAlign={'left'}
        fontSize={22}
        fill={'#e2e8f0'}
        opacity={0}
        fontFamily={'monospace'}
      />,
    );
  }

  // =====================================================
  // COUNTER CARD (right)
  // =====================================================

  const counterCard = createRef<Rect>();
  const counterValue = createRef<Txt>();
  view.add(
    <Rect
      ref={counterCard}
      x={620}
      y={-140}
      width={420}
      height={200}
      radius={16}
      fill={'#182031'}
      stroke={'#2c3954'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'BRANCHES'}
        y={-50}
        fontSize={26}
        fill={'#94a3b8'}
        fontFamily={'monospace'}
      />
      <Txt
        ref={counterValue}
        text={'0'}
        y={30}
        fontSize={80}
        fill={'#06b6d4'}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* counterCard().opacity(1, 0.5);
  yield* waitFor(0.3);

  // =====================================================
  // REVEAL BRANCHES — counter ticks up
  // =====================================================

  for (let i = 0; i < branchRefs.length; i++) {
    yield* all(
      branchRefs[i]().opacity(1, 0.4),
      counterValue().text(String(i + 1), 0.4),
    );
    yield* waitFor(0.5);
  }

  yield* waitFor(0.5);

  // =====================================================
  // SUBTASK MULTIPLIER
  // =====================================================

  const subtaskCard = createRef<Rect>();
  view.add(
    <Rect
      ref={subtaskCard}
      x={620}
      y={120}
      width={420}
      height={170}
      radius={16}
      fill={'#1a1220'}
      stroke={'#f59e0b'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'task has subtasks?'}
        y={-40}
        fontSize={22}
        fill={'#94a3b8'}
        fontFamily={'monospace'}
      />
      <Txt
        text={'× 2  for every branch'}
        y={5}
        fontSize={28}
        fill={'#fbbf24'}
        fontFamily={'monospace'}
      />
      <Txt
        text={'(self-only  vs.  cascade to children)'}
        y={48}
        fontSize={18}
        fill={'#94a3b8'}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* subtaskCard().opacity(1, 0.5);
  yield* waitFor(0.3);

  // Flash each existing branch amber → back to default
  for (let i = 0; i < branchRefs.length; i++) {
    yield* branchRefs[i]().fill('#fbbf24', 0.18);
    yield* branchRefs[i]().fill('#e2e8f0', 0.18);
  }

  // Counter explodes 4 → 8 and turns amber
  yield* all(
    counterValue().text('8', 0.5),
    counterValue().fill('#f59e0b', 0.5),
  );
  yield* waitFor(0.6);

  // =====================================================
  // PROBLEM PANEL
  // =====================================================

  const problemPanel = createRef<Rect>();
  view.add(
    <Rect
      ref={problemPanel}
      x={0}
      y={420}
      width={1200}
      height={130}
      radius={16}
      fill={'#1a1220'}
      stroke={'#ef4444'}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        text={'Too many branches.'}
        y={-25}
        fontSize={28}
        fill={'#fca5a5'}
        fontFamily={'monospace'}
      />
      <Txt
        text={'Hard to maintain.  Hard to scale.'}
        y={20}
        fontSize={24}
        fill={'#fca5a5'}
        fontFamily={'monospace'}
      />
    </Rect>,
  );
  yield* problemPanel().opacity(1, 0.6);

  yield* waitFor(2.5);
});
