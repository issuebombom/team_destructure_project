// 메인페이지에서 카테고리 버튼 클릭시 카테고리별 게시글 띄우기
// const categoryHandler = () => {
//   const categoryBtn = document.querySelector('.category-btn');
//   categoryBtn.addEventListener('click', async () => {
//     const category = categoryBtn.getAttribute('data-category');
//     const main = `/category/${category}`;
//     window.location.href = main; // url ? main ? category ?
//   });
// };
const categoryList = document.getElementById('categoryList');
// 메인페이지에서 카테고리 버튼 클릭시 로그인한 유저의 카테고리 관련 게시글 띄우기
const userCategory = async () => {
  try {
    const res = await fetch(`/main/category/interest`);
    const data = await res.json();
    console.log(data);
    categoryList.innerHTML = '';
    data.categoryPosts.forEach((info) => {
      categoryList.innerHTML += `<tr>
        <th scope="row">${info.postId}</th>
        
        <td>${info.Nickname}</td>
        <td>${info.title}</td>
    
        <td>${info.content}</td>
    
        <td>${info.categoryList}</td>
      </tr>`;
    });
    // console.log(data);
  } catch (error) {
    console.error(error);
  }
};

// 이벤트 버튼선택자로 버튼 가져오고 >> 이벤트유저 클릭이벤트유저 카테고리 이벤트 실행
const button = document.querySelector('.posts-check');
button.addEventListener('click', () => {
  userCategory();
});

// const dataArray = Object.entries(data);
//     for (let [key, info] of dataArray) {
//       categoryList.innerHTML += `<tr>
//     <th scope="row">${info.Nickname}</th>

//     <td>${info.title}</td>

//     <td>${info.content}</td>

//     <td>${info.categoryList}</td>
//   </tr>`;
//     }
