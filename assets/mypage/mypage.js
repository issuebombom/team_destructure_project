// 창이 로딩되면 이벤트 발생.
document.addEventListener('DOMContentLoaded', () => {
  userData();
});

// 유저정보 조회태그
const userTag = document.querySelector('.user-tag');
console.log(userTag);
// 유저의 게시글 조회태그
const userPostTag = document.querySelector('.user-post-tag');
console.log(userPostTag);
// 유저의 댓글 조회태그
const userCommentTag = document.querySelector('.user-comment-tag');
console.log(userCommentTag);

// fetch로 정보 받아와서 json()화 시키기.
const userData = async () => {
  const res = await fetch(`/mypage/userInfo`);
  const data = await res.json();

  // 유저정보, 유저의 게시글 정보, 유저의 댓글 정보 뽑아오기
  const { user, posts, comments } = data;
  console.log(user, posts, comments);

  // 유저 정보 뿌리기
  userTag.innerHTML = `
                        <li>Nickname : ${user.nickname}</li>
                        <li>Email : ${user.email}</li>
                        <li>Interest : ${user.interest}</li>
                        <button>유저 정보 변경하기</button>
                      `;

  // 게시글 정보 뿌리기
  posts.forEach((myPostInfo) => {
    userPostTag.innerHTML += `
                              <li>Title : ${myPostInfo.title}</li>
                              <li>Content : ${myPostInfo.content}</li>
                              <li>Date : ${myPostInfo.date}</li>
                              <p></p>
                            `;
  });

  // 댓글 정보 뿌리기
  comments.forEach((myCommentInfo) => {
    userCommentTag.innerHTML += `
                                  <li>Content : ${myCommentInfo.content}</li>
                                  <li>Date : ${myCommentInfo.date}</li>
                                  <p></p>
                                `;
  });
};
