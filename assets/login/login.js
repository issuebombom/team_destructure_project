// 로그인 post fetch
const postLogin = async (loginInfo) => {
  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginInfo),
    });

    const data = await res.json();
    alert(data.msg);
  } catch (err) {
    console.error(err);
  }
};

// 로그인 버튼 이벤트리스너 등록(즉시 실행 함수)
// 입력된 로그인 정보를 json으로 정리해 백엔드로 보냅니다.
const loginHandler = (() => {
  const loginForm = document.querySelector('.login-form');
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = new Object();
    for (let element of event.target) {
      if (element.name === '') continue;
      result[element.name] = element.value;
    }
    postLogin(result); // login POST 요청을 보냅니다.
  });
})();
