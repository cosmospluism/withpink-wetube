const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = document.getElementById("textarea");
const deleteBtn = document.querySelectorAll("#deleteBtn");

const handleDeleteComment = async (event) => {
  const comment = event.target.closest(".video__comment");
  const commentId = comment.dataset.id;
  const response = await fetch(`/api/videos/comments/${commentId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });
  if (response.status === 200) {
    return comment.remove();
  }
};

const addComment = (text, id, imgUrl, name) => {
  // new comment
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const img = document.createElement("img");
  img.src = imgUrl;
  newComment.appendChild(img);
  const commentPart = document.createElement("div");
  commentPart.className = "comment__part";
  newComment.appendChild(commentPart);
  // comment part
  const commentName = document.createElement("span");
  commentName.className = "comment__part-name";
  commentName.innerText = `${name}`;
  commentPart.appendChild(commentName);
  const commentTextPart = document.createElement("div");
  commentTextPart.className = "comment__textPart";
  commentPart.appendChild(commentTextPart);
  // comment text part
  const commentPart1 = document.createElement("div");
  commentPart1.className = "comment__part1";
  commentTextPart.appendChild(commentPart1);
  const commentText = document.createElement("span");
  commentText.className = "comment__part-text";
  commentText.innerText = ` ${text}`;
  commentPart1.appendChild(commentText);
  const commentPart2 = document.createElement("div");
  commentPart2.className = "comment__part2";
  commentTextPart.appendChild(commentPart2);
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "✖";
  commentPart2.appendChild(deleteBtn);

  videoComments.prepend(newComment);
  deleteBtn.addEventListener("click", handleDeleteComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Express에게 json 데이터를 보내고 있음을 알림
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, avatarImg, name } = await response.json(); // 백엔드로부터 받은 정보 (id)
    addComment(text, newCommentId, avatarImg, name); // 얻은 id를 인수로 넣어줌
  }
  //   window.location.reload();
};

const handleKeydown = (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
    form.querySelector("button").click();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
textarea.addEventListener("keydown", handleKeydown);
// deleteBtn이 list를 반환하므로 이벤트리스너 사용을 위해서는 iterate 필요
deleteBtn.forEach((btn) => btn.addEventListener("click", handleDeleteComment));
