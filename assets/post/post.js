// 게시글 작성 post fetch
const postForm = document.querySelector('.postForm');

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();

  const categoryList = document.querySelector('#postInterest').value;
  const title = document.querySelector('#postTitle').value;
  const content = document.querySelector('#postContent').value;
  const file = document.querySelector('#file').files[0];

  formData.append('categoryList', categoryList);
  formData.append('title', title);
  formData.append('content', content);
  formData.append('file', file);
  try {
    const res = await fetch('/posts', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      // 게시글 작성 완료 시 메인 페이지로 이동
      window.location.href = '/main';
    }
  } catch (err) {
    console.error(err);
  }
});

const postHandler = (() => {
  const cancel = document.querySelector('#cancelPostBtn');
  cancel.addEventListener('click', async () => {
    window.location.href = '/main';
  });
})();
