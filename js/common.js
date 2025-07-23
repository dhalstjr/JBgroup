window.addEventListener("DOMContentLoaded", function () {
  // 이 코드가 필요한 이유는 scroll이벤트와 resize이벤트가 많이 있는 js이기에 이런 이벤트마다 함수를 무제한으로 실행되면 성능이 저하될 수 밖에 없기에 일정 간격마다 한번만 실행되도록 하는 함수가 필요한 것이다.
  // window.throttle는 함수의 실행 횟수를 제한하여, 성능 저하를 방지하는 기술.

  // func : 실행하고 싶은 함수
  // limit : 몇 밀리초마다 1번만 실행할 지 설정(밀리초 단위)
  window._throttle = (func, limit) => {
    // inThrottle가 true일 때 실행을 막고, false일 때만 실행합니다.
    let inThrottle;

    // 반환하는 함수
    // return function(){} 문법은 함수를 반환하는 함수를 정의하는 방법이다. 즉, 함수를 다른 함수로 반환하도록 하는 기능을 말한다.
    // 이렇게 반환된 함수는 필요할 때 호출하여 사용할 수 있음. 이 기능은 클로저, 고차 함수, 부분 적용 함수 등을 구현할 때 유용하게 사용된다.
    // 이해가 잘 안가..
    return function () {
      const args = arguments; // arguments 객체는 함수 호출 시 전달된 인수에 대한 정보를 담고 있는 유사 배열 객체, 함수 내에서 별도의 매개변수 선언 없이도 함수에 전달된 모든 인수에 접근할 수 있도록 해준다.
      const context = this; // apply 메서드를 위해서.

      // 일단 코드의 작동 흐름은 실행하려고 하면,
      // inThrottle가 false이면, func를 실행.
      // func를 실행하는 동안 inThrottle를 true로 변경,
      // limit ms(밀리초)가 실행하고 지난 후 inThrottle를 다시 false로 변경 -> 이렇게 실행하고 나서 다시 실행할 수 있도록 하는 역할
      // 그러니까 inThrottle가 true이면 함수가 실행되지 않는다는 말이다.
      if (!inThrottle) {
        func.apply(context, args); // apply메서드는 함수를 호출할 때 this 바인딩을 특정 객체에 지정하고, 함수의 인수를 배열 형태로 전달하는 역할
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // 저 위 코드에 대한 테스트 console 코드
  //   const logScroll = window._throttle(() => {
  //     console.log("스크롤 중", Date.now(), 500);
  //   });
  //   window.addEventListener("scroll", logScroll);

  // 2번째 - requestAnimationFrame을 사용한 반환함수
  // 즉, rAF을 이용하여 한 번의 프레임안에서 한 번만 콜백이 실행되도록 보장하는 함수

  // callback은 우리가 실행하려는 함수 , ticking은 이미 rAF가 예약이 되어 있는지 체크
  window._throttleRAF = (callback) => {
    let ticking = false;

    // 반환 함수
    // ...args는 나머지 매개변수 또는 전개 구문의 역할을 수행한다.
    // 함수의 매개변수 목록에서 마지막 매개변수로 사용될 때, ...args에 전달된 나머지 모든 인수를 배열 형태로 묶어 args변수에 할당.
    // 반대로 배열이나 다른 iterable 객체를 함수 호출 시 개별 인수로 분해하여 전달할 때도 '...'를 사용하며, 이 경우 전개 구문이라고 한다.
    // 요약하자면 함수의 매개변수로 사용될 때는 배열로 묶어주는 역할, 함수 호출 시나 배열/객체 생성 시 사용될 때는 배열이나 객체를 펼쳐주는 전개 구문 역할을 한다.
    return function (...args) {
      // 동작원리
      // 반환된 함수가 호출될 때마다 ticking 확인
      // false면 -> requestAnimation()으로 예약하고, ticking =  true
      // rAF으로 돌아와서 callback을 실행 -> 끝나면 ticking = false로 초기화
      // 다음 rAF 전에 또 호출되더라도 무시함.
      if (!ticking) {
        requestAnimationFrame(() => {
          callback.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  };

  // 위에 코드를 확인하기 위한 코드 (테스트)
  //   const logScrollRAF = window._throttleRAF(() => {
  //     console.log("scroll RAF", Date.now());
  //   });
  //   window.addEventListener("scroll", logScrollRAF);
});
