'use client';

/* Core */
import { useState } from 'react';
import useRective from '@/hooks/useRective';
/* Instruments */
import {
  counterSlice,
  useSelector,
  useDispatch,
  incrementAsync,
  incrementIfOddAsync,
} from '@/lib/redux';

import styles from './counter.module.css';

export const Counter = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);
  const rective = useRective<Record<string, any>>({ incrementAmount: 2 });

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() => {
            rective.incrementAmount += 1;
          }}>
          {rective.incrementAmount}
        </button>
        <button
          className={styles.button}
          aria-label='Decrement value'
          onClick={() => dispatch(counterSlice.actions.decrement())}>
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label='Increment value'
          onClick={() => dispatch(counterSlice.actions.increment())}>
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label='Set increment amount'
          value={rective.incrementAmount}
          onChange={(e) => {
            rective.incrementAmount = Number(e.target.value ?? 0);
          }}
        />
        <button
          className={styles.button}
          onClick={() =>
            dispatch(
              counterSlice.actions.incrementByAmount(rective.incrementAmount),
            )
          }>
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(incrementAsync(rective.incrementAmount))}>
          Add Async {rective.incrementAmount}
        </button>
        <button
          className={styles.button}
          onClick={() =>
            dispatch(incrementIfOddAsync(rective.incrementAmount))
          }>
          Add If Odd
        </button>
      </div>
    </div>
  );
};
