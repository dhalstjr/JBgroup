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
          // yPercent: progress * 50,
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

      // markers: true,

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

  // 첫번째 섹션의 효과 border-radius를 적영해게;

  // 1-2 첫번째 섹션의 텍스트와 위젯 설정. (gsap- splitText가 필요해 다음에.)

  // 두번째 섹션에 대한 js (visual 핀, 이미지 yPercent, 그리고 반응형 Swiper 처리)
  // 2-1 visual 핀
  // 두번째 섹션에 필요한 변수 저장
  const Section2 = document.querySelector(".section2");
  const Visual = Section2.querySelector(".visual-bg");
  console.log(Section2, Visual);

  if (Section2) {
    ScrollTrigger.create({
      trigger: Section2,
      start: "top bottom",
      end: "bottom bottom",

      // markers: true,

      // onUpdate는 애니메이션이 업데이트될 때 마다 실행하는 콜백함수.
      onUpdate: ({ progress }) => {
        // 지금 이 코드에서 하고싶은 건 스크롤 진행도에 따라 .visual-bg가 y축으로 움직이게 하고싶은 것이다.
        //(1 - progress)는 progress가 커질수록 1에 가까워지니까, 처음에는 1(아직 안 내려갔을 때) 끝나면 0(다 내려갔을 때) 그러니까, 처음엔 많이. 끝에서 적게 움직이게 하고싶은 것이다.
        // 이해가 안가는 부분을 물어봤어 progress에 진행률이 달라지는 것 같은 느낌이 들어서 물어봤더니, 1 - progress는 0~1의 진행률을 반대로 1~0으로 바꾼 코드라는 것.
        // 지금 우리가 구현하고자 하는 애니메이션은 스크롤이 진행될수록 값이 줄어들어야 하는데, progress는 스크롤이 진행될수록 값이 증가하다 보니 반대로 만들기 위해서 1 - progress 라는 문법을 사용한 것이다.
        // 스크롤이 내려갈수록 값이 줄어드는 효과를 만들고 싶은 경우 이렇게 사용한다.
        // 왜 * -20을 사용했는가. yPercent에 음수를 곱하면 위쪽으로 이동하게 됩니다. -20이라는 숫자는 디자인적으로 적당한 이동 범위를 설정한 것이라고 하는데, 내가 보기엔 계산해서 넣은 값 같다
        // 즉, 시작할 때 (1-0) * -20 = -20 -> 배경을 20% 위에 위치 , 끝날 때는 (1-1) * 20 = 0 -> 제자리로 돌아옴 : 스크롤을 내릴수록 배경이 위에서 아래로 부드럽게 내려오는 듯한 효과
        // 스크롤 도중 배경이 살짝 따라 내려오는 효과를 주기 위해.
        gsap.set(Section2.querySelector(".visual-bg"), {
          yPercent: (1 - progress) * -20,
        });
      },
    });

    // 배경 도형에 애니메이션 효과 - 클래스를 추가하는 방식으로 구현(이미지를 넣고, top과 left 위치를 변경하고, rotate를 사용해 이미지 도형을 움직이는 효과)
    ScrollTrigger.create({
      trigger: Section2,
      start: "top 80%",
      end: "bottom bottom",

      // markers: true,

      onEnter: () => {
        Section2.querySelector(".visual-bg").classList.add("active");
      },
    });
  }

  // 3. 세번째 섹션 js 구현
  // 3-1 세번째 섹션에 필요한 변수를 저장
  const Section3 = document.querySelector(".section3");
  console.log(Section3);

  // 3-2 main section3에 Swiper 구현
  if (Section3) {
    // Swiper를 위해서 슬라이드할 변수를 저장
    // 그리고 Swiper.js를 사용하기 위해서는 라이브러리를 가져와야함.
    // Swiper에 있는 CSS를 가져오면 swiper라는 클래스를 준 곳에는 overflow :  hidden이 설정되어있어 item이 4개 이후로 보이지 않지만, hidden을 풀면 보인다.
    const familySwiper = new Swiper("#main-section .swiper", {
      freeMode: true, // 사용자가 슬라이드를 드래그하거나 스와이프할 때, 슬라이드가 특정 위치에 고정되지 않고 자연스럽게 움직이도록 하는 옵션. 즉, 사용자가 드래그한 만큼 슬라이드가 움직이고 멈추는 방식.
      slidesPerView: "auto", // 한 번에 보여줄 슬라이드 개수를 지정하는 기능.
      // 그렇다면 "auto" 옵션의 기능은 슬라이드 컨테이너의 너비에 맞춰 슬라이드들이 자동으로 크기가 조정되도록 설정
    });
  }

  // 4. 네번째 섹션 js 구현
  // 4-1 세번째 섹션에 필요한 변수를 저장
  const Section4 = document.querySelector(".section4");
  console.log(Section4);

  // 4-2 세번째 섹션 visual 핀 처리
  if (Section4) {
    ScrollTrigger.create({
      trigger: Section4,
      start: "top top",
      end: "bottom bottom",

      // section4에 잇는 visual에 pin을 걸고 봤더니, section4에 있는 이미지가 스크롤에 의해서 내려가는 듯한 효과를 주는데, pin만 걸었는데도, 어떻게 그럴 수 있는지 HTML과 CSS에 연관해서 물어보았어
      // pin 동작 원리와 스크롤의 자연 흐름 때문이라고 한다.
      // section4에 visual이 pin이 고정된 상태로 스크롤을 따라 움직이지 않지만, 그 하위 요소인 sec4-bg가 여전히 배경 이미지로 존재하고 있다
      // CSS에서 sec4-bg는  absolute로, visual 기준으로 절대 위치 지정되고, 그래서 고정된 visual 안에서 배경처럼 보이는 것이고, 스크롤이 내려가면 주변 콘텐츠는 계속 움직이지만, sec4-bg는 그대로 있기에 내려가는 것처럼 보이게 되는 것이다.
      // 그리고 pinSpacing -> true와 false의 차이점은 기본값 true는 visual이 고정되는 동안 그만큼의 공간을 차지 -> 그만큼 콘텐츠가 더 길어짐
      // false는 고정되지만 공간을 차지하지 않음. -> 바로 다음 콘텐츠가 겹치며 올라옴.
      // 결과적으로 pinSpacing이 false면 시각적으로 sec4-bg가 더 오래 남아있는 것처럼 보여서 더 많이 내려가는 것처럼 보이게 됌 ->  실제로 내려간 것이 아니라. 고정된 상태에서 주변 콘텐츠가 위로 올라와서 생기는 착시현상.
      // 결론은 .visual이 고정되고, 그 안의 sec4-bg는 고정된 컨테이너에 위치. 화면은 계속 스크롤 되고, 다른 요소들이 올라오게 되니 상대적으로 sec4-bg가 점점 아래로 내려가는 것처럼 보이는 착시 효과 발생.

      pin: Section4.querySelector(".visual"),
      pinSpacing: false, // 요소가 고정될 때 (pin : true)생기는 공간을 다른 요소들이 침범하지 않도록 막아주는 기능

      // markers: true,
    });
  }

  // 5. 다섯번째 섹션(news) js 구현
  // 5-1 필요한 변수를 저장
  const Section5 = document.querySelector(".section5");
  console.log(Section5);

  // 5-2 border-radius를 구현 (else문을 사용해 보조 적용 대상 만들기)
  // 오류나 충돌 방지를 위해 우선 순위를 만들어줌.

  // 이런 구조에 대해서 물어봤음 -> 특정 섹션이 없는 페이지에서 오류를 방지하기 위해서 페이지에서 Section5가 없어질 수 있기 때문에 null이 되고, null요소에 대해 ScrollTrigger를 호출하면 에러가 발생한다.
  // 그렇기에 애니메이션이 적용될 섹션이 최소 하나는 있어야 하기에 Section5가 없으면 Section4에 적용하여 인터랙션이 끊기지 않도록 방지한 것이다.
  if (Section5) {
    ScrollTrigger.create({
      trigger: Section5,
      // 섹션 길이가 길어서  섹션 바닥에 트리거 시에 애니메이션을 시작한 것 같음.
      start: "bottom bottom",
      end: "bottom top",

      // markers: true,

      onUpdate: window._throttle(({ progress }) => {
        const borderRadius =
          window.MAX_BORDER_RADIUS * Math.min(1, progress * 1.25);

        // 초기 상태 설정
        gsap.set(Section5, {
          borderBottomRightRadius: `${borderRadius}px`,
          borderBottomLeftRadius: `${borderRadius}px`,
        });
      }, 1000 / 24),
    });
  } else {
    if (Section4) {
      ScrollTrigger.create({
        trigger: Section4,
        start: "bottom bottom",
        end: "bottom top",

        markers: true,

        onUpdate: window._throttle(({ progress }) => {
          const borderRadius =
            window.MAX_BORDER_RADIUS * Math.min(1, progress * 1.25);

          //초기 설정
          gsap.set(Section4, {
            borderBottomLeftRadius: `${borderRadius}px`,
            borderBottomRightRadius: `${borderRadius}px`,
          });
        }, 1000 / 24),
      });
    }
  }

  // 6. 여섯번째 섹션
  // 6-1 필요한 변수 저장
  const Section6 = document.querySelector(".section6");
  console.log(Section6);

  // 6-2 y축 애니메이션
  if (Section6) {
    ScrollTrigger.create({
      trigger: Section6,
      start: "top bottom",
      end: "bottom bottom",

      markers: true,

      onUpdate: ({ progress }) => {
        // 초기 설정
        gsap.set(Section6.querySelector(".visual-bg"), {
          // 0에서 1로 이동하는 progress를 반대로 1에서 0으로 이동하게 변경 1 - progress를 사용함.
          yPercent: (1 - progress) * -80,
        });
      },
    });
  }
});
