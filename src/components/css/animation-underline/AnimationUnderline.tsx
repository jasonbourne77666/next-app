import styles from './AnimationUnderline.module.scss';

export interface IAnimationUnderline {
  sampleTextProp: string;
}

const AnimationUnderline: React.FC<IAnimationUnderline> = ({
  sampleTextProp,
}) => {
  return (
    <div className={styles.component}>
      <h2 className={styles.title}>
        <span>{sampleTextProp}</span>
      </h2>
    </div>
  );
};

export default AnimationUnderline;
