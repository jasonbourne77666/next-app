'use client';

import styles from './AnimationUnderline.module.scss';

export interface IAnimationUnderline {}

const AnimationUnderline: React.FC<IAnimationUnderline> = ({}) => {
  return (
    <div className={styles.component}>
      <h2 className={styles.title}>
        <span>
          测试数据-测试数据-测试数据-测试数据-测试数据-测试数据-测试数据-测试数据
        </span>
      </h2>
    </div>
  );
};

export default AnimationUnderline;
