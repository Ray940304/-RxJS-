import './style.css';

import { fromEvent, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// 開始按鈕
const startButton = document.querySelector('#start');
// 計數按鈕
const countButton = document.querySelector('#count');
// 發生錯誤按鈕
const errorButton = document.querySelector('#error');
// 計數完成按鈕
const completeButton = document.querySelector('#complete');

// 計數器內容
const currentCounterLabel = document.querySelector('#currentCounter');
// 只顯示偶數的計數器內容
const evenCounterLabel = document.querySelector('#evenCounter');
// 目前狀態
const statusLabel = document.querySelector('#status');

// 計數器的值
let counter = 0;
// 自訂 subject 來通知計數器值改變
let counter$: Subject<number>;

// 「開始新的計數器」按鈕事件訂閱
fromEvent(startButton, 'click').subscribe(() => {
  counter$ = new Subject();
  counter = 0;

  statusLabel.innerHTML = '目前狀態：開始計數';

  // 訂閱 counter$ 並顯示目前計數值
  // 以下程式有優化的空間，先想想，之後來調整
  // counter$.subscribe(data => {
  //   currentCounterLabel.innerHTML = `目前計數：${data}`;
  //   if (data % 2 == 0) {
  //     evenCounterLabel.innerHTML = `偶數計數：${data}`;
  //   }
  // });

  counter$.subscribe((data) => {
    currentCounterLabel.innerHTML = `目前計數：${data}`;
  });

  const evenCounter$ = counter$.pipe(filter((data) => data % 2 === 0));
  evenCounter$.subscribe((data) => {
    evenCounterLabel.innerHTML = `偶數計數：${data}`;
  });

  // 只處理「顯示狀態」邏輯
  counter$.subscribe({
    next: () => {}, // 這行其實可以不加，因為我們目的只是處理「錯誤」跟「完成」，沒處裡「計數」
    error: (message) => {
      statusLabel.innerHTML = `目前狀態：錯誤 -> ${message}`;
    },
    complete: () => {
      statusLabel.innerHTML = '目前狀態：完成';
    },
  });

  // 送出預設值
  counter$.next(counter);
});

// 「計數」按鈕事件訂閱
fromEvent(countButton, 'click').subscribe(() => {
  counter$.next(++counter);
});

fromEvent(errorButton, 'click').subscribe(() => {
  const reason = prompt('請輸入錯誤訊息');
  counter$.error(reason || 'error');
});

fromEvent(completeButton, 'click').subscribe(() => {
  counter$.complete();
});
