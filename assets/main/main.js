// 게시글 가져오기 Fetch 후 결과 가져오기
const spreadPost = async (path) => {
  const cards = document.querySelector('.cards');
  try {
    const res = await fetch(path);
    const data = await res.json();

    if (res.ok) {
      cards.innerHTML = '';
      data.postList.forEach((post) => {
        cards.innerHTML += `
                      <div class="post-card">
                        <a href="#">게시글 번호: <${post.postId}></a>
                        <span>닉네임: ${post.Nickname}</span>
                        <span>카테고리: ${post.categoryList}</span>
                        <span>게시글: ${post.content}</span>
                        <button class="like-button" data-post-id="${post.postId}">👍</button>
                        <span class="like-count-${post.postId}">
                          ${post.Likes.length}
                        </span>
                      </div>
                      `;
      });
    } else {
      alert(data.msg)
      window.location.href = '/login'
    }
  } catch (error) {
    console.error(error);
  }
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

// 카테고리 버튼 작동 (음악 영화)
const categoryEvent = (() => {
  const categoryForm = document.querySelector('.category-form');

  categoryForm.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      // 클릭된 버튼의 value 가져오기
      const categoryId = event.target.value; // Music 또는 Movie를 가져옵니다.
      spreadPost(`/posts/category/${categoryId}`);
    }
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
