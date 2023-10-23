'use client';

import { Card, Space } from 'antd';
import Image from 'next/image';
import styles from './AnimationUnderline.module.scss';
import bg from './img/bg.jpeg';
import title from './img/back1.png';
import hero from './img/back2.png';
import cardBg from './img/back3.jpg';
export interface IAnimationUnderline {}

const AnimationUnderline: React.FC<IAnimationUnderline> = () => {
  return (
    <div className={styles.component} style={{ paddingTop: 20 }}>
      <Space direction='vertical' size={16} style={{ width: '100%' }}>
        <Card title={'背景色渐变动画'}>
          <h2 className={styles.title}>
            <span>
              背景色渐变-背景色渐变-背景色渐变-背景色渐变-背景色渐变-背景色渐变
            </span>
          </h2>
        </Card>
        <Card title={'磨砂效果'}>
          <div className={styles.opacity}>
            <div>
              <h1>磨砂效果-磨砂效果-滤镜</h1>
              <div className={styles.cover}></div>
            </div>
            <div className={styles.img}>
              <Image width={384} height={240} src={bg} alt='' />
              <div className={styles.hover} />
            </div>
          </div>
        </Card>
        <Card title={'3d效果'}>
          <Image
            style={{ display: 'none' }}
            className={styles.cover1}
            width={384}
            height={240}
            src={cardBg}
            alt=''
          />
          <div className={styles.threed}>
            <Image
              className={styles.cover}
              width={200}
              height={240}
              src={cardBg}
              alt=''
            />

            <Image
              className={styles.hero}
              width={384}
              height={240}
              src={hero}
              alt=''
            />
            <Image
              className={styles.title}
              width={384}
              height={240}
              src={title}
              alt=''
            />
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default AnimationUnderline;
