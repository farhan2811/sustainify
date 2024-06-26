<script>
  import logo from '$lib/images/logo-sustainify.png';
  import loading from '$lib/images/loading.gif';
  import { onMount } from 'svelte';
  import { frdb } from "$lib/firebaseConfig.js";
  import { doc, setDoc, getDocs, collection, getDoc, query, where, deleteDoc, updateDoc, increment, addDoc, orderBy } from "firebase/firestore";
  import { fly } from 'svelte/transition';
  import profile_pic from '$lib/images/profile-pic-post.svg';
  import profile_pic_comment from '$lib/images/profile-pic-comment.svg';

  export let data;

  let postId = data.params.slug;
  let post;
  let comments = [];
  let currentUser;
  let profile_pic_ts = null;
  let newComment = '';
  let newReply = '';
  let likes = 0;
  let hasLiked = false;
  let messageModal = 0;
  let messageModalSuccess = 0;
  let messagePayload = null;
  let replyTo = null;
  let overflow = null;
  let post_detail_loaded = false;

    function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

  async function getDetailPost() {
    currentUser = localStorage.getItem("username");
    const postRef = doc(frdb, 'posts', "post_" + postId);
    const postDoc = await getDoc(postRef);
    post = { id: postDoc.id, ...postDoc.data() };

    const profilePicRef = doc(frdb, 'users', post.user_id);
    const profilePicDoc = await getDoc(profilePicRef);
    profile_pic_ts = profilePicDoc.data().profile_picture;

    const commentsCollection = collection(frdb, 'comments');
    const commentsQuery = query(commentsCollection, where('post_id', '==', postId), orderBy('timestamp', 'desc'));
    const commentsSnapshot = await getDocs(commentsQuery);
    comments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), showReplyBox: false, replies: [] }));

    for (let i = 0; i < comments.length; i++) {
      const commenterProfileRef = doc(frdb, 'users', comments[i].user_id);
      const commenterProfileDoc = await getDoc(commenterProfileRef);
      comments[i].profile_picture = commenterProfileDoc.data().profile_picture;

      // Fetch replies for each comment
      const repliesQuery = query(commentsCollection, where('parent_comment_id', '==', comments[i].id), orderBy('timestamp', 'desc'));
      const repliesSnapshot = await getDocs(repliesQuery);
      comments[i].replies = repliesSnapshot.docs.map(replyDoc => ({ id: replyDoc.id, ...replyDoc.data() }));

      // Fetch profile pictures for each reply
      for (let j = 0; j < comments[i].replies.length; j++) {
        const replierProfileRef = doc(frdb, 'users', comments[i].replies[j].user_id);
        const replierProfileDoc = await getDoc(replierProfileRef);
        comments[i].replies[j].profile_picture = replierProfileDoc.data().profile_picture;
      }
    }

    const likesCollection = collection(frdb, 'likes');
    const likesQuery = query(likesCollection, where('post_id', '==', postId));
    const likesSnapshot = await getDocs(likesQuery);
    likes = likesSnapshot.docs.length;

    hasLiked = likesSnapshot.docs.some(doc => doc.data().user_id == localStorage.getItem("username"));
    post_detail_loaded = true;
  }

  async function handleLike() {
    const postRef = doc(frdb, 'posts', "post_" + postId);
    const likesCollection = collection(frdb, 'likes');
    const likeQuery = query(likesCollection, where('post_id', '==', postId), where('user_id', '==', localStorage.getItem("username")));
    const likeSnapshot = await getDocs(likeQuery);

    if (likeSnapshot.empty) {
      const likeId = doc(likesCollection).id;
      await setDoc(doc(likesCollection, likeId), {
        post_id: postId,
        user_id: localStorage.getItem("username"),
      });
      await updateDoc(postRef, {
        like_count: increment(1)
      });
      post.like_count++;
    } else {
      await deleteDoc(likeSnapshot.docs[0].ref);
      await updateDoc(postRef, {
        like_count: increment(-1)
      });
      post.like_count--;
    }
    hasLiked = !hasLiked;
  }

  async function addComment() {
    if (newComment.trim() === '') return;

    const commentsCollection = collection(frdb, 'comments');
    await addDoc(commentsCollection, {
      post_id: postId,
      user_id: localStorage.getItem("username"),
      content: newComment,
      timestamp: new Date()
    });
    const postRef = doc(frdb, 'posts', "post_"+postId);
    await updateDoc(postRef, {
      comment_count: increment(1)
    });
    newComment = '';
    await getDetailPost();
    post.comment_count = comments.length;
    overflow = isOverflowY(document.getElementById("form-login"))
  }

  async function addReply(commentId) {
    if (newReply.trim() === '') return;

    const commentsCollection = collection(frdb, 'comments');
    try {
    	 await addDoc(commentsCollection, {
	      post_id: postId,
	      user_id: localStorage.getItem("username"),
	      content: newReply,
	      timestamp: new Date(),
	      parent_comment_id: commentId
	    });
    } catch(e) {
    	console.log(e)
    }
    const postRef = doc(frdb, 'posts', "post_"+postId);
    await updateDoc(postRef, {
      comment_count: increment(1)
    });
    newComment = '';
    await getDetailPost();
    post.comment_count = comments.length;
    comments.find(c => c.id === commentId).showReplyBox = false;
    replyTo = null;
    newReply = '';
  }

  onMount(async () => {
    if (!localStorage.getItem("email") || !localStorage.getItem("username")) {
      window.location.href = '/';
    }
    await getDetailPost();
    overflow = isOverflowY(document.getElementById("form-login"))
    document.getElementById("profilePhoto").style.backgroundImage = `url(${profile_pic_ts})`;
  });
</script>

<svelte:head>
  <title>Post Detail</title>
  <meta name="description" content="Post Detail Page" />
  <style type="text/css">
    .profilePhoto {
      width: 37px;
      height: 37px;
      background-size: cover;
    }
  </style>
</svelte:head>

{#if messageModal == 1}
  <div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
    <div class="flex flex-center-vertical flex-center-horizontal h-100">
      <div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
        <div class="head-input-primary text-center">{messagePayload}</div>
        <button class="btn-modal w-100" on:click={() => {
          messageModal = 0;
        }}>Close</button>
      </div>
    </div>
  </div>
{/if}

{#if messageModalSuccess == 1}
  <div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
    <div class="flex flex-center-vertical flex-center-horizontal h-100">
      <div class="card w-80 flex flex-direction-col flex-gap-regular flex-center-vertical flex-center-horizontal">
        <div class="head-input-primary text-center">{messagePayload}</div>
        <div class="flex flex-direction-col flex-gap-semi-large flex-center-vertical">
          <div class="loading-text text-center">Please wait a moment</div>
          <img src="{loading}" class="w-30">
        </div>
      </div>
    </div>
  </div>
{/if}

<div id="comment_space">
  <div class="comment-input flex flex-direction-col flex-gap-regular">
    <div class="title-comment-input">Comment</div>
    <div class="flex flex-gap-regular w-100">
      <input
        type="text"
        class="input-field w-80"
        placeholder="input comment.."
        bind:value={newComment}
        on:keypress={(e) => { if (e.key === 'Enter') addComment(); }}
      >
      <button class="btn-add-comment no-decoration w-20" on:click={addComment}>
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  </div>
</div>

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
  <div class="vw-100 h-10 flex flex-center-vertical page-top">
    <div class="flex flex-between-horizontal flex-center-vertical">
      <i class="fa-solid fa-arrow-left arrow-back" on:click={() => history.back()}></i>
      <img src="{logo}" alt="" class="w-50">
    </div>
  </div>
  <div class="bg-primary vw-100 {post_detail_loaded == true ? "h-fit" : "mh-75"} template-post-bg flex flex-direction-col flex-gap-large {post_detail_loaded == false ? "flex-center-horizontal flex-center-vertical" : ""}" id="form-login">
  	{#if post_detail_loaded}
	    {#if post}
	      <div class="flex flex-gap-regular flex-center-vertical">
	        <div class="profilePhoto rounded-image" id="profilePhoto"></div>
	        <div class="user-name-poster">@{post.user_id}</div>
	      </div>
	      <img src="{post.photo}" alt="" class="w-100 rounded-20">
	      <div class="title-card-content">{post.title}</div>
	      <div class="content-card-detail">{post.caption}</div>
	      <div class="flex flex-gap-regular">
	        <div class="flex flex-center-vertical" on:click={handleLike}>
	          {#if hasLiked}
	            <i class="fa-solid fa-heart icon-detail-post"></i>
	            <div class="text-icon-detail-post">{post.like_count}</div>
	          {:else}
	            <i class="fa-regular fa-heart icon-detail-post"></i>
	            <div class="text-icon-detail-post">{post.like_count}</div>
	          {/if}
	        </div>
	        <div class="flex flex-center-vertical">
	          <i class="fa-regular fa-comment icon-detail-post"></i>
	          <div class="text-icon-detail-post">{post.comment_count}</div>
	        </div>
	      </div>
	      <div class="divider"></div>
	      {#if comments.length != 0}
	        {#each comments as comment}
	        {#if comment.parent_comment_id == null}
	          <div class="flex flex-direction-col flex-gap-regular">
	            <div class="flex flex-gap-regular flex-center-vertical w-100">
	              <div class="profilePhoto rounded-image" style="background-image: url({comment.profile_picture})"></div>
	              <div class="user-name-commenter w-90">@{comment.user_id}</div>
	            </div>
	            <div class="flex flex-gap-regular flex-center-vertical">
	              <div class="w-10"></div>
	              <div class="comment w-90">{comment.content}</div>
	            </div>
	            <div class="flex flex-gap-regular flex-center-vertical">
	              <div class="w-10"></div>
	              <div class="reply w-90" on:click={() => { comment.showReplyBox = !comment.showReplyBox; replyTo = comment.id; }}>
	                Reply
	              </div>
	            </div>
	            {#if replyTo === comment.id && comment.showReplyBox}
	              <div class="flex flex-gap-regular flex-center-vertical">
	                <div class="w-10"></div>
	                <div class="flex flex-gap-regular w-90">
	                  <input
	                    type="text"
	                    class="input-field w-70"
	                    placeholder="Reply to @{comment.user_id}.."
	                    bind:value={newReply}
	                    on:keypress={(e) => { if (e.key === 'Enter') addReply(comment.id); }}
	                  >
	                  <button class="btn-add-comment no-decoration w-30" on:click={() => addReply(comment.id)}>
	                    <i class="fa-solid fa-paper-plane"></i>
	                  </button>
	                </div>
	              </div>
	            {/if}
	            {#each comment.replies as reply}
	            <div class="flex flex-gap-regular flex-center-vertical" style="margin-top: 20px;">
	            	<div class="w-10"></div>
	            	<div class="flex flex-gap-regular flex-direction-col w-90">
	            		<div class="flex flex-gap-regular flex-center-vertical w-100">
			              <div class="profilePhoto rounded-image" style="background-image: url({reply.profile_picture})"></div>
			              <div class="user-name-commenter w-90">@{reply.user_id}</div>
			            </div>
			            <div class="flex flex-gap-regular flex-center-vertical w-100">
			              <div class="w-10"></div>
			              <div class="comment w-90" style="margin-left: 10px">{reply.content}</div>
			            </div>
	            	</div>
	            </div>
	            {/each}
	          </div>
	          {/if}
	        {/each}
	      {:else}
	        <div class="flex flex-center-horizontal w-100">
	          <div class="content-card-detail">No comments yet</div>
	        </div>
	      {/if}
	    {/if}
	{:else}
		<img src="{loading}" class="w-30">
	{/if}
  </div>
</section>