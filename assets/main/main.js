// 게시글 가져오기 Fetch 후 결과 가져오기
const spreadPost = async (path) => {
  const cards = document.querySelector('.cards');
  try {
    const res = await fetch(path);
    const data = await res.json();
    cards.innerHTML = '';
    data.postList.forEach((info) => {
      cards.innerHTML += `
                    <div class="post-card">
                      <a href="#">닉네임: ${info.Nickname}</a>
                      <span>게시글: ${info.content}</span>
                    </div>
                    `;
    });
  } catch (error) {
    console.error(error);
  }
};

// 관심글 버튼 작동
const interestEvent = (() => {
  const interestButton = document.querySelector('.interest-post-button');

  interestButton.addEventListener('click', () => {
    spreadPost('/posts/category/interest');
  });
})();

// 최신글 버튼 작동
const recentEvent = (() => {
  const recentButton = document.querySelector('.recent-posts-button');

  recentButton.addEventListener('click', () => {
    spreadPost('/posts/new-post');
  });
})();
