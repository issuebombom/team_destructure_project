const postId = window.location.pathname.split('/').pop(); // URL에서 게시글 ID 추출

const postDetail = async (postId) => {
  try {
    const res = await fetch(`/posts/details/${postId}`);
    const data = await res.json();

    if (res.ok) {
      const postDetail = document.querySelector('.detailSection');
      const post = data.post;
      console.log(post.title);
      const content = post.content.split('<img')[0];
      const img = '<img' + post.content.split('<img')[1];
      document.querySelector('#postTitle').value = post.title;
      document.querySelector('#postInterest').value = post.categoryList;
      document.querySelector('#postContent').value = content;
    } else {
      console.error(data.msg);
    }
  } catch (err) {
    console.error(err);
  }
};
postDetail(postId);

function modifyBtn(element) {
  window.location.href = `/posts/${postId}`;
}

function deleteBtn(element) {
  console.log('hi');
}

// // 삭제 버튼 작동
// const deleteBtn = (() => {
//   const interestButton = document.querySelector('.interest-posts-button');

//   interestButton.addEventListener('click', () => {
//     spreadPost('/posts/category/interest');
//   });
// })();

// // 닫기 버튼 작동
// const cancelBtn = (() => {
//   const interestButton = document.querySelector('.interest-posts-button');

//   interestButton.addEventListener('click', () => {
//     spreadPost('/posts/category/interest');
//   });
// })();
// $(document).ready(() => {
//   getPosts();
// });

// function getPosts() {
//   $.ajax({
//     method: 'GET',
//     url: `/posts/detail/${postId}`,
//     success: (data) => {
//       let posts = data.postDetail;
//       console.log(data);
//       let results = [];
//       console.log(posts);
//       posts.forEach((post) => {
//         results += `
//         <section class="detailSection">
//         <h2 class="postTitle">${post.title}</h2>
//         <div class="postCategory">${post.categoryList}</div>
//         <div class="postContent">
//         ${post.content}
//           <div>
//            <img src="${post.img}" alt="Post Image" class="postImage" />
//           </div>
//         </div>
//       </section>
//     `;
//       });
//       printPosts.innerHTML = results;
//     },
//     error: (err) => {
//       console.log(err);
//     },
//   });
// }
