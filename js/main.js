window.addEventListener("DOMContentLoaded", function () {
  // main에 관한 javascript 시작 -> main에 대한 js를 공부 (gsap)

  // 1. main- section1에 대한 js
  // section1에 대한 변수 저장
  const Section1 = document.querySelector(".section1");
  console.log(Section1);

  // 1-1 section1 :  visual 핀 및 이미지 yPercent 애니메이션
  // Section1이 존재한다면 실행.
  if (Section1) {
    //핀 처리
    ScrollTrigger.create({
      trigger: Section1,
      start: "top top",
      end: "bottom bottom",
      pin: Section1.querySelector(".visual"),
      pinSpacing: false, // 요소가 고정될 때 (pin : true)생기는 공간을 다른 요소들이 침범하지 않도록 막아주는 기능

      // pin이 잘 걸렸는 지 확인. (markers)
      // markers: true,
    });

    // 스크롤에 따라 .visual .__img가 패럴랙스(느린 스크롤)처럼 부드럽게 내려가면서 동적인 시각 효과를 주는 코드입니다.
    // 1-2 이미지 yPercent 애니메이션 적용
    // 이걸 적용하면 스크롤이 되면서 첫번째 섹션이 두번쨰 섹션을 넘어서면서 두번째 섹션이 제대로 보이지 않게 된다.
    // CSS를 다르게 지정해야할 지, js로 또 다른 설정이 있었을지는 공부하면서 해보자.
    ScrollTrigger.create({
      trigger: Section1,
      start: "bottom bottom", // start bottom에 bottom으로 설정하면 start와 scroll-start가 같이 있어 첫번쨰 섹션에서는 바로 애니메이션 바로 시작된다.
      end: "bottom top", // end는 bottom을 첫번째에 설정하고, top을 두번쨰에 설정하면, scroller가 섹션 밑에를 찍으면 애니메이션이 끝이 나게 한다.

      // markers: true,

      // gsap에서 onUpdate는 이벤트는 애니메이션이 업데이트될 때마다 실행되는 콜백함수이다.
      // 즉, 애니메이션이 진행되는 동안 특정 시점에 원하는 동작을 수행할 수 있게 해줍니다. 예를 들어, 애니메이션 진행률에 따라 다른 요소의 위치를 변경하거나, 진행률을 표시하는 프로그세스 바를 업데이트 하는 등의 작업을 할 수 있습니다.
      // 그래서 여기서 프로그래스 바를 이용하여 애니에이션을 만드려고 하는 것 같다.

      // 스크롤 진행도에 따라 계속 호출되는 콜백함수. -> 스크롤 비율에 따라 이미지를 움직이려는 목적. progress의 값은 0~1이다.
      onUpdate: ({ progress }) => {
        //progress는 현재 진행률(progress)값을 인자로 받아, 해당깂에 따라 추가적인 동작을 수행할 수 있도록 한다.

        // Section1내에 모든 visual-bg를 요소 캐싱 -> 본페이지에서는 querySelectorAll로 설정했지만, 나는 요소가 하나이기에 querySelector로 설정
        const visualImg = Section1.querySelector(".visual .visual-bg");

        // gsap.set()함수는 요소의 초기 스타일 설정하는 역할을 합니다. 애니메이션이 시작하기 전에 요소의 시작 상태를 정의하는데 사용된다.
        gsap.set(visualImg, {
          yPercent: progress * 50,
        });
      },
    });

    // 1-3 배경 border-radius 제어 및 비디오 제어 (나는 비디오를 설정하지 않았기 떄문에. border-radius만)
    // 스크롤 되면서 border-radius가 스크롤에 비례해서 둥그러지는 애니에이션.

    // border-radius를 제어하기 위해서는 변수로 저장해둔다 (보더 값과 y축 값)
    // 애니메이션 도중 계산된 진행 상태를 임시로 담는 객체 -> 이렇게 객체로 만들어두면 다른 함수나 모듈에서도 쉽게 읽고 쓸 수있다.
    // 특히 GSAP은 이런식으로 전역 상태를 관리하는 경우가 많다.
    const MotionVals = { borderRadius: 0, yPercent: 0 };
    ScrollTrigger.create({
      trigger: Section1,
      start: "bottom 80%", // scroller가 Section1에 80% 지점에서 있고,  bottom에 있는  start를 트리거 시 애니메이션 시작.
      end: "bottom top",

      markers: true,

      // onUpdate는 gsap에서 애니메이션이 업데이트 될 때마다 실행되는 콜백함수
      // progress는 현재 진행률값을 인자로 받아, 해당값에 따라 추가적인 동작을 수행할 수 있다.
      onUpdate: window._throttle(({ progress }) => {
        //MotionVals는 보더값과 y축값을 변수로 저장한 값, MAX_BORDER_RADIUS은 최대 보더 값을 전역 변수에 저징
        MotionVals.borderRadius =
          // footer에 최대 둥근 정도(window.MAX_BORDER_RADIUS)를 가져와서 스크롤 진행도(progress)에 따라 비율을 곱해준다.
          // progress * 1.25을 사용하고, Math.min(1, ...)을 사용한 이유는 진행도에 따라 살짝 더 많이(최대 1.25배)올라가지만, 1을 넘지 않게 보정하기위함
          // 저 위에 말이 이해가 안가기 떄문에 재차 물어봄 ->  최대 1.25배가 더 올라갈 수 있다고 하는데, 1을 넘지 않게 보정하는거면 1.25배가 올라가지 않는다는 말이잖아? 그래서 다시 한번 물어봤어
          // 물어보니, progress는 0 ~ 1 사이의 진행도를 가지고 있잖아. 그런데 progress * 1.25를 사용하면 진행도가 1일 때 1.25가 된다는 말이었고,
          // 하지만, border-radius를 계산할 때는 최대 1(100%)까지만 적용되게 하고싶다는 말에 코드인거야
          // 그래서 Math.min(1, progress * 1.25)로 제한을 건거야. mim(1 ,) border-radius를 계산할 때 최대 1(100%)까지만 적용되게 하고싶고,, progress * 1.25는 진행도가 1일 때 1.25가 된다는 말이였어.
          // 그러니까 쉽게 동작을 말하자면, 스크롤이 끝까지 가지 않았을 때 (예 : 80% 정도)에도 이미 최대 값 1을 도달할 수 있게 해서 애니메이션 동작이 끝까지 가지 않아도 다 동작할 수 있게 만든 것이다.
          // 진행속도를 1.25배 빠르게 만들고, 하지만 최대는 넘지 않게 제한한 것
          // 요약 : progress가 1이 되기 전에 이미 border-radius가 100%까지 도달하게 하고싶음. 애니메이션 100% 진행되는 걸 좀 더 빠르게 느끼고 싶어서, 하지만 progress가 1을 넘어도 border-radius는 그 이상 커지지 않게 Math.min()을 사용해 1을 최대 상한선으로 정해둔 것이다.
          window.MAX_BORDER_RADIUS * Math.min(1, progress * 1.25);

        // gsap.set()기능은 초기 스타일을 설정하는 역할을 한다. -> .visual-bg에 초기 스타일을 지정하기 위함인 것이다. \
        // Section1의 .visual-bg 요소의 둥근 정도를 실시간을 바꾼다.
        gsap.set(Section1.querySelector(".visual-bg"), {
          // borderBottomRadius는 js에 표준 문법
          //  `${Section1.borderRadius}px` 이 문법은 템플릿 리터럴 문법이다.
          // 스크롤하면 .visual-bg가 점점 더 둥글어지거나 하는 애니메이션이 작동된다.
          // MotionVals라는 이름에 변수로 저장한 곳에, border-radius에 접근해서 값을 변환해준다.
          borderBottomRightRadius: `${MotionVals.borderRadius}px`,
          borderBottomLeftRadius: `${MotionVals.borderRadius}px`,
        });
      }, 1000 / 24), // 초당 24프레임으로 제한 -> 제한한 이유는 자주 호출되면 성능이 떨어져 그런 것

      // 콜백함수들
      // onEnter는 트리거의 시작점에 스크롤이 처음 들어올 때 1회 실행.
      onEnter: () => {}, //{if(비디오 요소) 비디오 요소.pause()} // 본페이지에서는 {}안에 비디오를 제어하는 것이 나와있는데, 우리는 비디오가 없기에 사용x /pause는 멈추는 기능.
      // onEnterBack은  트리거를 지나쳤다가 다시 되돌아올 때(스크롤이 뒤로) 실행 -> 하는 일 비디오를 멈춤.
      onEnterBack: () => {},
      // onLeaveBack은 트리거의 시작점보다 위로(스크롤을 더 위로)올라가서 트리거에 빠져나갈때 실행. 비디오를 실행bb
      onLeaveBack: () => {},
    });
  }
});
