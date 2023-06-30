const userPostTag = async () => {
  const userPostInfo = document.querySelector('.user-post-tag');
  try {
    const res = await fetch(`/mypage/:userId`);
    const data = await res.json();
    console.log(data);
    data.forEach((myPostInfo) => {
      userPostInfo.innerHTML = `
                            <ul class="user-tag" id="user-tag">
                              <li>${myPostInfo.title}</li>
                              <li>${myPostInfo.content}</li>
                              <li>${myPostInfo.date}</li>
                            </ul>
                           `;
    });
  } catch (error) {
    console.error(error);
  }
};

// document.addEventListener('DOMContentLoaded', async () => {
//   //   const userId =
//   console.log('hi');
//   await fetch(`/user/mypage/${userId}`, {
//     method: 'GET',
//     headers: { accept: 'application/json' },
//   })
//     .then((res) => {
//       res.json();
//     })
//     .then((data) => {
//       console.log(data);
//       console.log('hello');
//     });
// });

// const userPostDetail = async (userPost) => {
//   const res = await fetch(`http://localhost:3000/mypage/:userId`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log('data');
//     });
//   const userDetailTemplates = `
//         <h2 class="title" >${data.title}</h2>
//         <div>
//             <div>
//               <p class="content">내용 : ${data.content}</p>
//             </div>
//         </div>
//       `;
//   const userPostEl = document.querySelector('#user-detail');

//   userPostEl.innerHTML = userDetailTemplates;
// };

// userPostDetail();

// const getMypage = async (result) => {
//   try {
//     const res = await fetch('/mypage', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(result),
//     });

//     const data = await res.json();
//     alert(data.msg);
//   } catch (err) {
//     console.error(err);
//   }
// };

// const userDetailHandler = (() => {
//   const userDetailForm = document.querySelector('.user-detail-form');
//   userDetailForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     const result = new Object();
//     for (let element of event.target) {
//       if (element.name === '') continue;
//       result[element.name] = element.value;
//     }

//     getMypage(result);
//   });
// })();
