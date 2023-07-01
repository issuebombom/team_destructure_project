$(document).ready(() => {
  getPosts();
});

function searchParam(key) {
  return new URLSearchParams(location.search).get(key);
}

const postId = searchParam('postId');
console.log(postId);

function getPosts() {
  $.ajax({
    method: 'GET',
    url: '/posts/detail/:postId',
    success: (data) => {
      let posts = data.postDetail;
      console.log(posts);
      let results = [];
      console.log(posts);
      posts.forEach((post) => {
        results += `
        <section class="detailSection">
        <img src="${post.img}" alt="Post Image" class="postImage" />
        <h2 class="postTitle">${post.title}</h2>
        <div class="postCategory">${post.categoryList}</div>
        <div class="postContent">${post.content}</div>
      </section>
    `;
      });
      printPosts.innerHTML = results;
    },
    error: (err) => {
      console.log(err);
    },
  });
}
