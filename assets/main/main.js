$(document).ready(() => {
  getPosts();
});

// 메인페이지에서 카테고리 버튼 클릭시 로그인한 유저의 카테고리 관련 게시글 띄우기
const userCategory = async () => {
  const tableBody = document.querySelector('.table-body');
  try {
    const res = await fetch(`/posts/category/interest`);
    const data = await res.json();
    tableBody.innerHTML = '';
    data.categoryPosts.forEach((info) => {
      console.log(info.content);
      //* 각 테이블 내 셀의 크기가 조정될 수 있다면 이미지는 보여집니다.
      //* 현재 셀 크기가 크고 작고를 떠나서...크기 설정이 안되어 있으면 글자가 잘리는 것 같습니다.
      tableBody.innerHTML += `
                    <tr>
                      <th scope="row">${info.postId}</th>
                        <td>${info.Nickname}</td>
                        <td>${info.title}</td>
                        <td>${info.content} ${imageTag}</td>
                        <td>${info.categoryList}</td>
                    </tr>
                    `;
    });
  } catch (error) {
    console.error(error);
  }
  // console.log(data);
};

// 이벤트 버튼선택자로 버튼 가져오고 >> 이벤트유저 클릭이벤트유저 카테고리 이벤트 실행
const interestEvent = (() => {
  const CategoryButton = document.querySelector('.get-category-posts');

  CategoryButton.addEventListener('click', () => {
    userCategory();
  });
})();

const printPosts = document.querySelector('.cards');

function getPosts() {
  $.ajax({
    method: 'GET',
    url: '/posts/new-post',
    success: (data) => {
      let posts = data.postList;
      let results = [];
      console.log(posts);
      posts.forEach((post) => {
        const content = post.content.split('<img')[0];
        const img = '<img' + post.content.split('<img')[1];
        results += `
  <div class="post-card" data-postid=${post.postId}>
  <span>${post.postId}번 게시글</span>
    <a> 닉네임: ${post.nickname}</a>
    <span style="display: block"> 게시글 : ${content} ${img}</span>
    </div>
    `;
      });
      printPosts.innerHTML = results;

      $('.post-card').on('click', function () {
        const postId = $(this).data('postid');
        click(postId);
      });
    },
    error: (err) => {
      console.log(err);
    },
  });
}
function click(postId) {
  console.log(postId);
  (window.location.href = `/posts/${postId}`), '_parents';
}
