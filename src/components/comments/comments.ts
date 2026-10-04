import { createHTMLElement } from '../../helpers/dom';
import { getTimeAgoString } from '../../helpers/get-time-age-string';
import type { CommentData } from '../../helpers/interfaces';
import './comments.scss';

const comments = createHTMLElement({ tag: 'div' });
const title = createHTMLElement({ tag: 'h2', textContent: 'Comments' });

export const commentsPlaceholder = (): HTMLElement => {
  const commentWrapper = createHTMLElement({ tag: 'div' });

  const textarea = createHTMLElement({
    tag: 'textarea',
    attributes: [['placeholder', 'Write a comment...']],
  });

  const button = createHTMLElement({ tag: 'button', textContent: 'Send' });

  for (let index = 0; index < 3; index++) {
    comments.append(createCommentItem());
  }

  commentWrapper.append(title, textarea, button, comments);

  return commentWrapper;
};

const createCommentItem = (commentData?: CommentData) => {
  const authorName = commentData ? commentData.authorName : '';
  const timeString = commentData ? getTimeAgoString(commentData.createdAt) : '';
  const text = commentData ? commentData.text : '';
  const likesCount = commentData ? commentData.likesCount : 1;

  const container = createHTMLElement({ tag: 'article' });

  const name = createHTMLElement({ tag: 'span', textContent: authorName });
  const time = createHTMLElement({ tag: 'span', textContent: timeString });
  const commentText = createHTMLElement({ tag: 'p', textContent: text });
  const likesButton = createHTMLElement({
    tag: 'button',
    textContent: `Likes: ${likesCount}`,
  });

  container.append(name, time, commentText, likesButton);
  return container;
};

export const fillComments = (commentsData: CommentData[]) => {
  comments.replaceChildren(
    ...commentsData.map((commentData) => createCommentItem(commentData)),
  );
};
