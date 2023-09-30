import React, { useRef } from 'react';
import style from './index.module.scss';

const Drag = () => {
  const list = useRef<HTMLUListElement | null>(null);
  const sourceDom = useRef<HTMLLIElement | null>(null);

  return (
    <div className={style.dragContainer}>
      <ul
        ref={list}
        onDragStart={(e: any) => {
          e.dataTransfer.effectAllowed = 'move';
          setTimeout(() => {
            e.target.classList.add(style.moving);
          }, 0);
          sourceDom.current = e.target;
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragEnter={(e: any) => {
          // 进入自身或者list
          if (e.target === list.current || e.target === sourceDom.current) {
            return;
          }
          const children = list.current ? [...list.current?.children] : [];
          const sourceIndex = children.indexOf(sourceDom.current!);
          const targetIndex = children.indexOf(e.target);

          if (sourceIndex < targetIndex) {
            list.current?.insertBefore(
              sourceDom.current!,
              (e.target as HTMLDivElement).nextElementSibling,
            );
          } else {
            list.current?.insertBefore(sourceDom.current!, e.target);
          }
        }}
        onDragEnd={(e: any) => {
          e.target.classList.remove(style.moving);
        }}
        className={style.list}>
        {new Array(5).fill('').map((item, index) => (
          <li key={index} draggable={true} className={style.listItem}>
            {index + 1}
          </li>
        ))}

        {/* <li className={style.listItem}>2</li>
        <li className={style.listItem}>3</li>
        <li className={style.listItem}>4</li>
        <li className={style.listItem}>5</li> */}
      </ul>
    </div>
  );
};

export default Drag;
