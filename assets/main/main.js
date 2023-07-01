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
                      <button class="like-button" data-post-id="${info.postId}">👍</button>
                      <span class="like-count-${info.postId}">
                        ${info.Likes.length}
                      </span>
                    </div>
                    `;
    });
  } catch (error) {
    console.error(error);
  }
  // console.log(data);
};

// 관심글 버튼 작동
const interestEvent = (() => {
  const interestButton = document.querySelector('.interest-posts-button');

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

// 좋아요 버튼에 이벤트리스너 등록
document.addEventListener('DOMContentLoaded', () => {
  // All을 통해 모든like-button을 likeButtons 변수에 저장
  const likeButtons = document.querySelectorAll('.like-button');

  // forEach를 통해 각각의 좋아요 버튼에 함수 시작
  likeButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const postId = button.dataset.postId;
      console.log(postId);
      try {
        const response = await fetch(`/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          const likeCount = document.querySelector(`.like-count-${postId}`);
          likeCount.innerText = result.likeCount;
        } else {
          alert('로그인 후 이용해주세요.');
        }
      } catch (error) {
        console.error(error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    });
  });
});
