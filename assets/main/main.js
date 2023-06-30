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
                        <td>${info.content}</td>
                        <td style="width: 30px">${info.categoryList}</td>
                    </tr>
                    `;
    });
  } catch (error) {
    console.error(error);
  }
};

// 이벤트 버튼선택자로 버튼 가져오고 >> 이벤트유저 클릭이벤트유저 카테고리 이벤트 실행
const interestEvent = (() => {
  const CategoryButton = document.querySelector('.get-category-posts');

  CategoryButton.addEventListener('click', () => {
    userCategory();
  });
})();