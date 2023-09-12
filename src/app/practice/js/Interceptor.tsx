'use client';

// import styles from './Interceptor.module.scss';
import { useEffect, useCallback, memo, useRef } from 'react';
export interface IInterceptor {}

type AspectFn = (..._p: any[]) => Promise<void>;

class InterceptorClass<T = any> {
  aspects: Array<AspectFn>;

  constructor() {
    this.aspects = [];
  }

  use(functor: AspectFn) {
    this.aspects.push(functor);
  }

  async run(context: T) {
    const aspects = this.aspects;
    const proc = aspects.reduceRight(
      (a, b) => {
        return async () => {
          await b(context, a);
        };
      },
      () => Promise.resolve(),
    );

    try {
      await proc();
    } catch (error) {
      console.log(error);
    }

    return context;
  }
}

const Interceptor: React.FC<IInterceptor> = (props: any) => {
  const ref = useRef<any>();
  function wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  const task = useCallback(function (id: number) {
    return async (ctx: any, next: AspectFn) => {
      console.log(`task ${id} begin`);
      ctx.count++;
      await wait(1000);
      console.log(`count: ${ctx.count}`);
      await next();
      console.log(`task ${id} end`);
    };
  }, []);

  useEffect(() => {
    ref.current = new InterceptorClass();
    ref.current.use(task(1));
    ref.current.use(task(2));
    ref.current.use(task(3));
    ref.current.use(task(4));
  }, [task]);

  return (
    <div>
      <button
        onClick={() => {
          ref.current?.run({ count: 0 });
        }}>
        洋葱模型
      </button>
    </div>
  );
};

export default memo(Interceptor);
